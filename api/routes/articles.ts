import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { generateDOI, generateBatchDOIs, validateDOI } from '../services/doiGenerator.js'

const router = Router()

// Get all articles (optional issue_id filter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { issue_id } = req.query
    const where = issue_id ? { issue_id: Number(issue_id) } : {}
    
    const articles = await prisma.article.findMany({
      where,
      include: {
        issue: true,
        authors: {
          include: { author: true },
          orderBy: { order_index: 'asc' }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    
    res.json({ success: true, data: articles })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch articles' })
  }
})

// Get single article
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        issue: true,
        authors: {
          include: { author: true },
          orderBy: { order_index: 'asc' }
        }
      }
    })
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' })
    }

    res.json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch article' })
  }
})

// Create article (Admin)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      issue_id, title, abstract, keywords, doi, pdf_url, 
      page_start, page_end, submission_date, acceptance_date,
      authors // Array of { name, email, affiliation, orcid, is_corresponding }
    } = req.body
    
    // Check if DOI already exists if provided
    if (doi) {
      const existingArticle = await prisma.article.findUnique({
        where: { doi }
      })
      
      if (existingArticle) {
        return res.status(409).json({ 
          success: false, 
          error: 'An article with this DOI already exists',
          existing_article_id: existingArticle.id
        })
      }
    }
    
    // Transaction to create article and authors
    const article = await prisma.$transaction(async (tx) => {
      // Create article
      const newArticle = await tx.article.create({
        data: {
          issue_id: Number(issue_id),
          title,
          abstract,
          keywords,
          doi,
          pdf_url,
          page_start: page_start ? Number(page_start) : null,
          page_end: page_end ? Number(page_end) : null,
          submission_date: submission_date ? new Date(submission_date) : null,
          acceptance_date: acceptance_date ? new Date(acceptance_date) : null,
        }
      })

      // Create authors and links
      if (authors && Array.isArray(authors)) {
        for (let i = 0; i < authors.length; i++) {
          const authorData = authors[i]
          
          // Check if author exists or create new
          let author = await tx.author.findFirst({
            where: { name: authorData.name, email: authorData.email }
          })
          
          if (!author) {
            author = await tx.author.create({
              data: {
                name: authorData.name,
                email: authorData.email,
                affiliation: authorData.affiliation,
                orcid: authorData.orcid
              }
            })
          }

          // Link to article
          await tx.articleAuthor.create({
            data: {
              article_id: newArticle.id,
              author_id: author.id,
              order_index: i,
              is_corresponding: authorData.is_corresponding || false
            }
          })
        }
      }

      return newArticle
    })
    
    res.json({ success: true, data: article })
  } catch (error: any) {
    console.error(error)
    
    // Handle unique constraint violation (P2002)
    if (error.code === 'P2002' && error.meta?.target?.includes('doi')) {
      return res.status(409).json({ 
        success: false, 
        error: 'An article with this DOI already exists'
      })
    }
    
    res.status(500).json({ success: false, error: 'Failed to create article' })
  }
})

// Update article (Admin)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { 
      issue_id, title, abstract, keywords, doi, pdf_url, 
      page_start, page_end, submission_date, acceptance_date
    } = req.body
    
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        issue_id: issue_id ? Number(issue_id) : undefined,
        title,
        abstract,
        keywords,
        doi,
        pdf_url,
        page_start: page_start ? Number(page_start) : undefined,
        page_end: page_end ? Number(page_end) : undefined,
        submission_date: submission_date ? new Date(submission_date) : undefined,
        acceptance_date: acceptance_date ? new Date(acceptance_date) : undefined,
      }
    })
    
    res.json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update article' })
  }
})

// Delete article (Admin)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.article.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Article deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete article' })
  }
})

// Generate DOI for single article
router.post('/:id/doi', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const doi = await generateDOI(Number(id))
    
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        authors: {
          include: { author: true }
        }
      }
    })
    
    res.json({ success: true, data: { doi, article } })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate DOI' })
  }
})

// Generate DOIs for multiple articles
router.post('/doi/batch', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { article_ids } = req.body
    
    if (!article_ids || !Array.isArray(article_ids)) {
      return res.status(400).json({ success: false, error: 'article_ids array is required' })
    }
    
    const results = await generateBatchDOIs(article_ids.map((id: any) => Number(id)))
    
    res.json({ success: true, data: results })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate DOIs' })
  }
})

// Validate DOI
router.get('/:id/doi/validate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const article = await prisma.article.findUnique({
      where: { id: Number(id) }
    })
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' })
    }
    
    if (!article.doi) {
      return res.json({ success: true, data: { valid: false, message: 'No DOI assigned' } })
    }
    
    const isValid = validateDOI(article.doi)
    
    res.json({ success: true, data: { valid: isValid, doi: article.doi } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to validate DOI' })
  }
})

export default router
