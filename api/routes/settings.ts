import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get settings
router.get('/', async (req: Request, res: Response) => {
  try {
    let journal = await prisma.journal.findFirst()
    
    // Create default if not exists
    if (!journal) {
      journal = await prisma.journal.create({
        data: {
          title: 'Global Insights Journal',
          issn: '1234-5678',
          eissn: '1234-5679',
          description: 'A peer-reviewed academic journal for advanced research',
          institution: 'Visenary Analytics Research Association',
          contact_email: 'info@va-ra.co',
          address: 'Vrijthof 55, 6211 LE Maastricht, The Netherlands'
        }
      })
    }
    
    res.json({ success: true, data: journal })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' })
  }
})

// Update settings (Admin)
router.put('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, issn, eissn, description, contact_email, address, institution, doi_prefix } = req.body
    
    // Find the first record
    const existing = await prisma.journal.findFirst()
    
    let journal
    if (existing) {
      journal = await prisma.journal.update({
        where: { id: existing.id },
        data: {
          title,
          issn,
          eissn,
          description,
          contact_email,
          address,
          institution,
          doi_prefix
        }
      })
    } else {
      journal = await prisma.journal.create({
        data: {
          title,
          issn,
          eissn,
          description,
          contact_email,
          address,
          institution,
          doi_prefix
        }
      })
    }
    
    res.json({ success: true, data: journal })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update settings' })
  }
})

export default router
