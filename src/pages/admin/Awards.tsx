import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Award, Plus, Trash2, Edit, Download, Trophy } from 'lucide-react'

interface AwardCategory {
  id: number
  name: string
  description?: string
  award_type: string
  awards: Award[]
}

interface Award {
  id: number
  award_year: number
  award_date?: string
  certificate_url?: string
  category: AwardCategory
  article?: {
    id: number
    title: string
  }
  author?: {
    id: number
    name: string
  }
}

interface Article {
  id: number
  title: string
  authors: {
    author: {
      id: number
      name: string
    }
  }[]
}

interface Author {
  id: number
  name: string
}

export default function Awards() {
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAwardModal, setShowAwardModal] = useState(false)
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    award_type: 'article'
  })

  const [awardForm, setAwardForm] = useState({
    category_id: '',
    article_id: '',
    author_id: '',
    award_year: new Date().getFullYear().toString(),
    award_date: '',
    generate_certificate: true,
    format: 'elegant'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, articlesRes, authorsRes] = await Promise.all([
        api.get('/awards/categories'),
        api.get('/articles'),
        api.get('/board-members')
      ])
      
      setCategories(categoriesRes.data)
      setArticles(articlesRes.data)
      setAuthors(authorsRes.data)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/awards/categories', categoryForm)
      setShowCategoryModal(false)
      setCategoryForm({ name: '', description: '', award_type: 'article' })
      fetchData()
    } catch (error: any) {
      console.error('Failed to create category', error)
      alert(error.message || 'Failed to create award category')
    }
  }

  const handleCreateAward = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/awards', awardForm)
      setShowAwardModal(false)
      setAwardForm({
        category_id: '',
        article_id: '',
        author_id: '',
        award_year: new Date().getFullYear().toString(),
        award_date: '',
        generate_certificate: true,
        format: 'elegant'
      })
      fetchData()
    } catch (error: any) {
      console.error('Failed to create award', error)
      alert(error.message || 'Failed to create award')
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this award category?')) return
    
    try {
      await api.delete(`/awards/categories/${id}`)
      fetchData()
    } catch (error: any) {
      console.error('Failed to delete category', error)
      alert(error.message || 'Failed to delete award category')
    }
  }

  const handleDeleteAward = async (id: number) => {
    if (!confirm('Are you sure you want to delete this award?')) return
    
    try {
      await api.delete(`/awards/${id}`)
      fetchData()
    } catch (error: any) {
      console.error('Failed to delete award', error)
      alert(error.message || 'Failed to delete award')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Awards Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2"
          >
            <Trophy size={20} />
            New Category
          </button>
          <button
            onClick={() => setShowAwardModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Award size={20} />
            Grant Award
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-slate-600 mt-1">{category.description}</p>
                  )}
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {category.award_type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {category.awards.length} Awards
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {category.awards.length > 0 && (
              <div className="divide-y divide-slate-100">
                {category.awards.map((award) => (
                  <div key={award.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div className="flex-1">
                      {award.article && (
                        <div className="font-medium text-slate-900">{award.article.title}</div>
                      )}
                      {award.author && (
                        <div className="font-medium text-slate-900">{award.author.name}</div>
                      )}
                      <div className="text-sm text-slate-500 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Trophy size={14} />
                          {award.award_year}
                        </span>
                        {award.award_date && (
                          <span className="ml-3">
                            {new Date(award.award_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {award.certificate_url && (
                        <button
                          onClick={() => window.open(award.certificate_url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Download Certificate"
                        >
                          <Download size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAward(award.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Award"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {category.awards.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No awards granted yet in this category
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Award Categories</h3>
            <p className="text-slate-600 mb-4">Create award categories to start recognizing excellence.</p>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create First Category
            </button>
          </div>
        )}
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create Award Category</h2>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Best Paper Award"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Award Type *
                </label>
                <select
                  required
                  value={categoryForm.award_type}
                  onChange={(e) => setCategoryForm({ ...categoryForm, award_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="article">Article Award</option>
                  <option value="author">Author Award</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Grant Award</h2>
            
            <form onSubmit={handleCreateAward} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Award Category *
                </label>
                <select
                  required
                  value={awardForm.category_id}
                  onChange={(e) => {
                    setAwardForm({ ...awardForm, category_id: e.target.value })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.award_type})
                    </option>
                  ))}
                </select>
              </div>

              {categories.find(c => c.id === Number(awardForm.category_id))?.award_type === 'article' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Article *
                  </label>
                  <select
                    required={categories.find(c => c.id === Number(awardForm.category_id))?.award_type === 'article'}
                    value={awardForm.article_id}
                    onChange={(e) => setAwardForm({ ...awardForm, article_id: e.target.value, author_id: '' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select article</option>
                    {articles.map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Author *
                  </label>
                  <select
                    required={categories.find(c => c.id === Number(awardForm.category_id))?.award_type === 'author'}
                    value={awardForm.author_id}
                    onChange={(e) => setAwardForm({ ...awardForm, author_id: e.target.value, article_id: '' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select author</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Award Year *
                </label>
                <input
                  type="number"
                  required
                  value={awardForm.award_year}
                  onChange={(e) => setAwardForm({ ...awardForm, award_year: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Award Date
                </label>
                <input
                  type="date"
                  value={awardForm.award_date}
                  onChange={(e) => setAwardForm({ ...awardForm, award_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generate_certificate"
                  checked={awardForm.generate_certificate}
                  onChange={(e) => setAwardForm({ ...awardForm, generate_certificate: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="generate_certificate" className="text-sm text-slate-700">
                  Generate certificate
                </label>
              </div>

              {awardForm.generate_certificate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certificate Format
                  </label>
                  <select
                    value={awardForm.format}
                    onChange={(e) => setAwardForm({ ...awardForm, format: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="elegant">Elegant</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Grant Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
