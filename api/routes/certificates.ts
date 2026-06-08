import { Router, type Request, type Response } from 'express'
import prisma from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { generateCertificate, type CertificateFormat } from '../services/certificateGenerator.js'

const router = Router()

router.get('/conferences', async (req: Request, res: Response) => {
  try {
    const conferences = await prisma.conference.findMany({
      include: {
        certificates: true
      },
      orderBy: { conference_year: 'desc' }
    })
    
    res.json({ success: true, data: conferences })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conferences' })
  }
})

router.get('/conferences/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const conference = await prisma.conference.findUnique({
      where: { id: Number(id) },
      include: {
        certificates: true
      }
    })
    
    if (!conference) {
      return res.status(404).json({ success: false, error: 'Conference not found' })
    }

    res.json({ success: true, data: conference })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conference' })
  }
})

router.post('/conferences', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, venue, date, conference_year } = req.body
    
    const conference = await prisma.conference.create({
      data: {
        name,
        description,
        venue,
        date: date ? new Date(date) : null,
        conference_year: Number(conference_year)
      }
    })
    
    res.json({ success: true, data: conference })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to create conference' })
  }
})

router.put('/conferences/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, venue, date, conference_year } = req.body
    
    const conference = await prisma.conference.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        venue,
        date: date ? new Date(date) : undefined,
        conference_year: conference_year ? Number(conference_year) : undefined
      }
    })
    
    res.json({ success: true, data: conference })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update conference' })
  }
})

router.delete('/conferences/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.conference.delete({
      where: { id: Number(id) }
    })
    
    res.json({ success: true, message: 'Conference deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete conference' })
  }
})

router.get('/conference-certificates', async (req: Request, res: Response) => {
  try {
    const { conference_id, type } = req.query
    const where: any = {}
    
    if (conference_id) where.conference_id = Number(conference_id)
    if (type) where.type = type
    
    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        conference: true
      },
      orderBy: { created_at: 'desc' }
    })
    
    res.json({ success: true, data: certificates })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch certificates' })
  }
})

router.post('/conference-certificates/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      recipient_name, 
      recipient_email, 
      conference_id, 
      format = 'classic' 
    } = req.body
    
    const conference = await prisma.conference.findUnique({
      where: { id: Number(conference_id) }
    })
    
    if (!conference) {
      return res.status(404).json({ success: false, error: 'Conference not found' })
    }
    
    const certificateUrl = await generateCertificate({
      recipientName: recipient_name,
      recipientEmail: recipient_email,
      conferenceName: conference.name,
      conferenceDate: conference.date ? new Date(conference.date).toLocaleDateString() : 'TBD',
      conferenceVenue: conference.venue || undefined,
      conferenceYear: conference.conference_year,
      type: 'conference'
    }, format as CertificateFormat)
    
    const certificate = await prisma.certificate.create({
      data: {
        type: 'conference',
        recipient_name,
        recipient_email,
        conference_id: Number(conference_id),
        certificate_url: certificateUrl,
        format
      }
    })
    
    res.json({ success: true, data: certificate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to generate certificate' })
  }
})

router.get('/reviewer-certificates', async (req: Request, res: Response) => {
  try {
    const { year } = req.query
    const where = year ? { year: Number(year) } : {}
    
    const certificates = await prisma.reviewerCertificate.findMany({
      where,
      orderBy: { year: 'desc' }
    })
    
    res.json({ success: true, data: certificates })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviewer certificates' })
  }
})

router.post('/reviewer-certificates/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      recipient_name, 
      recipient_email, 
      articles_reviewed = 0, 
      year,
      format = 'classic' 
    } = req.body
    
    const certificateUrl = await generateCertificate({
      recipientName: recipient_name,
      recipientEmail: recipient_email,
      type: 'reviewer',
      articlesReviewed: articles_reviewed,
      year: Number(year)
    }, format as CertificateFormat)
    
    const certificate = await prisma.reviewerCertificate.create({
      data: {
        recipient_name,
        recipient_email,
        articles_reviewed: Number(articles_reviewed),
        year: Number(year),
        certificate_url: certificateUrl
      }
    })
    
    res.json({ success: true, data: certificate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to generate reviewer certificate' })
  }
})

router.get('/editorial-certificates', async (req: Request, res: Response) => {
  try {
    const { year } = req.query
    const where = year ? { year: Number(year) } : {}
    
    const certificates = await prisma.editorialCertificate.findMany({
      where,
      orderBy: { year: 'desc' }
    })
    
    res.json({ success: true, data: certificates })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch editorial certificates' })
  }
})

router.post('/editorial-certificates/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      recipient_name, 
      recipient_email, 
      role, 
      year,
      format = 'classic' 
    } = req.body
    
    const certificateUrl = await generateCertificate({
      recipientName: recipient_name,
      recipientEmail: recipient_email,
      type: 'editorial',
      role,
      year: Number(year)
    }, format as CertificateFormat)
    
    const certificate = await prisma.editorialCertificate.create({
      data: {
        recipient_name,
        recipient_email,
        role,
        year: Number(year),
        certificate_url: certificateUrl
      }
    })
    
    res.json({ success: true, data: certificate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Failed to generate editorial certificate' })
  }
})

export default router
