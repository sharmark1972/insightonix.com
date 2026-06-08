import { useEffect, useRef, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Plus, Edit, Trash2, X, Upload, FileText, Loader2 } from 'lucide-react'

export default function AdminArticles() {
  const { token } = useAuthStore()
  const [articles, setArticles] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')
  const pdfInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    issue_id: '',
    title: '',
    abstract: '',
    keywords: '',
    doi: '',
    pdf_url: '',
    page_start: '',
    page_end: '',
    submission_date: '',
    acceptance_date: '',
    // Basic single author input for simplicity in this MVP
    author_name: '',
    author_email: '',
    author_affiliation: ''
  })

  const fetchData = async () => {
    try {
      const [articlesRes, issuesRes] = await Promise.all([
        api.get('/articles'),
        api.get('/issues')
      ])
      setArticles(articlesRes.data)
      setIssues(issuesRes.data)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Construct authors array for creation
      const authors = editingId ? undefined : [{
        name: formData.author_name,
        email: formData.author_email,
        affiliation: formData.author_affiliation,
        is_corresponding: true
      }]

      const payload = {
        ...formData,
        authors
      }

      if (editingId) {
        await api.put(`/articles/${editingId}`, formData, token!)
      } else {
        await api.post('/articles', payload, token!)
      }
      setShowForm(false)
      setEditingId(null)
      setPdfFileName('')
      // Reset form
      setFormData({
        issue_id: '',
        title: '',
        abstract: '',
        keywords: '',
        doi: '',
        pdf_url: '',
        page_start: '',
        page_end: '',
        submission_date: '',
        acceptance_date: '',
        author_name: '',
        author_email: '',
        author_affiliation: ''
      })
      fetchData()
    } catch (error) {
      alert('Failed to save article')
    }
  }

  const handleEdit = (article: any) => {
    setEditingId(article.id)
    setFormData({
      issue_id: String(article.issue_id),
      title: article.title,
      abstract: article.abstract || '',
      keywords: article.keywords || '',
      doi: article.doi || '',
      pdf_url: article.pdf_url || '',
      page_start: String(article.page_start || ''),
      page_end: String(article.page_end || ''),
      submission_date: article.submission_date ? article.submission_date.split('T')[0] : '',
      acceptance_date: article.acceptance_date ? article.acceptance_date.split('T')[0] : '',
      author_name: '', // Not editing authors in this simple view
      author_email: '',
      author_affiliation: ''
    })
    setPdfFileName('')
    setShowForm(true)
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfUploading(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      const res = await api.post('/upload/pdf', formData, token!)
      setFormData(prev => ({ ...prev, pdf_url: res.data.url }))
      setPdfFileName(res.data.originalName || file.name)
    } catch (error) {
      alert('Failed to upload PDF')
    } finally {
      setPdfUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/articles/${id}`, token!)
        fetchData()
      } catch (error: any) {
        alert(error.message || 'Failed to delete article')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Articles</h1>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({
                issue_id: '',
                title: '',
                abstract: '',
                keywords: '',
                doi: '',
                pdf_url: '',
                page_start: '',
                page_end: '',
                submission_date: '',
                acceptance_date: '',
                author_name: '',
                author_email: '',
                author_affiliation: ''
            })
            setPdfFileName('')
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Article' : 'Create New Article'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue</label>
              <select
                value={formData.issue_id}
                onChange={(e) => setFormData({...formData, issue_id: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Issue</option>
                {issues.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    Vol. {issue.volume}, No. {issue.issue_number} ({issue.publication_date ? new Date(issue.publication_date).getFullYear() : 'Unpublished'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Author fields only shown on create for simplicity */}
            {!editingId && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Primary Author</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-blue-500"
                      required={!editingId}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.author_email}
                      onChange={(e) => setFormData({...formData, author_email: e.target.value})}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Affiliation</label>
                    <input
                      type="text"
                      value={formData.author_affiliation}
                      onChange={(e) => setFormData({...formData, author_affiliation: e.target.value})}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Abstract</label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DOI</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={(e) => setFormData({...formData, doi: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PDF</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.pdf_url}
                      onChange={(e) => { setFormData({...formData, pdf_url: e.target.value}); setPdfFileName('') }}
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
                      {pdfUploading ? 'Uploading…' : 'Upload PDF'}
                    </button>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                    />
                  </div>
                  {pdfFileName && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5">
                      <FileText size={13} />
                      <span className="truncate">{pdfFileName}</span>
                    </div>
                  )}
                  {formData.pdf_url && !pdfFileName && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FileText size={13} />
                      <a href={formData.pdf_url} target="_blank" rel="noreferrer" className="hover:underline truncate">{formData.pdf_url}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Page Start</label>
                <input
                  type="number"
                  value={formData.page_start}
                  onChange={(e) => setFormData({...formData, page_start: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Page End</label>
                <input
                  type="number"
                  value={formData.page_end}
                  onChange={(e) => setFormData({...formData, page_end: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Submitted</label>
                <input
                  type="date"
                  value={formData.submission_date}
                  onChange={(e) => setFormData({...formData, submission_date: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Accepted</label>
                <input
                  type="date"
                  value={formData.acceptance_date}
                  onChange={(e) => setFormData({...formData, acceptance_date: e.target.value})}
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
                {editingId ? 'Update Article' : 'Create Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Title</th>
              <th className="px-6 py-4 font-bold text-slate-700">Issue</th>
              <th className="px-6 py-4 font-bold text-slate-700">Authors</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900 font-medium max-w-md truncate">
                  {article.title}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  Vol {article.issue?.volume}, No {article.issue?.issue_number}
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  {article.authors?.map((a: any) => a.author.name).join(', ')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No articles found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
