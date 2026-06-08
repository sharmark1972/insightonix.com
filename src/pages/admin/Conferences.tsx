import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Calendar, MapPin, Plus, Edit, Trash2, Search } from 'lucide-react'

interface Conference {
  id: number
  name: string
  description?: string
  venue?: string
  date?: string
  conference_year: number
  created_at: string
}

export default function AdminConferences() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    conference_year: new Date().getFullYear().toString()
  })

  useEffect(() => {
    fetchConferences()
  }, [])

  const fetchConferences = async () => {
    try {
      const res = await api.get('/certificates/conferences')
      setConferences(res.data)
    } catch (error) {
      console.error('Failed to fetch conferences', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/certificates/conferences/${editingId}`, formData)
      } else {
        await api.post('/certificates/conferences', formData)
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        venue: '',
        date: '',
        conference_year: new Date().getFullYear().toString()
      })
      fetchConferences()
    } catch (error: any) {
      console.error('Failed to save conference', error)
      alert(error.message || 'Failed to save conference')
    }
  }

  const handleEdit = (conference: Conference) => {
    setEditingId(conference.id)
    setFormData({
      name: conference.name,
      description: conference.description || '',
      venue: conference.venue || '',
      date: conference.date ? new Date(conference.date).toISOString().split('T')[0] : '',
      conference_year: conference.conference_year.toString()
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this conference?')) return
    
    try {
      await api.delete(`/certificates/conferences/${id}`)
      fetchConferences()
    } catch (error: any) {
      console.error('Failed to delete conference', error)
      alert(error.message || 'Failed to delete conference')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Conferences</h1>
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({
              name: '',
              description: '',
              venue: '',
              date: '',
              conference_year: new Date().getFullYear().toString()
            })
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          New Conference
        </button>
      </div>

      <div className="grid gap-6">
        {conferences.map((conference) => (
          <div key={conference.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{conference.name}</h3>
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm mb-4">
                  {conference.date && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(conference.date).toLocaleDateString()}
                    </div>
                  )}
                  {conference.venue && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {conference.venue}
                    </div>
                  )}
                  <div className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                    Year: {conference.conference_year}
                  </div>
                </div>
                {conference.description && (
                  <p className="text-slate-600">{conference.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(conference)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(conference.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {conferences.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
            No conferences found. Create one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingId ? 'Edit Conference' : 'New Conference'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Conference Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.conference_year}
                    onChange={(e) => setFormData({ ...formData, conference_year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Save Changes' : 'Create Conference'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
