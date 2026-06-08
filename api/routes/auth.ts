import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password required' })
      return
    }

    // Find user
    let user = await prisma.admin.findUnique({
      where: { username },
    })

    // If no user found, check if we should create the default admin
    if (!user && username === 'admin' && password === 'admin123') {
      const adminCount = await prisma.admin.count();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        user = await prisma.admin.create({
          data: {
            username: 'admin',
            password_hash: hashedPassword,
            email: 'admin@insightonix.com'
          }
        });
      }
    }

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' })
      return
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      res.status(401).json({ success: false, error: 'Invalid credentials' })
      return
    }

    // Update last login
    await prisma.admin.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Check auth status
import { authenticateToken, type AuthRequest } from '../middleware/auth.js'
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user })
})

export default router
