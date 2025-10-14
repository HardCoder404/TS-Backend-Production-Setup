import { Router } from "express"
import applicationRouter from '../app/Router/private/application.routes'


const router = Router()

router.use('/', applicationRouter)


export default router
