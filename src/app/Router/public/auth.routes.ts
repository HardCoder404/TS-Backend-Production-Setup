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
import { GenerateNewAccessToken, LogoutUser, RefreshSession, UserLogin, UserRegister } from '../../controller/auth.controller'
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

// Route: /api/v1/auth/refresh-token
// Method: GET
// Desc: Generate new access token from refresh token
// Access: Public
router.get('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        //console.log('Cookies:', cookies);
        const { refreshToken } = cookies as { refreshToken: string | undefined }
        //console.log('Refresh Token:', refreshToken);
        if (!refreshToken) {
            return httpError(next, new Error('Session expired'), req, 401)
        }
        const { success, statusCode, message, error, data } = await GenerateNewAccessToken(refreshToken)
        if (!success) {
            clearAccessTokenCookies(res)
            clearRefreshTokenCookies(res)
            return httpError(next, error, req, statusCode)
        }

        const accessToken = (data?.docs as { accessToken: string }).accessToken
        generateAccessTokenCookie(res, accessToken)

        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/auth/refresh-session
// Method: GET
// Desc: Generate new access token from refresh token
// Access: Public
router.get('/refresh-session', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        const { refreshToken } = cookies as { refreshToken: string | undefined }
        if (!refreshToken) {
            return httpError(next, new Error('Refresh token not found'), req, 401)
        }
        const { success, statusCode, message, error, data } = await RefreshSession(refreshToken)
        if (!success) {
            clearAccessTokenCookies(res)
            clearRefreshTokenCookies(res)
            return httpError(next, error, req, statusCode)
        }

        const accessToken = (data?.docs as { accessToken: string }).accessToken
        generateAccessTokenCookie(res, accessToken)

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

export default router
