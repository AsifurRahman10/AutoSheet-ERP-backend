import { Router } from 'express'
import verifyAuth from '../middleware/auth.middleware.js'
import { processImageData } from '../controllers/extract.controller.js'

const router = Router()

router.post('/process-images', verifyAuth, processImageData)

export default router
