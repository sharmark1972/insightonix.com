import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    issn: '',
    eissn: '',
    description: '',
    contact_email: '',
    address: '',
    institution: '',
    doi_prefix: ''
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        if (res.data) {
          setFormData({
            title: res.data.title || '',
            issn: res.data.issn || '',
            eissn: res.data.eissn || '',
            description: res.data.description || '',
            contact_email: res.data.contact_email || '',
            address: res.data.address || '',
            institution: res.data.institution || '',
            doi_prefix: res.data.doi_prefix || ''
          })
        }
      } catch (error) {
        console.error('Failed to fetch settings', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/settings', formData, token!)
      alert('Settings saved successfully')
    } catch (error: any) {
      alert(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Journal Settings</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Journal Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Print ISSN</label>
              <input
                type="text"
                value={formData.issn}
                onChange={(e) => setFormData({...formData, issn: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-ISSN</label>
              <input
                type="text"
                value={formData.eissn}
                onChange={(e) => setFormData({...formData, eissn: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">DOI Configuration</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DOI Prefix</label>
              <input
                type="text"
                value={formData.doi_prefix}
                onChange={(e) => setFormData({...formData, doi_prefix: e.target.value})}
                placeholder="e.g., 10.1234"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
              <p className="text-sm text-slate-500 mt-1">
                Enter your DOI prefix (e.g., 10.1234) to enable automatic DOI generation for articles.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 h-32"
            />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 h-24"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
