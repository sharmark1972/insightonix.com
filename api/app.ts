/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import issueRoutes from './routes/issues.js'
import articleRoutes from './routes/articles.js'
import boardRoutes from './routes/board.js'
import settingsRoutes from './routes/settings.js'
import certificateRoutes from './routes/certificates.js'
import awardRoutes from './routes/awards.js'
import uploadRoutes from './routes/upload.js'
import ebookRoutes from './routes/ebooks.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/board-members', boardRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/awards', awardRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/ebooks', ebookRoutes)

/**
 * Serve static files
 */
const distPath = path.resolve(__dirname, '../dist')

app.use(express.static(distPath))

/**
 * SPA Fallback
 */
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
