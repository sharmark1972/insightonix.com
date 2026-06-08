import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface CertificateData {
  recipientName: string
  recipientEmail?: string
  conferenceName?: string
  conferenceDate?: string
  conferenceVenue?: string
  conferenceYear?: number
  type: 'conference' | 'reviewer' | 'editorial' | 'award'
  role?: string
  awardName?: string
  articlesReviewed?: number
  year?: number
}

export type CertificateFormat = 'classic' | 'modern' | 'minimal' | 'elegant'

const CERTIFICATE_CONFIGS: Record<CertificateFormat, any> = {
  classic: {
    width: 841.89,
    height: 595.28,
    borderColor: '#1a237e',
    borderWidth: 8,
    titleFont: 'Times-Roman',
    titleSize: 40,
    bodyFont: 'Times-Roman',
    bodySize: 16,
    headerColor: '#1a237e',
    accentColor: '#c62828',
    hasBorder: true,
    hasWatermark: true,
  },
  modern: {
    width: 841.89,
    height: 595.28,
    borderColor: '#212121',
    borderWidth: 4,
    titleFont: 'Helvetica-Bold',
    titleSize: 36,
    bodyFont: 'Helvetica',
    bodySize: 14,
    headerColor: '#212121',
    accentColor: '#00bcd4',
    hasBorder: false,
    hasWatermark: false,
  },
  minimal: {
    width: 841.89,
    height: 595.28,
    borderColor: '#424242',
    borderWidth: 2,
    titleFont: 'Helvetica-Light',
    titleSize: 32,
    bodyFont: 'Helvetica',
    bodySize: 13,
    headerColor: '#424242',
    accentColor: '#757575',
    hasBorder: false,
    hasWatermark: false,
  },
  elegant: {
    width: 841.89,
    height: 595.28,
    borderColor: '#b71c1c',
    borderWidth: 6,
    titleFont: 'Times-Bold',
    titleSize: 38,
    bodyFont: 'Times-Roman',
    bodySize: 15,
    headerColor: '#b71c1c',
    accentColor: '#ffd700',
    hasBorder: true,
    hasWatermark: true,
  },
}

async function generateConferenceCertificate(
  data: CertificateData,
  format: CertificateFormat
): Promise<string> {
  const config = CERTIFICATE_CONFIGS[format]
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  
  const certificatesDir = path.join(__dirname, '../../public/certificates')
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true })
  }
  
  const filename = `conference_${data.recipientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  const filepath = path.join(certificatesDir, filename)
  const stream = fs.createWriteStream(filepath)
  
  doc.pipe(stream)
  
  const width = doc.page.width
  const height = doc.page.height
  const centerX = width / 2
  
  if (config.hasBorder) {
    doc.lineWidth(config.borderWidth)
    doc.strokeColor(config.borderColor)
    doc.rect(20, 20, width - 40, height - 40).stroke()
    
    doc.lineWidth(2)
    doc.strokeColor(config.accentColor)
    doc.rect(30, 30, width - 60, height - 60).stroke()
  }
  
  if (config.hasWatermark) {
    doc.save()
    doc.fontSize(150)
    doc.opacity(0.05)
    doc.font('Helvetica')
    doc.text('CERTIFICATE', centerX, height / 2, { align: 'center' })
    doc.restore()
  }
  
  doc.fillColor(config.headerColor)
  doc.fontSize(config.titleSize)
  doc.font(config.titleFont)
  doc.text('CERTIFICATE OF ATTENDANCE', centerX, 80, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('This is to certify that', centerX, 180, { align: 'center' })
  
  doc.fontSize(28)
  doc.fillColor('#212121')
  doc.font('Helvetica-Bold')
  doc.text(data.recipientName, centerX, 210, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('has successfully attended and participated in', centerX, 260, { align: 'center' })
  
  doc.fontSize(22)
  doc.fillColor(config.headerColor)
  doc.font('Helvetica-Bold')
  doc.text(data.conferenceName, centerX, 290, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  if (data.conferenceVenue) {
    doc.text(`held at ${data.conferenceVenue}`, centerX, 330, { align: 'center' })
  }
  
  doc.text(`on ${data.conferenceDate}`, centerX, 355, { align: 'center' })
  
  doc.fontSize(12)
  doc.fillColor('#757575')
  doc.text(`Conference Year: ${data.conferenceYear}`, centerX, 400, { align: 'center' })
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  doc.fontSize(12)
  doc.fillColor('#424242')
  doc.text(`Date of Issue: ${currentDate}`, centerX, 480, { align: 'center' })
  
  doc.end()
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(`/certificates/${filename}`))
    stream.on('error', reject)
  })
}

async function generateReviewerCertificate(
  data: CertificateData,
  format: CertificateFormat
): Promise<string> {
  const config = CERTIFICATE_CONFIGS[format]
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  
  const certificatesDir = path.join(__dirname, '../../public/certificates')
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true })
  }
  
  const filename = `reviewer_${data.recipientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  const filepath = path.join(certificatesDir, filename)
  const stream = fs.createWriteStream(filepath)
  
  doc.pipe(stream)
  
  const width = doc.page.width
  const height = doc.page.height
  const centerX = width / 2
  
  if (config.hasBorder) {
    doc.lineWidth(config.borderWidth)
    doc.strokeColor(config.borderColor)
    doc.rect(20, 20, width - 40, height - 40).stroke()
  }
  
  doc.fillColor(config.headerColor)
  doc.fontSize(config.titleSize)
  doc.font(config.titleFont)
  doc.text('CERTIFICATE OF APPRECIATION', centerX, 80, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('This certificate is proudly presented to', centerX, 180, { align: 'center' })
  
  doc.fontSize(28)
  doc.fillColor('#212121')
  doc.font('Helvetica-Bold')
  doc.text(data.recipientName, centerX, 210, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('in recognition of outstanding contribution as a reviewer', centerX, 260, { align: 'center' })
  
  if (data.articlesReviewed && data.articlesReviewed > 0) {
    doc.fontSize(20)
    doc.fillColor(config.headerColor)
    doc.font('Helvetica-Bold')
    doc.text(`${data.articlesReviewed} Articles Reviewed`, centerX, 290, { align: 'center' })
  }
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  doc.text(`Year: ${data.year}`, centerX, 340, { align: 'center' })
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  doc.fontSize(12)
  doc.fillColor('#424242')
  doc.text(`Date of Issue: ${currentDate}`, centerX, 480, { align: 'center' })
  
  doc.end()
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(`/certificates/${filename}`))
    stream.on('error', reject)
  })
}

async function generateEditorialCertificate(
  data: CertificateData,
  format: CertificateFormat
): Promise<string> {
  const config = CERTIFICATE_CONFIGS[format]
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  
  const certificatesDir = path.join(__dirname, '../../public/certificates')
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true })
  }
  
  const filename = `editorial_${data.recipientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  const filepath = path.join(certificatesDir, filename)
  const stream = fs.createWriteStream(filepath)
  
  doc.pipe(stream)
  
  const width = doc.page.width
  const height = doc.page.height
  const centerX = width / 2
  
  if (config.hasBorder) {
    doc.lineWidth(config.borderWidth)
    doc.strokeColor(config.borderColor)
    doc.rect(20, 20, width - 40, height - 40).stroke()
  }
  
  doc.fillColor(config.headerColor)
  doc.fontSize(config.titleSize)
  doc.font(config.titleFont)
  doc.text('CERTIFICATE OF RECOGNITION', centerX, 80, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('This certificate is awarded to', centerX, 180, { align: 'center' })
  
  doc.fontSize(28)
  doc.fillColor('#212121')
  doc.font('Helvetica-Bold')
  doc.text(data.recipientName, centerX, 210, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  if (data.role) {
    doc.text(`for exceptional service as ${data.role}`, centerX, 260, { align: 'center' })
  } else {
    doc.text('for exceptional service to the editorial board', centerX, 260, { align: 'center' })
  }
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  doc.text(`Year: ${data.year}`, centerX, 310, { align: 'center' })
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  doc.fontSize(12)
  doc.fillColor('#424242')
  doc.text(`Date of Issue: ${currentDate}`, centerX, 480, { align: 'center' })
  
  doc.end()
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(`/certificates/${filename}`))
    stream.on('error', reject)
  })
}

async function generateAwardCertificate(
  data: CertificateData,
  format: CertificateFormat
): Promise<string> {
  const config = CERTIFICATE_CONFIGS[format]
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  
  const certificatesDir = path.join(__dirname, '../../public/certificates')
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true })
  }
  
  const filename = `award_${data.recipientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  const filepath = path.join(certificatesDir, filename)
  const stream = fs.createWriteStream(filepath)
  
  doc.pipe(stream)
  
  const width = doc.page.width
  const height = doc.page.height
  const centerX = width / 2
  
  if (config.hasBorder) {
    doc.lineWidth(config.borderWidth)
    doc.strokeColor(config.borderColor)
    doc.rect(20, 20, width - 40, height - 40).stroke()
    
    doc.lineWidth(3)
    doc.strokeColor(config.accentColor)
    doc.rect(25, 25, width - 50, height - 50).stroke()
  }
  
  doc.fillColor(config.headerColor)
  doc.fontSize(config.titleSize)
  doc.font(config.titleFont)
  doc.text('AWARD CERTIFICATE', centerX, 70, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('This certificate is proudly presented to', centerX, 170, { align: 'center' })
  
  doc.fontSize(30)
  doc.fillColor('#212121')
  doc.font('Helvetica-Bold')
  doc.text(data.recipientName, centerX, 200, { align: 'center' })
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  
  doc.text('for receiving the', centerX, 250, { align: 'center' })
  
  if (data.awardName) {
    doc.fontSize(26)
    doc.fillColor(config.accentColor)
    doc.font('Helvetica-Bold')
    doc.text(data.awardName, centerX, 280, { align: 'center' })
  }
  
  doc.fontSize(config.bodySize)
  doc.font(config.bodyFont)
  doc.fillColor('#424242')
  doc.text(`Year: ${data.year}`, centerX, 330, { align: 'center' })
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  doc.fontSize(12)
  doc.fillColor('#424242')
  doc.text(`Date of Issue: ${currentDate}`, centerX, 480, { align: 'center' })
  
  doc.end()
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(`/certificates/${filename}`))
    stream.on('error', reject)
  })
}

export async function generateCertificate(
  data: CertificateData,
  format: CertificateFormat = 'classic'
): Promise<string> {
  switch (data.type) {
    case 'conference':
      return generateConferenceCertificate(data, format)
    case 'reviewer':
      return generateReviewerCertificate(data, format)
    case 'editorial':
      return generateEditorialCertificate(data, format)
    case 'award':
      return generateAwardCertificate(data, format)
    default:
      throw new Error('Invalid certificate type')
  }
}
