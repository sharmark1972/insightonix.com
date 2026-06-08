import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { FileText, Download, ChevronLeft, BookOpen, Calendar, Users } from 'lucide-react'
import SEO from '../components/SEO'

export default function IssueDetails() {
  const { id } = useParams()
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`)
        setIssue(res.data)
      } catch (error) {
        console.error('Failed to fetch issue', error)
      } finally {
        setLoading(false)
      }
    }
    fetchIssue()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }
  if (!issue) return <div className="text-center py-20 text-slate-500">Issue not found</div>

  return (
    <div className="py-12">
      <div className="journal-container max-w-5xl">
        <SEO 
          title={`Vol ${issue.volume}, Issue ${issue.issue_number} - ${issue.title || 'Issue Details'}`}
          description={issue.description || `Volume ${issue.volume}, Issue ${issue.issue_number} of Global Insights Journal.`}
          image={issue.cover_image}
          publishedTime={issue.publication_date}
        />

        {/* Breadcrumb */}
        <Link to="/issues" className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Archives
        </Link>

        {/* Issue header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            {/* Cover side */}
            <div className="md:w-64 bg-gradient-to-br from-blue-900 to-blue-950 p-8 flex flex-col items-center justify-center text-white">
              <div className="w-36 h-48 bg-white/10 backdrop-blur rounded-lg shadow-xl mb-4 flex items-center justify-center border border-white/20 overflow-hidden">
                {issue.cover_image ? (
                  <img src={issue.cover_image} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-3">
                    <BookOpen className="mx-auto mb-1 text-blue-300" size={28} />
                    <p className="text-[10px] text-blue-300 font-serif">Vol. {issue.volume}, No. {issue.issue_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info side */}
            <div className="flex-1 p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-primary">Volume {issue.volume}</span>
                <span className="badge badge-primary">Issue {issue.issue_number}</span>
                {issue.publication_date && (
                  <span className="badge badge-success">Published</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
                Volume {issue.volume}, Issue {issue.issue_number}
              </h1>
              {issue.title && (
                <p className="text-lg text-slate-600 italic font-serif mb-3">{issue.title}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {issue.publication_date
                    ? new Date(issue.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : 'Forthcoming'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={14} />
                  {issue.articles?.length || 0} Articles
                </span>
              </div>
              {issue.description && (
                <p className="text-slate-600 mt-4 text-sm leading-relaxed">{issue.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Table of Contents</h2>
            <span className="text-xs text-slate-400">{issue.articles?.length || 0} articles</span>
          </div>

          <div className="divide-y divide-slate-100">
            {issue.articles?.map((article: any, idx: number) => (
              <div key={article.id} className="article-item">
                <div className="flex gap-4">
                  <div className="text-xl font-serif font-bold text-slate-200 w-8 flex-shrink-0 pt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 leading-snug mb-1.5">
                      <Link to={`/articles/${article.id}`} className="hover:text-blue-800 transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-slate-500 mb-2 flex items-center gap-1.5">
                      <Users size={13} />
                      {article.authors?.map((a: any) => a.author.name).join(', ')}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>pp. {article.page_start}–{article.page_end}</span>
                      {article.doi && (
                        <span className="doi-link">DOI: {article.doi}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <Link
                      to={`/articles/${article.id}`}
                      className="btn-outline text-xs py-1.5 px-3"
                    >
                      <FileText size={14} /> Abstract
                    </Link>
                    {article.pdf_url && (
                      <a
                        href={article.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        <Download size={14} /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(!issue.articles || issue.articles.length === 0) && (
              <div className="py-16 text-center text-slate-400">
                <FileText className="mx-auto mb-3 text-slate-300" size={36} />
                <p className="font-medium">No articles in this issue yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
