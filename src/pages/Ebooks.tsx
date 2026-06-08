import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import SEO from '../components/SEO'
import { BookOpen, Download, Search } from 'lucide-react'

export default function Ebooks() {
  const [ebooks, setEbooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/ebooks')
      .then(res => setEbooks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = ebooks.filter(eb =>
    eb.title.toLowerCase().includes(search.toLowerCase()) ||
    (eb.author && eb.author.toLowerCase().includes(search.toLowerCase())) ||
    (eb.isbn && eb.isbn.includes(search))
  )

  return (
    <>
      <SEO
        title="Ebooks | Global Insights Journal"
        description="Browse and download ebooks published by Global Insights Journal."
      />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Ebooks</h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            Explore our collection of freely available ebooks on research, science, and scholarly publishing.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author or ISBN…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 rounded-lg aspect-[3/4] mb-3" />
                  <div className="h-4 bg-slate-200 rounded mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">{search ? 'No ebooks match your search.' : 'No ebooks available yet.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filtered.map(ebook => (
                <div key={ebook.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  {/* Cover – click goes to detail page */}
                  <Link to={`/ebooks/${ebook.id}`} className="aspect-[3/4] bg-slate-100 flex items-center justify-center overflow-hidden block">
                    {ebook.cover_image ? (
                      <img src={ebook.cover_image} alt={ebook.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={48} className="text-slate-300" />
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/ebooks/${ebook.id}`} className="font-semibold text-slate-900 text-sm leading-snug line-clamp-3 mb-1 hover:text-blue-700 transition-colors">{ebook.title}</Link>
                    {ebook.author && <p className="text-xs text-slate-500 mb-0.5">{ebook.author}</p>}
                    {ebook.publisher && <p className="text-xs text-slate-400">{ebook.publisher}{ebook.published_year ? `, ${ebook.published_year}` : ''}</p>}
                    {ebook.isbn && <p className="text-xs text-slate-400 mt-0.5">ISBN: {ebook.isbn}</p>}

                    {ebook.pdf_url && (
                      <a
                        href={ebook.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        <Download size={15} /> Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
