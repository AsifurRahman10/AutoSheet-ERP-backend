import { Router } from 'express'
import verifyAuth from '../middleware/auth.middleware.js'
import {
  getAllUsers,
  getUserData,
  registerUser,
} from '../controllers/user.controller.js'

const router = Router()

router.post('/register-user', verifyAuth, registerUser)
router.get('/all-users', verifyAuth, getAllUsers)
router.get('/user/:id', verifyAuth, getUserData)

export default router
