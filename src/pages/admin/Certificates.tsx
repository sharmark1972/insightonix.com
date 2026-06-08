import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Award, Calendar, FileText, Download, Trash2, Plus } from 'lucide-react'

interface Conference {
  id: number
  name: string
  description?: string
  venue?: string
  date?: string
  conference_year: number
  certificates: Certificate[]
}

interface Certificate {
  id: number
  type: string
  recipient_name: string
  recipient_email?: string
  format?: string
  certificate_url?: string
  issue_date: string
}

export default function Certificates() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'conference' | 'reviewer' | 'editorial'>('conference')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'conference' | 'reviewer' | 'editorial'>('conference')

  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    conference_id: '',
    role: '',
    year: new Date().getFullYear().toString(),
    articles_reviewed: '0',
    format: 'classic'
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

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = `/certificates/${modalType}-certificates/generate`
      await api.post(endpoint, formData)
      setShowModal(false)
      setFormData({
        recipient_name: '',
        recipient_email: '',
        conference_id: '',
        role: '',
        year: new Date().getFullYear().toString(),
        articles_reviewed: '0',
        format: 'classic'
      })
      if (activeTab === 'conference') {
        fetchConferences()
      }
    } catch (error: any) {
      console.error('Failed to generate certificate', error)
      alert(error.message || 'Failed to generate certificate')
    }
  }

  const handleDownloadCertificate = (url?: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Certificates Management</h1>
        <button
          onClick={() => {
            setModalType(activeTab)
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Generate Certificate
        </button>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('conference')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'conference'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Conference
        </button>
        <button
          onClick={() => setActiveTab('reviewer')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'reviewer'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Reviewer
        </button>
        <button
          onClick={() => setActiveTab('editorial')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'editorial'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Editorial
        </button>
      </div>

      {activeTab === 'conference' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Conference</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Year</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Certificates</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conferences.map((conference) => (
                  <tr key={conference.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{conference.name}</div>
                      {conference.venue && (
                        <div className="text-sm text-slate-500">{conference.venue}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Calendar size={16} />
                        {conference.conference_year}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                        {conference.certificates.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setModalType('conference')
                          setFormData({ ...formData, conference_id: conference.id.toString() })
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Add Certificate
                      </button>
                    </td>
                  </tr>
                ))}
                {conferences.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No conferences found. Create one to start generating certificates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reviewer' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 mb-4">Generate reviewer appreciation certificates for contributors.</p>
          <button
            onClick={() => {
              setModalType('reviewer')
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Generate Reviewer Certificate
          </button>
        </div>
      )}

      {activeTab === 'editorial' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 mb-4">Generate editorial recognition certificates for board members.</p>
          <button
            onClick={() => {
              setModalType('editorial')
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Generate Editorial Certificate
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Generate {modalType === 'conference' ? 'Conference' : modalType === 'reviewer' ? 'Reviewer' : 'Editorial'} Certificate
            </h2>
            
            <form onSubmit={handleGenerateCertificate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={formData.recipient_email}
                  onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {modalType === 'conference' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Conference *
                  </label>
                  <select
                    required
                    value={formData.conference_id}
                    onChange={(e) => setFormData({ ...formData, conference_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a conference</option>
                    {conferences.map((conf) => (
                      <option key={conf.id} value={conf.id}>
                        {conf.name} ({conf.conference_year})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalType === 'reviewer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Articles Reviewed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.articles_reviewed}
                      onChange={(e) => setFormData({ ...formData, articles_reviewed: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {modalType === 'editorial' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Editor-in-Chief, Associate Editor"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Certificate Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="elegant">Elegant</option>
                </select>
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
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
