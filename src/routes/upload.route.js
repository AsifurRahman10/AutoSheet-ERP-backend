import { Router } from 'express'
import { uploadImage } from '../controllers/upload.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import verifyAuth from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', upload.single('imageUrl'), verifyAuth, uploadImage)

export default router
