import { NextFunction, Request, Response } from "express"
import { IAuthenticatedRequest, IDecryptedJwt } from "../libs/util/types/auth"
import { VerifyToken } from "../libs/util/helper/syncHelper"
import config from "../config/config"
import { clearAccessTokenCookies } from "../libs/util/helper/cookiesAuth"
import httpError from "../libs/util/helper/httpError"
import responseMessage from "../libs/util/constant/responseMessage"

const authentication = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const req = request as IAuthenticatedRequest
        const { cookies } = req
        const { accessToken } = cookies as { accessToken: string | undefined }

        if (accessToken) {
            const { userId, roleId, role } = VerifyToken(accessToken, config.ACCESS_TOKEN.SECRET as string) as IDecryptedJwt
            if (userId) {
                req.userId = userId
                req.roleId = roleId
                req.role = role
            }
            return next()
        }

        clearAccessTokenCookies(response)
        return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
    } catch (error) {
        return httpError(next, error, request, 401)
    }
}


export default authentication
