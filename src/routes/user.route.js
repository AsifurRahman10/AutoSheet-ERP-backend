import { Router } from 'express'
import verifyAuth from '../middleware/auth.middleware.js'
import { getAllUsers, registerUser } from '../controllers/user.controller.js'

const router = Router()

router.post('/register-user', registerUser)
router.get('/all-users', verifyAuth, getAllUsers)

export default router
