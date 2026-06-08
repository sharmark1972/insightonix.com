import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Mail, ExternalLink } from 'lucide-react'
import SEO from '../components/SEO'

export default function EditorialBoard() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/board-members')
        setMembers(res.data)
      } catch (error) {
        console.error('Failed to fetch board members', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  // Group by role
  const roleOrder = ['Editor-in-Chief', 'Associate Editor', 'Advisory Board', 'Reviewer']
  const grouped: Record<string, any[]> = {}
  members.forEach((m) => {
    const role = m.role || 'Member'
    if (!grouped[role]) grouped[role] = []
    grouped[role].push(m)
  })
  const sortedRoles = Object.keys(grouped).sort((a, b) => {
    const aIdx = roleOrder.indexOf(a)
    const bIdx = roleOrder.indexOf(b)
    if (aIdx === -1 && bIdx === -1) return 0
    if (aIdx === -1) return 1
    if (bIdx === -1) return -1
    return aIdx - bIdx
  })

  return (
    <div className="py-12">
      <div className="journal-container max-w-6xl">
        <SEO
          title="Editorial Board"
          description="Meet the distinguished members of our editorial board who ensure the quality and integrity of our publications."
          keywords="editorial board, editors, academic board, peer review, reviewers"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Editorial Board</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Our editorial board comprises leading scholars and researchers from prestigious institutions worldwide, ensuring the highest standards of academic excellence.
          </p>
        </div>

        {/* Grouped members */}
        <div className="space-y-14">
          {sortedRoles.map((role) => (
            <div key={role}>
              <h2 className="text-lg font-serif font-bold text-slate-900 mb-6 pb-2 border-b-2 border-blue-900 inline-block">
                {role === 'Editor-in-Chief' ? 'Editor-in-Chief' : `${role}s`}
              </h2>

              <div className={`grid gap-6 ${
                role === 'Editor-in-Chief'
                  ? 'md:grid-cols-1 max-w-2xl'
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {grouped[role].map((member: any) => (
                  <div
                    key={member.id}
                    className={`card p-6 ${
                      role === 'Editor-in-Chief' ? 'flex gap-6 items-center' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${
                      role === 'Editor-in-Chief' ? 'w-24 h-24' : 'w-16 h-16 mb-4'
                    } bg-gradient-to-br from-blue-100 to-blue-50 rounded-full overflow-hidden border-2 border-blue-200`}>
                      {member.profile_image ? (
                        <img src={member.profile_image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-serif font-bold text-xl">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className={role === 'Editor-in-Chief' ? '' : ''}>
                      <h3 className="text-base font-serif font-bold text-slate-900">{member.name}</h3>
                      {member.title && (
                        <p className="text-sm text-slate-600 font-medium mt-0.5">{member.title}</p>
                      )}
                      {member.affiliation && (
                        <p className="text-sm text-slate-400 mt-1">{member.affiliation}</p>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          <Mail size={12} /> {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Board Members Coming Soon</h3>
            <p className="text-slate-500">Our editorial board is being assembled. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
