import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Users, Mail, Home, Mic2, Menu, X, GraduationCap, DollarSign, Library } from 'lucide-react'
import { api } from '../lib/api'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [journal, setJournal] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setJournal(res.data)
      } catch (error) {
        console.error('Failed to fetch settings', error)
      }
    }
    fetchSettings()
  }, [])

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/issues', label: 'Archives', icon: BookOpen },
    { to: '/ebooks', label: 'Ebooks', icon: Library },
    { to: '/editorial-board', label: 'Editorial Board', icon: Users },
    { to: '/apc', label: 'APC', icon: DollarSign },
    { to: '/conferences', label: 'Conferences', icon: Mic2 },
    { to: '/contact', label: 'Contact', icon: Mail },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-950 text-blue-200 text-xs">
        <div className="journal-container flex justify-between items-center py-1.5">
          <div className="flex items-center gap-4">
            <span>ISSN: {journal?.issn || '2XXX-XXXX'} (Online)</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline text-black">Peer-Reviewed &middot; Open Access</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-white transition-colors">Submit Paper</Link>
            <span>|</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Brand bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="journal-container py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-blue-800 transition-colors">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                  Global Insights Journal
                </h1>
                <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
                  International Peer-Reviewed Research
                </p>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-blue-900 hidden lg:block">
        <div className="journal-container">
          <ul className="flex items-center gap-0">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive(to)
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg">
          <nav className="journal-container py-4">
            <ul className="space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
