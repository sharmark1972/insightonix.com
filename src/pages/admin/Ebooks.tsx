import { useEffect, useRef, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Plus, Edit, Trash2, X, Upload, Loader2, BookOpen } from 'lucide-react'

const emptyForm = {
  title: '',
  isbn: '',
  author: '',
  publisher: '',
  published_year: '',
  description: '',
  cover_image: '',
  pdf_url: ''
}

export default function AdminEbooks() {
  const { token } = useAuthStore()
  const [ebooks, setEbooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')
  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ ...emptyForm })

  const fetchData = async () => {
    try {
      const res = await api.get('/ebooks')
      setEbooks(res.data)
    } catch (error) {
      console.error('Failed to fetch ebooks', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setFormData({ ...emptyForm })
    setEditingId(null)
    setPdfFileName('')
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/ebooks/${editingId}`, formData, token!)
      } else {
        await api.post('/ebooks', formData, token!)
      }
      resetForm()
      fetchData()
    } catch (error: any) {
      alert(error.message || 'Failed to save ebook')
    }
  }

  const handleEdit = (ebook: any) => {
    setEditingId(ebook.id)
    setFormData({
      title: ebook.title || '',
      isbn: ebook.isbn || '',
      author: ebook.author || '',
      publisher: ebook.publisher || '',
      published_year: ebook.published_year ? String(ebook.published_year) : '',
      description: ebook.description || '',
      cover_image: ebook.cover_image || '',
      pdf_url: ebook.pdf_url || ''
    })
    setPdfFileName('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return
    try {
      await api.delete(`/ebooks/${id}`, token!)
      fetchData()
    } catch (error: any) {
      alert(error.message || 'Failed to delete ebook')
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post('/upload', fd, token!)
      setFormData(prev => ({ ...prev, cover_image: res.data.url }))
    } catch {
      alert('Failed to upload cover image')
    } finally {
      setCoverUploading(false)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfUploading(true)
    try {
      const fd = new FormData()
      fd.append('pdf', file)
      const res = await api.post('/upload/pdf', fd, token!)
      setFormData(prev => ({ ...prev, pdf_url: res.data.url }))
      setPdfFileName(res.data.originalName || file.name)
    } catch {
      alert('Failed to upload PDF')
    } finally {
      setPdfUploading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Ebooks</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Ebook
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Ebook' : 'Add New Ebook'}</h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* ISBN + Author */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  placeholder="978-3-16-148410-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author(s)</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Publisher + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Published Year</label>
                <input
                  type="number"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 h-28"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                    placeholder="https://... or upload"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={coverUploading}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-50 transition-colors"
                  >
                    {coverUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {coverUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </div>
                {formData.cover_image && (
                  <img src={formData.cover_image} alt="Cover preview" className="w-20 h-28 object-cover rounded border border-slate-200 flex-shrink-0" />
                )}
              </div>
            </div>

            {/* PDF */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PDF File</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.pdf_url}
                    onChange={(e) => { setFormData({ ...formData, pdf_url: e.target.value }); setPdfFileName('') }}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                    placeholder="https://... or upload below"
                  />
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={pdfUploading}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {pdfUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {pdfUploading ? 'Uploading...' : 'Upload PDF'}
                  </button>
                  <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </div>
                {pdfFileName && <p className="text-xs text-green-600">Uploaded: {pdfFileName}</p>}
                {formData.pdf_url && !pdfFileName && (
                  <p className="text-xs text-slate-500 truncate">{formData.pdf_url}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Update Ebook' : 'Add Ebook'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : ebooks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-500">No ebooks yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Cover</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ISBN</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">PDF</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ebooks.map((ebook) => (
                <tr key={ebook.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    {ebook.cover_image ? (
                      <img src={ebook.cover_image} alt={ebook.title} className="w-10 h-14 object-cover rounded border border-slate-200" />
                    ) : (
                      <div className="w-10 h-14 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                        <BookOpen size={16} className="text-slate-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                    <div className="line-clamp-2">{ebook.title}</div>
                    {ebook.publisher && <div className="text-xs text-slate-400 mt-0.5">{ebook.publisher}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ebook.isbn || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{ebook.author || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{ebook.published_year || '—'}</td>
                  <td className="px-4 py-3">
                    {ebook.pdf_url ? (
                      <a href={ebook.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs">View PDF</a>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(ebook)} className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(ebook.id)} className="p-1.5 text-slate-500 hover:text-red-600 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
