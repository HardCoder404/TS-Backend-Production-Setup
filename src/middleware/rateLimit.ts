import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import { EApplicationEnvironment } from '../libs/util/constant/application'
import { loginLimiterMongo, rateLimiterMongo } from '../libs/util/rateLimiter'
import responseMessage from '../libs/util/constant/responseMessage'
import httpError from '../libs/util/helper/httpError'

export default (req: Request, _: Response, next: NextFunction) => {
    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return next()
    }

    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip as string, 1)
            .then(() => {
                next()
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429)
            })
    }
}
export const loginRateLimit = (req: Request, _: Response, next: NextFunction) => {
    if (loginLimiterMongo) {
        loginLimiterMongo
            .consume(req.ip as string, 1)
            .then(() => {
                next()
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429)
            })
    }
}
