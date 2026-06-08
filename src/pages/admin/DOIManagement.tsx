import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Link, Hash, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react'

interface Article {
  id: number
  title: string
  doi?: string
  issue: {
    volume: number
    issue_number: number
  }
  authors: {
    author: {
      name: string
    }
  }[]
}

export default function DOIManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<Set<number>>(new Set())
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles')
      setArticles(res.data)
    } catch (error) {
      console.error('Failed to fetch articles', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDOI = async (articleId: number) => {
    setGenerating(prev => new Set(prev).add(articleId))
    try {
      const res = await api.post(`/articles/${articleId}/doi`, {})
      fetchArticles()
      alert(`DOI generated: ${res.data.doi}`)
    } catch (error: any) {
      console.error('Failed to generate DOI', error)
      alert(error.message || 'Failed to generate DOI')
    } finally {
      setGenerating(prev => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
    }
  }

  const handleBatchGenerate = async () => {
    if (selectedArticles.size === 0) {
      alert('Please select at least one article')
      return
    }

    if (!confirm(`Generate DOIs for ${selectedArticles.size} articles?`)) {
      return
    }

    try {
      const res = await api.post('/articles/doi/batch', { article_ids: Array.from(selectedArticles) })
      
      const successCount = res.data.filter((r: any) => r.doi).length
      const failCount = res.data.length - successCount
      
      alert(`DOI generation completed:\nSuccess: ${successCount}\nFailed: ${failCount}`)
      setSelectedArticles(new Set())
      fetchArticles()
    } catch (error: any) {
      console.error('Failed to generate DOIs', error)
      alert(error.message || 'Failed to generate DOIs')
    }
  }

  const toggleArticleSelection = (articleId: number) => {
    setSelectedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }

  const selectAllWithoutDOI = () => {
    const withoutDOI = articles.filter(a => !a.doi).map(a => a.id)
    setSelectedArticles(new Set(withoutDOI))
  }

  const clearSelection = () => {
    setSelectedArticles(new Set())
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  const articlesWithoutDOI = articles.filter(a => !a.doi).length
  const articlesWithDOI = articles.filter(a => a.doi).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">DOI Management</h1>
        <div className="flex gap-2">
          <button
            onClick={selectAllWithoutDOI}
            disabled={articlesWithoutDOI === 0}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select All Without DOI
          </button>
          <button
            onClick={clearSelection}
            disabled={selectedArticles.size === 0}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Selection
          </button>
          <button
            onClick={handleBatchGenerate}
            disabled={selectedArticles.size === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Hash size={20} />
            Generate {selectedArticles.size} DOIs
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Articles</p>
                <p className="text-3xl font-bold text-slate-900">{articles.length}</p>
              </div>
              <div className="text-slate-300">
                <FileText size={40} />
              </div>
            </div>
          </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">With DOI</p>
              <p className="text-3xl font-bold text-green-600">{articlesWithDOI}</p>
            </div>
            <CheckCircle size={40} className="text-green-300" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Without DOI</p>
              <p className="text-3xl font-bold text-red-600">{articlesWithoutDOI}</p>
            </div>
            <XCircle size={40} className="text-red-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 w-12">
                  <input
                    type="checkbox"
                    checked={selectedArticles.size > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedArticles(new Set(articles.map(a => a.id)))
                      } else {
                        setSelectedArticles(new Set())
                      }
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Article</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">DOI</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Issue</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.id)}
                      onChange={() => toggleArticleSelection(article.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="font-medium text-slate-900 truncate">{article.title}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        {article.authors[0]?.author.name}
                        {article.authors.length > 1 && ` +${article.authors.length - 1}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {article.doi ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <code className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                          {article.doi}
                        </code>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle size={16} className="text-red-600" />
                        <span className="text-sm text-red-600">Not assigned</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      Vol {article.issue.volume}, Issue {article.issue.issue_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {article.doi ? (
                        <a
                          href={`https://doi.org/${article.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <Download size={14} />
                          View
                        </a>
                      ) : (
                        <button
                          onClick={() => handleGenerateDOI(article.id)}
                          disabled={generating.has(article.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                        >
                          {generating.has(article.id) ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Hash size={14} />
                              Generate DOI
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FileText({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  )
}
