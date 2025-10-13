import { NextFunction, Request, Response } from 'express'
import { THttpError } from '../libs/util/types/application'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: THttpError, _: Request, res: Response, __: NextFunction) => {
    res.status(err.statusCode).json(err)
}
