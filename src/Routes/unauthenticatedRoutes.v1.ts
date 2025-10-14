import { Router } from "express"
import { loginRateLimit } from "../middleware/rateLimit"
import authRouter from '../app/Router/public/auth.routes'

const router = Router()

router.use('/auth', loginRateLimit, authRouter)

export default router
