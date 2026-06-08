import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { BookOpen, Calendar, FileText, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'

export default function Issues() {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchIssues()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  // Group by volume
  const volumeMap: Record<number, any[]> = {}
  issues.forEach((issue) => {
    if (!volumeMap[issue.volume]) volumeMap[issue.volume] = []
    volumeMap[issue.volume].push(issue)
  })
  const volumes = Object.keys(volumeMap).map(Number).sort((a, b) => b - a)

  return (
    <div className="py-12">
      <div className="journal-container">
        <SEO 
          title="Issue Archive"
          description="Browse all past and current issues of Global Insights Journal."
          keywords="issues, archives, volumes, publications, journal archives"
        />

        {/* Page header */}
        <div className="mb-12">
          <h1 className="section-title">Issue Archive</h1>
          <p className="text-slate-500 max-w-2xl">
            Browse our complete archive of published issues. Each issue contains peer-reviewed research articles across multiple disciplines.
          </p>
        </div>

        {/* Volumes */}
        <div className="space-y-12">
          {volumes.map((vol) => (
            <div key={vol}>
              <h2 className="text-lg font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-900 text-white text-xs font-bold rounded-lg">
                  V{vol}
                </span>
                Volume {vol}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volumeMap[vol].map((issue: any) => (
                  <Link
                    key={issue.id}
                    to={`/issues/${issue.id}`}
                    className="card group overflow-hidden"
                  >
                    {/* Cover */}
                    <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center relative overflow-hidden">
                      {issue.cover_image ? (
                        <img src={issue.cover_image} alt={`Cover Vol ${issue.volume}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <BookOpen className="text-blue-300/50 mx-auto mb-2" size={40} />
                          <p className="text-blue-200 font-serif text-lg font-bold">Vol. {issue.volume}</p>
                          <p className="text-blue-300 text-sm">Issue {issue.issue_number}</p>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-white/20 backdrop-blur text-white text-[10px] border border-white/20">
                          {issue._count?.articles || 0} Articles
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                        Vol. {issue.volume}, No. {issue.issue_number}
                      </h3>
                      {issue.title && (
                        <p className="text-sm text-slate-600 mt-1 italic line-clamp-1">{issue.title}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                        <Calendar size={12} />
                        <span>
                          {issue.publication_date
                            ? new Date(issue.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Forthcoming'}
                        </span>
                      </div>
                      {issue.description && (
                        <p className="text-sm text-slate-500 mt-3 line-clamp-2">{issue.description}</p>
                      )}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <FileText size={12} />
                          <span>{issue._count?.articles || 0} articles</span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium group-hover:text-blue-800 flex items-center gap-1">
                          Browse <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Issues Yet</h3>
            <p className="text-slate-500">Published issues will appear here. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
