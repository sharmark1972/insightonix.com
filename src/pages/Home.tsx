import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { ArrowRight, BookOpen, Users, Award, Shield, Globe, FileCheck, ChevronRight, Download, Clock, TrendingUp } from 'lucide-react'
import SEO from '../components/SEO'

export default function Home() {
  const [journal, setJournal] = useState<any>(null)
  const [latestIssue, setLatestIssue] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, issuesRes] = await Promise.all([
          api.get('/settings'),
          api.get('/issues')
        ])
        
        setJournal(settingsRes.data)
        setIssues(issuesRes.data || [])
        if (issuesRes.data && issuesRes.data.length > 0) {
          const latestIssueRes = await api.get(`/issues/${issuesRes.data[0].id}`)
          setLatestIssue(latestIssueRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  const totalArticles = issues.reduce((sum: number, i: any) => sum + (i._count?.articles || 0), 0)

  return (
    <div>
      <SEO 
        title="Home"
        description={journal?.description || "A peer-reviewed academic journal for advanced research."}
        keywords="academic journal, research, peer-reviewed, open access, global insights journal, scholarly articles"
      />

      {/* Hero Section */}
      <section className="hero-gradient hero-pattern" style={{ color: '#000000' }}>
        <div className="journal-container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: '#000000', border: '1px solid rgba(0,0,0,0.15)' }}>Open Access</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: '#000000', border: '1px solid rgba(0,0,0,0.15)' }}>Peer Reviewed</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: '#000000', border: '1px solid rgba(0,0,0,0.15)' }}>Scopus Indexed</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6" style={{ color: '#000000' }}>
              {journal?.title || 'Global Insights Journal'}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl" style={{ color: '#1f2937' }}>
              {journal?.description || 'A peer-reviewed academic journal publishing cutting-edge research across disciplines to advance global knowledge and innovation.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg" style={{ color: '#1a365d' }}>
                Submit Your Paper <ArrowRight size={18} />
              </Link>
              <Link to="/issues" className="inline-flex items-center gap-2 border-2 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.3)', color: '#000000' }}>
                Browse Archives <BookOpen size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journal Metrics */}
      <section className="bg-white border-b border-slate-200 shadow-sm relative -mt-1">
        <div className="journal-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            <div className="stat-card py-8">
              <div className="stat-number">{issues.length}</div>
              <div className="stat-label">Published Issues</div>
            </div>
            <div className="stat-card py-8">
              <div className="stat-number">{totalArticles}</div>
              <div className="stat-label">Research Articles</div>
            </div>
            <div className="stat-card py-8">
              <div className="stat-number">5.2</div>
              <div className="stat-label">Impact Factor</div>
            </div>
            <div className="stat-card py-8">
              <div className="stat-number">150+</div>
              <div className="stat-label">Global Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Issue & Featured Articles */}
      {latestIssue && (
        <section className="py-16 bg-slate-50">
          <div className="journal-container">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="section-title mb-2">Current Issue</h2>
                <p className="text-slate-500 text-sm">
                  Volume {latestIssue.volume}, Issue {latestIssue.issue_number} &middot;{' '}
                  {latestIssue.publication_date
                    ? new Date(latestIssue.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : 'In Progress'}
                </p>
              </div>
              <Link to={`/issues/${latestIssue.id}`} className="btn-primary hidden md:inline-flex">
                View Full Issue <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="lg:flex">
                {/* Issue cover sidebar */}
                <div className="lg:w-72 bg-gradient-to-br from-blue-900 to-blue-950 p-8 flex flex-col items-center justify-center text-center text-white">
                  <div className="w-44 h-60 bg-white/10 backdrop-blur rounded-lg shadow-2xl mb-6 flex items-center justify-center border border-white/20 overflow-hidden">
                    {latestIssue.cover_image ? (
                      <img src={latestIssue.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center px-4">
                        <BookOpen className="mx-auto mb-2 text-blue-300" size={32} />
                        <p className="text-xs text-blue-300 font-serif">Vol. {latestIssue.volume}</p>
                        <p className="text-xs text-blue-300 font-serif">No. {latestIssue.issue_number}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-bold">Vol. {latestIssue.volume}, No. {latestIssue.issue_number}</h3>
                  <p className="text-blue-200 text-sm mt-1">
                    {latestIssue.publication_date
                      ? new Date(latestIssue.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : 'Current'}
                  </p>
                  <p className="text-blue-300 text-xs mt-3">
                    {latestIssue.articles?.length || 0} Articles
                  </p>
                </div>

                {/* Articles list */}
                <div className="lg:flex-1">
                  <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Table of Contents</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {latestIssue.articles?.slice(0, 5).map((article: any, idx: number) => (
                      <div key={article.id} className="article-item">
                        <div className="flex gap-4">
                          <div className="text-2xl font-serif font-bold text-slate-200 w-8 flex-shrink-0 pt-0.5">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/articles/${article.id}`} className="text-base font-serif font-semibold text-slate-900 hover:text-blue-800 transition-colors leading-snug block">
                              {article.title}
                            </Link>
                            <p className="text-sm text-slate-500 mt-1.5">
                              {article.authors?.map((a: any) => a.author.name).join(', ')}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                              <span>pp. {article.page_start}–{article.page_end}</span>
                              {article.doi && (
                                <span className="doi-link">DOI: {article.doi}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex items-start gap-2">
                            <Link to={`/articles/${article.id}`} className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors" title="View Article">
                              <ChevronRight size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {latestIssue.articles?.length > 5 && (
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center">
                      <Link to={`/issues/${latestIssue.id}`} className="text-sm text-blue-700 font-medium hover:text-blue-900">
                        View all {latestIssue.articles.length} articles →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link to={`/issues/${latestIssue.id}`} className="btn-primary">
                View Full Issue <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Journal Highlights */}
      <section className="py-16 bg-white">
        <div className="journal-container">
          <h2 className="section-title-center">Why Publish With Us</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-100 transition-colors">
                <Shield className="text-blue-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Rigorous Peer Review</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Double-blind peer review by international experts ensuring the highest standards of academic integrity and quality.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald-100 transition-colors">
                <Globe className="text-emerald-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Global Visibility</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Indexed in Scopus, Web of Science, and major databases, maximizing the reach and impact of your research.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-amber-100 transition-colors">
                <Clock className="text-amber-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Fast Publication</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Streamlined submission-to-publication process with average turnaround of 4–6 weeks for accepted manuscripts.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-purple-100 transition-colors">
                <BookOpen className="text-purple-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Open Access</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                All articles are freely accessible, ensuring unrestricted knowledge sharing and maximum research impact.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-rose-100 transition-colors">
                <FileCheck className="text-rose-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">DOI Assignment</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every published article receives a unique Digital Object Identifier for permanent citation and discoverability.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-teal-100 transition-colors">
                <Award className="text-teal-700" size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Author Recognition</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Annual best paper awards and certificates to recognize outstanding contributions to your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="journal-container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Call for Papers</h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            We invite researchers, scholars, and practitioners to submit original research articles, reviews, and case studies for our upcoming issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg text-sm">
              Submit Manuscript <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm">
              Author Guidelines <FileCheck size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Indexing & Abstracting */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="journal-container">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Indexed &amp; Abstracted In
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Scopus', 'Web of Science', 'DOAJ', 'CrossRef', 'Google Scholar', 'EBSCO'].map((name) => (
              <div key={name} className="text-slate-300 font-serif font-bold text-lg md:text-xl hover:text-slate-500 transition-colors cursor-default">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
