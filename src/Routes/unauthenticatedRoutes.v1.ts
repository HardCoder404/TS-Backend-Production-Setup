import { Router } from 'express'
import { loginRateLimit } from '../middleware/rateLimit'
import authRouter from '../app/Router/public/auth.routes'
import pass from '../app/Router/public/password.routes'
import testRouter from '../app/Router/public/test.routes'


const router = Router()

router.use('/auth', loginRateLimit, authRouter)
router.use('/pass', loginRateLimit, pass)
router.use('/test', testRouter)


export default router
