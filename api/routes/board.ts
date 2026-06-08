import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get all board members
router.get('/', async (req: Request, res: Response) => {
  try {
    const members = await prisma.boardMember.findMany({
      orderBy: { display_order: 'asc' }
    })
    res.json({ success: true, data: members })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch board members' })
  }
})

// Add board member (Admin)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, title, affiliation, email, profile_image, role, display_order } = req.body
    
    const member = await prisma.boardMember.create({
      data: {
        name,
        title,
        affiliation,
        email,
        profile_image,
        role,
        display_order: display_order ? Number(display_order) : 0
      }
    })
    
    res.json({ success: true, data: member })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create board member' })
  }
})

// Update board member (Admin)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, title, affiliation, email, profile_image, role, display_order } = req.body
    
    const member = await prisma.boardMember.update({
      where: { id: Number(id) },
      data: {
        name,
        title,
        affiliation,
        email,
        profile_image,
        role,
        display_order: display_order ? Number(display_order) : undefined
      }
    })
    
    res.json({ success: true, data: member })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update board member' })
  }
})

// Delete board member (Admin)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.boardMember.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Board member deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete board member' })
  }
})

export default router
