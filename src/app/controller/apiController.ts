import { NextFunction, Request, Response } from 'express'
import httpResponse from '../../libs/util/helper/httpResponse'
import responseMessage from '../../libs/util/constant/responseMessage'
import httpError from '../../libs/util/helper/httpError'
import quicker from '../../libs/util/helper/quicker'


export default {
    self: (req: Request, res: Response, next: NextFunction) => {
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    health: (req: Request, res: Response, next: NextFunction) => {
        try {
            const healthData = {
                application: quicker.getApplicationHealth(),
                system: quicker.getSystemHealth(),
                timestamp: Date.now()
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
