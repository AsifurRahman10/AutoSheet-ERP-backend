import { Router } from 'express'
import verifyAuth from '../middleware/auth.middleware.js'
import { registerUser } from '../controllers/user.controller.js'

const router = Router()

router.post('/register-user', registerUser)

export default router
