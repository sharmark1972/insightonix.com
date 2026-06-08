import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { generateCertificate } from '../services/certificateGenerator.js'

const router = Router()

router.get('/categories', async (req: Request, res: Response) => {
  try {
    const { award_type } = req.query
    const where = award_type ? { award_type: String(award_type) } : {}
    
    const categories = await prisma.awardCategory.findMany({
      where,
      include: {
        awards: {
          include: {
            article: {
              include: {
                authors: {
                  include: { author: true }
                }
              }
            },
            author: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch award categories' })
  }
})

router.post('/categories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, award_type } = req.body
    
    const category = await prisma.awardCategory.create({
      data: {
        name,
        description,
        award_type
      }
    })
    
    res.json({ success: true, data: category })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to create award category' })
  }
})

router.put('/categories/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, award_type } = req.body
    
    const category = await prisma.awardCategory.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        award_type
      }
    })
    
    res.json({ success: true, data: category })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update award category' })
  }
})

router.delete('/categories/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.awardCategory.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Award category deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete award category' })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category_id, award_year } = req.query
    const where: any = {}
    
    if (category_id) where.category_id = Number(category_id)
    if (award_year) where.award_year = Number(award_year)
    
    const awards = await prisma.award.findMany({
      where,
      include: {
        category: true,
        article: {
          include: {
            authors: {
              include: { author: true }
            }
          }
        },
        author: true
      },
      orderBy: { award_year: 'desc' }
    })
    
    res.json({ success: true, data: awards })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch awards' })
  }
})

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      category_id, 
      article_id, 
      author_id, 
      award_year, 
      award_date,
      generate_certificate = true,
      format = 'elegant'
    } = req.body
    
    if (!category_id || (!article_id && !author_id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category and either article or author are required' 
      })
    }
    
    const category = await prisma.awardCategory.findUnique({
      where: { id: Number(category_id) }
    })
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Award category not found' })
    }
    
    let recipientName = ''
    let recipientEmail = ''
    
    if (article_id) {
      const article = await prisma.article.findUnique({
        where: { id: Number(article_id) },
        include: {
          authors: {
            include: { author: true }
          }
        }
      })
      
      if (!article) {
        return res.status(404).json({ success: false, error: 'Article not found' })
      }
      
      const correspondingAuthor = article.authors.find(a => a.is_corresponding)
      if (correspondingAuthor) {
        recipientName = correspondingAuthor.author.name
        recipientEmail = correspondingAuthor.author.email || ''
      } else {
        recipientName = article.authors[0]?.author.name || 'Unknown'
      }
    } else if (author_id) {
      const author = await prisma.author.findUnique({
        where: { id: Number(author_id) }
      })
      
      if (!author) {
        return res.status(404).json({ success: false, error: 'Author not found' })
      }
      
      recipientName = author.name
      recipientEmail = author.email || ''
    }
    
    let certificateUrl = null
    if (generate_certificate) {
      certificateUrl = await generateCertificate({
        recipientName,
        recipientEmail: recipientEmail || undefined,
        type: 'award',
        awardName: category.name,
        year: Number(award_year)
      }, format)
    }
    
    const award = await prisma.award.create({
      data: {
        category_id: Number(category_id),
        article_id: article_id ? Number(article_id) : null,
        author_id: author_id ? Number(author_id) : null,
        award_year: Number(award_year),
        award_date: award_date ? new Date(award_date) : null,
        certificate_url: certificateUrl
      },
      include: {
        category: true,
        article: {
          include: {
            authors: {
              include: { author: true }
            }
          }
        },
        author: true
      }
    })
    
    res.json({ success: true, data: award })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to create award' })
  }
})

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { award_year, award_date } = req.body
    
    const award = await prisma.award.update({
      where: { id: Number(id) },
      data: {
        award_year: award_year ? Number(award_year) : undefined,
        award_date: award_date ? new Date(award_date) : undefined
      }
    })
    
    res.json({ success: true, data: award })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update award' })
  }
})

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.award.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Award deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete award' })
  }
})

export default router
