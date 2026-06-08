import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LayoutDashboard, FileText, Book, Users, Settings, LogOut, Trophy, Hash, Mic2, BookOpen, Library } from 'lucide-react'

export default function AdminLayout() {
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isAuthenticated = !!token

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname.startsWith(path)

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold font-serif text-lg">Global Insights Journal</span>
          </Link>
          <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Admin Portal
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link 
            to="/admin/issues" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/issues') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Book size={20} /> Issues
          </Link>
          <Link 
            to="/admin/articles" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/articles') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} /> Articles
          </Link>
          <Link 
            to="/admin/board-members" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/board-members') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} /> Board Members
          </Link>
          <Link 
            to="/admin/conferences" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/conferences') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Mic2 size={20} /> Conferences
          </Link>
          <Link 
            to="/admin/certificates" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/certificates') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Trophy size={20} /> Certificates
          </Link>
          <Link 
            to="/admin/awards" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/awards') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Trophy size={20} /> Awards
          </Link>
          <Link 
            to="/admin/ebooks" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/ebooks') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Library size={20} /> Ebooks
          </Link>
          <Link 
            to="/admin/doi" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/doi') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Hash size={20} /> DOI Management
          </Link>
          <Link 
            to="/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/settings') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} /> Settings
          </Link>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
