import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get all ebooks
router.get('/', async (req: Request, res: Response) => {
  try {
    const ebooks = await prisma.ebook.findMany({
      orderBy: { created_at: 'desc' }
    })
    res.json({ success: true, data: ebooks })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch ebooks' })
  }
})

// Get single ebook
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const ebook = await prisma.ebook.findUnique({
      where: { id: Number(id) }
    })
    if (!ebook) {
      return res.status(404).json({ success: false, error: 'Ebook not found' })
    }
    res.json({ success: true, data: ebook })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch ebook' })
  }
})

// Create ebook (Admin)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, isbn, author, publisher, published_year, description, cover_image, pdf_url } = req.body

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' })
    }

    const ebook = await prisma.ebook.create({
      data: {
        title,
        isbn: isbn || null,
        author: author || null,
        publisher: publisher || null,
        published_year: published_year ? Number(published_year) : null,
        description: description || null,
        cover_image: cover_image || null,
        pdf_url: pdf_url || null
      }
    })
    res.status(201).json({ success: true, data: ebook })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'ISBN already exists' })
    }
    res.status(500).json({ success: false, error: 'Failed to create ebook' })
  }
})

// Update ebook (Admin)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, isbn, author, publisher, published_year, description, cover_image, pdf_url } = req.body

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' })
    }

    const ebook = await prisma.ebook.update({
      where: { id: Number(id) },
      data: {
        title,
        isbn: isbn || null,
        author: author || null,
        publisher: publisher || null,
        published_year: published_year ? Number(published_year) : null,
        description: description || null,
        cover_image: cover_image || null,
        pdf_url: pdf_url || null
      }
    })
    res.json({ success: true, data: ebook })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Ebook not found' })
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'ISBN already exists' })
    }
    res.status(500).json({ success: false, error: 'Failed to update ebook' })
  }
})

// Delete ebook (Admin)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.ebook.delete({ where: { id: Number(id) } })
    res.json({ success: true, message: 'Ebook deleted' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Ebook not found' })
    }
    res.status(500).json({ success: false, error: 'Failed to delete ebook' })
  }
})

export default router
