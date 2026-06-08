import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Calendar, MapPin, Mic2, ArrowRight, Users } from 'lucide-react'
import SEO from '../components/SEO'

interface Conference {
  id: number
  name: string
  description?: string
  venue?: string
  date?: string
  conference_year: number
}

export default function Conferences() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  const upcoming = conferences.filter((c) => c.date && new Date(c.date) > new Date())
  const past = conferences.filter((c) => !c.date || new Date(c.date) <= new Date())

  return (
    <div className="py-12">
      <div className="journal-container max-w-5xl">
        <SEO
          title="Conferences"
          description="Explore academic conferences, symposiums, and workshops fostering collaboration and research dissemination."
          keywords="conferences, symposiums, workshops, academic events, research collaboration"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Conferences &amp; Events</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Our conferences bring together researchers, academics, and industry professionals to share knowledge and foster interdisciplinary collaboration.
          </p>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-14">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {upcoming.map((conf) => (
                <div key={conf.id} className="card overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-48 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 flex flex-col items-center justify-center text-center">
                      {conf.date && (
                        <>
                          <div className="text-3xl font-bold font-serif">
                            {new Date(conf.date).getDate()}
                          </div>
                          <div className="text-emerald-100 text-sm font-medium">
                            {new Date(conf.date).toLocaleDateString('en-US', { month: 'long' })}
                          </div>
                          <div className="text-emerald-200 text-xs mt-1">
                            {new Date(conf.date).getFullYear()}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-success text-[10px]">Upcoming</span>
                        <span className="badge badge-primary text-[10px]">{conf.conference_year}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{conf.name}</h3>
                      {conf.description && (
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{conf.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        {conf.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-slate-400" />
                            {conf.venue}
                          </span>
                        )}
                        {conf.date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date(conf.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-6">Past Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {past.map((conf) => (
                <div key={conf.id} className="card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic2 className="text-blue-600" size={18} />
                    <span className="badge badge-warning text-[10px]">{conf.conference_year}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 mb-2">{conf.name}</h3>
                  {conf.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">{conf.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    {conf.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {conf.venue}
                      </span>
                    )}
                    {conf.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(conf.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {conferences.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
            <Mic2 className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Conferences Listed</h3>
            <p className="text-slate-500">Upcoming events will be listed here. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  )
}
