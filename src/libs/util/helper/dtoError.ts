import { NextFunction, Request } from 'express'
import logger from './logger'
import { TDtoError } from '../types/application'
import { ValidationError } from './validateDTO'

export default (nextFunc: NextFunction, req: Request, errorStatusCode = 400, errMessage: ValidationError[], data?: unknown): void => {
    const errorObj: TDtoError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            method: req.method,
            url: req.originalUrl
        },
        message: errMessage,
        data: {
            docs: data || null
        },
        trace: null
    }

    if (errorStatusCode === 500) {
        logger.error(`CONTROLLER_ERROR`, {
            meta: errorObj
        })
    }

    return nextFunc(errorObj)
}
