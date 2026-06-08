import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import { authenticateToken } from '../middleware/auth.js'
import { uploadToR2, getR2FileName } from '../services/r2Service.js'

interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024
  }
})

// Image Upload endpoint
router.post('/', authenticateToken, upload.single('image'), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' })
      return
    }

    const validImageTypes = /\.(jpg|jpeg|png|gif|webp)$/i
    if (!validImageTypes.test(req.file.originalname)) {
      res.status(400).json({ success: false, error: 'Only image files are allowed!' })
      return
    }

    const fileName = getR2FileName(req.file.originalname, Date.now())
    const fileUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype)

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: fileName
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, error: 'Failed to upload file' })
  }
})

// PDF Upload endpoint
router.post('/pdf', authenticateToken, pdfUpload.single('pdf'), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' })
      return
    }

    if (!req.file.originalname.match(/\.pdf$/i)) {
      res.status(400).json({ success: false, error: 'Only PDF files are allowed!' })
      return
    }

    const fileName = getR2FileName(req.file.originalname, Date.now())
    const fileUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype)

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: fileName,
        originalName: req.file.originalname
      }
    })
  } catch (error) {
    console.error('PDF upload error:', error)
    res.status(500).json({ success: false, error: 'Failed to upload PDF' })
  }
})

export default router
