import { useEffect, useState, useRef } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react'

export default function AdminBoardMembers() {
  const { token } = useAuthStore()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    affiliation: '',
    email: '',
    profile_image: '',
    role: '',
    display_order: ''
  })

  const fetchMembers = async () => {
    try {
      const res = await api.get('/board-members')
      setMembers(res.data)
    } catch (error) {
      console.error('Failed to fetch members', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      
      setUploading(true)
      try {
        const res = await api.post('/upload', formData, token!)
        setFormData(prev => ({ ...prev, profile_image: res.data.url }))
      } catch (error: any) {
        alert(error.message || 'Failed to upload image')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/board-members/${editingId}`, formData, token!)
      } else {
        await api.post('/board-members', formData, token!)
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: '',
        title: '',
        affiliation: '',
        email: '',
        profile_image: '',
        role: '',
        display_order: ''
      })
      fetchMembers()
    } catch (error) {
      alert('Failed to save member')
    }
  }

  const handleEdit = (member: any) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      title: member.title || '',
      affiliation: member.affiliation || '',
      email: member.email || '',
      profile_image: member.profile_image || '',
      role: member.role || '',
      display_order: String(member.display_order || '')
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/board-members/${id}`, token!)
        fetchMembers()
      } catch (error: any) {
        alert(error.message || 'Failed to delete member')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Editorial Board</h1>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ name: '', title: '', affiliation: '', email: '', profile_image: '', role: '', display_order: '' })
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title (e.g. PhD)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Affiliation</label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role (e.g. Editor-in-Chief)</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.profile_image}
                    onChange={(e) => setFormData({...formData, profile_image: e.target.value})}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                  >
                    {uploading ? '...' : <Upload size={20} />}
                  </button>
                </div>
                {formData.profile_image && (
                  <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-slate-200">
                    <img src={formData.profile_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Name</th>
              <th className="px-6 py-4 font-bold text-slate-700">Role</th>
              <th className="px-6 py-4 font-bold text-slate-700">Affiliation</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                      {member.profile_image ? <img src={member.profile_image} className="w-full h-full object-cover" /> : null}
                    </div>
                    {member.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {member.role || '-'}
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  {member.affiliation || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No board members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
