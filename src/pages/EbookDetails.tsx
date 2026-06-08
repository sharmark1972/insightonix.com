import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import SEO from '../components/SEO'
import { BookOpen, Download, ChevronLeft, User, Building2, Calendar, Hash, FileText } from 'lucide-react'

export default function EbookDetails() {
  const { id } = useParams()
  const [ebook, setEbook] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/ebooks/${id}`)
      .then(res => setEbook(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  if (!ebook) {
    return (
      <div className="text-center py-20 text-slate-500">
        <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
        <p>Ebook not found.</p>
        <Link to="/ebooks" className="mt-4 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm">
          <ChevronLeft size={16} /> Back to Ebooks
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${ebook.title} | Ebooks | Global Insights Journal`}
        description={ebook.description || `Download ${ebook.title}${ebook.author ? ` by ${ebook.author}` : ''} from Global Insights Journal.`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to="/ebooks"
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Ebooks
          </Link>
          <p className="text-blue-300 text-sm uppercase tracking-wider font-medium">Ebook</p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mt-1 leading-snug">{ebook.title}</h1>
          {ebook.author && (
            <p className="mt-3 text-blue-200 text-lg">{ebook.author}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-10">

            {/* Cover */}
            <div className="flex-shrink-0 w-full md:w-56">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-[3/4] bg-slate-100 flex items-center justify-center">
                {ebook.cover_image ? (
                  <img
                    src={ebook.cover_image}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={64} className="text-slate-300" />
                )}
              </div>

              {ebook.pdf_url && (
                <a
                  href={ebook.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download size={16} /> Download PDF
                </a>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              {/* Meta grid */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Book Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {ebook.author && (
                    <div className="flex items-start gap-3">
                      <User size={17} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-xs text-slate-400 uppercase tracking-wide">Author</dt>
                        <dd className="text-sm font-medium text-slate-800 mt-0.5">{ebook.author}</dd>
                      </div>
                    </div>
                  )}
                  {ebook.publisher && (
                    <div className="flex items-start gap-3">
                      <Building2 size={17} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-xs text-slate-400 uppercase tracking-wide">Publisher</dt>
                        <dd className="text-sm font-medium text-slate-800 mt-0.5">{ebook.publisher}</dd>
                      </div>
                    </div>
                  )}
                  {ebook.published_year && (
                    <div className="flex items-start gap-3">
                      <Calendar size={17} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-xs text-slate-400 uppercase tracking-wide">Year</dt>
                        <dd className="text-sm font-medium text-slate-800 mt-0.5">{ebook.published_year}</dd>
                      </div>
                    </div>
                  )}
                  {ebook.isbn && (
                    <div className="flex items-start gap-3">
                      <Hash size={17} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-xs text-slate-400 uppercase tracking-wide">ISBN</dt>
                        <dd className="text-sm font-medium text-slate-800 mt-0.5">{ebook.isbn}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {/* Description */}
              {ebook.description && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-blue-500" />
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Description</h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{ebook.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
