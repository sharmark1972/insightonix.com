import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Plus, Edit, Trash2, X } from 'lucide-react'

export default function AdminIssues() {
  const { token } = useAuthStore()
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    volume: '',
    issue_number: '',
    title: '',
    publication_date: '',
    cover_image: '',
    description: ''
  })

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues')
      setIssues(res.data)
    } catch (error) {
      console.error('Failed to fetch issues', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/issues/${editingId}`, formData, token!)
      } else {
        await api.post('/issues', formData, token!)
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        volume: '',
        issue_number: '',
        title: '',
        publication_date: '',
        cover_image: '',
        description: ''
      })
      fetchIssues()
    } catch (error) {
      alert('Failed to save issue')
    }
  }

  const handleEdit = (issue: any) => {
    setEditingId(issue.id)
    setFormData({
      volume: issue.volume,
      issue_number: issue.issue_number,
      title: issue.title || '',
      publication_date: issue.publication_date ? issue.publication_date.split('T')[0] : '',
      cover_image: issue.cover_image || '',
      description: issue.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      try {
        await api.delete(`/issues/${id}`, token!)
        fetchIssues()
      } catch (error) {
        alert('Failed to delete issue')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Issues</h1>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ volume: '', issue_number: '', title: '', publication_date: '', cover_image: '', description: '' })
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Issue
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Issue' : 'Create New Issue'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volume</label>
                <input
                  type="number"
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Number</label>
                <input
                  type="number"
                  value={formData.issue_number}
                  onChange={(e) => setFormData({...formData, issue_number: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication Date</label>
              <input
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData({...formData, publication_date: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 h-24"
              />
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
                {editingId ? 'Update Issue' : 'Create Issue'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Volume/Issue</th>
              <th className="px-6 py-4 font-bold text-slate-700">Title</th>
              <th className="px-6 py-4 font-bold text-slate-700">Date</th>
              <th className="px-6 py-4 font-bold text-slate-700">Articles</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  Vol. {issue.volume}, No. {issue.issue_number}
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  {issue.title || '-'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {issue.publication_date ? new Date(issue.publication_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {issue._count?.articles || 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(issue)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(issue.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {issues.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No issues found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
