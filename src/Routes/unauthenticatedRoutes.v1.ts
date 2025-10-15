import { Router } from 'express'
import { loginRateLimit } from '../middleware/rateLimit'
import authRouter from '../app/Router/public/auth.routes'
import pass from '../app/Router/public/password.routes'

const router = Router()

router.use('/auth', loginRateLimit, authRouter)
router.use('/pass', loginRateLimit, pass)

export default router
