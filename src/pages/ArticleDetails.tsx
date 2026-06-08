import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Download, Calendar, User, ChevronLeft, BookOpen, FileText, Share2, Bookmark, Copy, Check } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function ArticleDetails() {
  const { id } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [journalInfo, setJournalInfo] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, settingsRes] = await Promise.all([
          api.get(`/articles/${id}`),
          api.get('/settings')
        ])
        setArticle(articleRes.data)
        setJournalInfo(settingsRes.data)
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }
  if (!article) return <div className="text-center py-20 text-slate-500">Article not found</div>

  const publicationDate = article.issue?.publication_date
    ? new Date(article.issue.publication_date).toISOString().split('T')[0]
    : ''
  const publicationYear = publicationDate ? publicationDate.split('-')[0] : ''
  const pubDateDisplay = article.issue?.publication_date
    ? new Date(article.issue.publication_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Forthcoming'

  const citationText = `${article.authors?.map((a: any) => a.author.name).join(', ')} (${publicationYear}). "${article.title}." ${journalInfo?.title || 'Global Insights Journal'}, Vol. ${article.issue?.volume}, No. ${article.issue?.issue_number}, pp. ${article.page_start}–${article.page_end}.${article.doi ? ` DOI: ${article.doi}` : ''}`

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": article.title,
    "image": article.issue?.cover_image || "",
    "datePublished": publicationDate,
    "author": article.authors?.map((a: any) => ({
      "@type": "Person",
      "name": a.author.name,
      "affiliation": a.author.affiliation ? {
        "@type": "Organization",
        "name": a.author.affiliation
      } : undefined
    })),
    "publisher": {
      "@type": "Organization",
      "name": journalInfo?.title || "Global Insights Journal",
      "logo": { "@type": "ImageObject", "url": "/favicon.svg" }
    },
    "description": article.abstract,
    "pageStart": article.page_start,
    "pageEnd": article.page_end,
    "isPartOf": {
      "@type": "PublicationIssue",
      "issueNumber": article.issue?.issue_number,
      "datePublished": publicationDate,
      "isPartOf": {
        "@type": "Periodical",
        "name": journalInfo?.title || "Global Insights Journal",
        "issn": journalInfo?.issn
      }
    }
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <Helmet>
        <title>{article.title} | {journalInfo?.title || 'Global Insights Journal'}</title>
        <meta name="description" content={article.abstract} />
        <meta name="citation_title" content={article.title} />
        {article.authors?.map((a: any) => (
          <meta key={a.author_id} name="citation_author" content={a.author.name} />
        ))}
        {journalInfo?.institution && <meta name="citation_author_institution" content={journalInfo.institution} />}
        <meta name="citation_publication_date" content={publicationYear} />
        {publicationDate && <meta name="citation_online_date" content={publicationDate.replace(/-/g, '/')} />}
        <meta name="citation_journal_title" content={journalInfo?.title || "Global Insights Journal"} />
        {journalInfo?.issn && <meta name="citation_issn" content={journalInfo.issn} />}
        {article.issue?.volume && <meta name="citation_volume" content={article.issue.volume} />}
        {article.issue?.issue_number && <meta name="citation_issue" content={article.issue.issue_number} />}
        {article.page_start && <meta name="citation_firstpage" content={article.page_start} />}
        {article.page_end && <meta name="citation_lastpage" content={article.page_end} />}
        {article.doi && <meta name="citation_doi" content={article.doi} />}
        {article.pdf_url && <meta name="citation_pdf_url" content={article.pdf_url} />}
        {article.abstract && <meta name="citation_abstract" content={article.abstract} />}
        {article.keywords && <meta name="citation_keywords" content={article.keywords} />}
        <meta name="citation_language" content="en" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="journal-container">
        {/* Breadcrumb */}
        <Link to={`/issues/${article.issue_id}`} className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 mb-8 group no-print">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Issue
        </Link>

        <div className="lg:flex gap-8">
          {/* Main content */}
          <div className="lg:flex-1 min-w-0">
            <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Article type bar */}
              <div className="px-8 py-3 bg-blue-900 text-white flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider">Research Article</span>
                <span className="text-blue-200">
                  {journalInfo?.title || 'Global Insights Journal'} &middot; Vol. {article.issue?.volume}, No. {article.issue?.issue_number}
                </span>
              </div>

              <div className="p-8 md:p-10">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight mb-6">
                  {article.title}
                </h1>

                {/* Authors */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-x-1 text-sm">
                    {article.authors?.map((a: any, i: number) => (
                      <span key={a.author_id} className="text-blue-800 font-medium">
                        {a.author.name}{a.is_corresponding && <sup className="text-red-500 ml-0.5">*</sup>}
                        {i < article.authors.length - 1 && <span className="text-slate-400">,&nbsp;</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author affiliations */}
                <div className="mb-8 pb-6 border-b border-slate-200">
                  <div className="space-y-1.5">
                    {article.authors?.map((a: any) => (
                      <div key={a.author_id} className="flex items-start gap-2 text-xs text-slate-500">
                        <User size={12} className="mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-medium text-slate-700">{a.author.name}</span>
                          {a.author.affiliation && <span> — {a.author.affiliation}</span>}
                          {a.author.orcid && <span className="ml-2 font-mono text-blue-600">ORCID: {a.author.orcid}</span>}
                          {a.is_corresponding && <span className="ml-2 text-red-500 font-medium">* Corresponding Author</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="metric-pill">
                    <Calendar size={12} />
                    <span>Published: {pubDateDisplay}</span>
                  </div>
                  <div className="metric-pill">
                    <FileText size={12} />
                    <span>Pages {article.page_start}–{article.page_end}</span>
                  </div>
                  {article.doi && (
                    <div className="metric-pill">
                      <span className="font-bold">DOI:</span>
                      <span className="doi-link">{article.doi}</span>
                    </div>
                  )}
                </div>

                {/* Abstract */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-900 rounded-full" />
                    Abstract
                  </h2>
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                    <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
                      {article.abstract || 'No abstract available.'}
                    </p>
                  </div>
                </div>

                {/* Keywords */}
                {article.keywords && (
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-900 rounded-full" />
                      Keywords
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.split(',').map((keyword: string, i: number) => (
                        <span key={i} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* How to Cite */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-900 rounded-full" />
                    How to Cite
                  </h2>
                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 relative group">
                    <p className="text-sm text-slate-700 leading-relaxed pr-12 font-mono">
                      {citationText}
                    </p>
                    <button
                      onClick={handleCopyCitation}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors no-print"
                      title="Copy citation"
                    >
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Download */}
                <div className="flex justify-center pt-4 no-print">
                  {article.pdf_url ? (
                    <a
                      href={article.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-blue-200/50"
                    >
                      <Download size={20} /> Download Full Article (PDF)
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 bg-slate-200 text-slate-400 px-8 py-3.5 rounded-lg font-medium cursor-not-allowed">
                      <Download size={20} /> PDF Not Available
                    </button>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 mt-8 lg:mt-0 space-y-6 no-print">
            {/* Journal info card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Journal Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Journal</span>
                  <span className="font-serif font-bold text-slate-900">{journalInfo?.title || 'Global Insights Journal'}</span>
                </div>
                {journalInfo?.issn && (
                  <div>
                    <span className="text-slate-400 text-xs block">ISSN</span>
                    <span className="font-mono text-slate-700">{journalInfo.issn}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 text-xs block">Volume / Issue</span>
                  <span className="text-slate-700">Vol. {article.issue?.volume}, No. {article.issue?.issue_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Pages</span>
                  <span className="text-slate-700">{article.page_start}–{article.page_end}</span>
                </div>
                {article.doi && (
                  <div>
                    <span className="text-slate-400 text-xs block">DOI</span>
                    <span className="doi-link break-all">{article.doi}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Article dates */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Article Timeline</h3>
              <div className="space-y-3 text-sm">
                {article.submission_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Submitted</span>
                    <span className="text-slate-700">{new Date(article.submission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {article.acceptance_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accepted</span>
                    <span className="text-slate-700">{new Date(article.acceptance_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {article.issue?.publication_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Published</span>
                    <span className="text-slate-700">{new Date(article.issue.publication_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <button onClick={handleCopyCitation} className="w-full btn-outline text-xs py-2.5">
                <Copy size={14} /> Copy Citation
              </button>
              <Link to={`/issues/${article.issue_id}`} className="w-full btn-outline text-xs py-2.5">
                <BookOpen size={14} /> View Full Issue
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
