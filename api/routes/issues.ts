import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get all issues
router.get('/', async (req: Request, res: Response) => {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: [
        { volume: 'desc' },
        { issue_number: 'desc' }
      ],
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })
    res.json({ success: true, data: issues })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch issues' })
  }
})

// Get single issue
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const issue = await prisma.issue.findUnique({
      where: { id: Number(id) },
      include: {
        articles: {
          orderBy: { page_start: 'asc' },
          include: {
            authors: {
              include: {
                author: true
              },
              orderBy: { order_index: 'asc' }
            }
          }
        }
      }
    })
    
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' })
    }

    res.json({ success: true, data: issue })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch issue' })
  }
})

// Create issue (Admin)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { volume, issue_number, title, publication_date, cover_image, description } = req.body
    
    const issue = await prisma.issue.create({
      data: {
        volume: Number(volume),
        issue_number: Number(issue_number),
        title,
        publication_date: publication_date ? new Date(publication_date) : null,
        cover_image,
        description
      }
    })
    
    res.json({ success: true, data: issue })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create issue' })
  }
})

// Update issue (Admin)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { volume, issue_number, title, publication_date, cover_image, description } = req.body
    
    const issue = await prisma.issue.update({
      where: { id: Number(id) },
      data: {
        volume: volume ? Number(volume) : undefined,
        issue_number: issue_number ? Number(issue_number) : undefined,
        title,
        publication_date: publication_date ? new Date(publication_date) : undefined,
        cover_image,
        description
      }
    })
    
    res.json({ success: true, data: issue })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update issue' })
  }
})

// Delete issue (Admin)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.issue.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Issue deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete issue' })
  }
})

export default router
