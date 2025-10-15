import { NextFunction, Request, Response, Router } from 'express'
import { UserLoginDTO } from '../../../libs/util/DTO/auth/UserLoginDTO'
import { validateDTO } from '../../../libs/util/helper/validateDTO'
import dtoError from '../../../libs/util/helper/dtoError'
import httpError from '../../../libs/util/helper/httpError'
import {
    clearAccessTokenCookies,
    clearRefreshTokenCookies,
    generateAccessTokenCookie,
    generateRefreshTokenCookie
} from '../../../libs/util/helper/cookiesAuth'
import httpResponse from '../../../libs/util/helper/httpResponse'
import { AuthResponse } from '../../../libs/util/types/auth/AuthResponse'
import { LogoutUser, UserLogin, UserRegister } from '../../controller/auth.controller'
import { UserRegisterDTO } from '../../../libs/util/DTO/auth/UserRegisterDTO'

const router = Router()

// Route: /api/v1/auth/login
// Method: POST
// Desc: Login user
// Body: UserLoginDTO
// Access: Public
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UserLoginDTO
        const requestValidation = await validateDTO(UserLoginDTO, input)
        if (!requestValidation.success) {
            return dtoError(next, req, requestValidation.status, requestValidation.errors)
        }
        const { isRememberMe } = input
        const rememberMe = isRememberMe == 'true' ? true : false
        const { success, statusCode, message, data, error } = await UserLogin(input)
        if (!success) {
            return httpError(next, error, req, statusCode)
        }
        if (data) {
            const accessToken = (data.docs as { accessToken: string }).accessToken
            const refreshToken = (data.docs as { refreshToken: string }).refreshToken
            const res2 = generateAccessTokenCookie(res, accessToken)
            generateRefreshTokenCookie(res2, refreshToken, rememberMe)
        }

        const dataResponse = {
            docs: {
                user: data?.docs.user,
                accessToken: (data?.docs as { accessToken: string }).accessToken
            }
        } as AuthResponse

        return httpResponse(req, res, statusCode, message, dataResponse)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/auth/register
// Method: POST
// Desc: Register new user
// Body: UserRegisterDTO
// Access: Public
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UserRegisterDTO

        // Validate DTO
        const requestValidation = await validateDTO(UserRegisterDTO, input)
        if (!requestValidation.success) {
            return dtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        // Call controller
        const { success, statusCode, message, data, error } = await UserRegister(input)

        if (!success) {
            return httpError(next, error, req, statusCode)
        }

        // Send successful response
        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/auth/logout
// Method: PUT
// Desc: Logout user
// Access: Public
router.put('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        const { refreshToken } = cookies as { refreshToken: string | undefined }
        if (!refreshToken) {
            return httpResponse(req, res, 200, 'Logout successful', null)
        }
        const { success, statusCode, message, data, error } = await LogoutUser(refreshToken)
        if (!success) {
            return httpError(next, error, req, statusCode)
        }
        clearAccessTokenCookies(res)
        clearRefreshTokenCookies(res)
        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

export default router
