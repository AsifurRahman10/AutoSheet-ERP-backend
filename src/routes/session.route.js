import { Router } from 'express'
import {
  refreshSession,
  storeSession,
} from '../controllers/session.controller.js'

const router = Router()

router.post('/session', storeSession)
router.get('/refresh', refreshSession)

export default router
