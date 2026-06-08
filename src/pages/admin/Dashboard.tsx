import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import { Book, FileText, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ issues: 0, articles: 0, members: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [issuesRes, articlesRes, membersRes] = await Promise.all([
          api.get('/issues'),
          api.get('/articles'),
          api.get('/board-members')
        ])
        
        setStats({
          issues: issuesRes.data.length,
          articles: articlesRes.data.length,
          members: membersRes.data.length
        })
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Welcome back, {user?.username}</h2>
        <p className="text-slate-500">Manage your journal content and settings from this dashboard.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/admin/issues" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Book size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.issues}</span>
          </div>
          <h3 className="font-bold text-slate-700">Total Issues</h3>
          <p className="text-sm text-slate-500 mt-1">Published journal issues</p>
        </Link>

        <Link to="/admin/articles" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.articles}</span>
          </div>
          <h3 className="font-bold text-slate-700">Total Articles</h3>
          <p className="text-sm text-slate-500 mt-1">Published research articles</p>
        </Link>

        <Link to="/admin/board-members" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.members}</span>
          </div>
          <h3 className="font-bold text-slate-700">Board Members</h3>
          <p className="text-sm text-slate-500 mt-1">Editorial team members</p>
        </Link>
      </div>
    </div>
  )
}
