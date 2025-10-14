import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './Routes/apiRouter'
import globalErrorHandler from './middleware/globalErrorHandler'
import responseMessage from './libs/util/constant/responseMessage'
import helmet from 'helmet'
import cors from 'cors'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { EApplicationEnvironment } from './libs/util/constant/application'
import config from './config/config'
import cookieParser from 'cookie-parser'
import httpError from './libs/util/helper/httpError'
import unauthenticatedRoutes from './Routes/unauthenticatedRoutes.v1'


const app: Application = express()

// Middleware
app.use(helmet())

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Kolkata')

if (config.ENV != EApplicationEnvironment.DEVELOPMENT) {
    app.set('trust proxy', 1)
}

app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../', 'public')))

app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        origin: [config.CLIENT_URL as string, `https://www.${new URL(config.CLIENT_URL as string).host}`],
        credentials: true
    })
)

// Routes
app.use('/api/v1', router)
app.use('/api/v1', unauthenticatedRoutes)


// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

// Global Error Handler
app.use(globalErrorHandler)

export default app
