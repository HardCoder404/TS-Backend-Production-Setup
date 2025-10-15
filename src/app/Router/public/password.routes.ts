import { Router, Response, NextFunction, Request } from 'express'
import authentication, { resetPasswordTokenVerifier } from '../../../middleware/authentication'
import httpError from '../../../libs/util/helper/httpError'
import { UserChangePasswordDTO } from '../../../libs/util/DTO/auth/UserChangePasswordDTO'
import { validateDTO } from '../../../libs/util/helper/validateDTO'
import dtoError from '../../../libs/util/helper/dtoError'
import { ChangePassword, ForgotPassword, ResetPassword } from '../../controller/password.controller'
import httpResponse from '../../../libs/util/helper/httpResponse'
import { UserResetPasswordDTO } from '../../../libs/util/DTO/auth/UserResetPasswordDTO'

const router = Router()

// Route: /api/v1/pass/change
// Method: POST
// Desc: Change user password
// Access: Protected
router.post('/change', authentication, async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId
        if (!userId) {
            return httpError(next, new Error('User Id is required'), req, 401)
        }
        const input = req.body as UserChangePasswordDTO
        const requestValidation = await validateDTO(UserChangePasswordDTO, input)
        if (!requestValidation.success) {
            return dtoError(next, req, requestValidation.status, requestValidation.errors)
        }
        const { success, statusCode, message, data, error } = await ChangePassword(input, userId)
        if (!success) {
            return httpError(next, error, req, statusCode)
        }
        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/pass/isTokenValid
// Method: GET
// Desc: Verify if the reset password token is valid
// Access: Public
router.get('/isTokenValid', resetPasswordTokenVerifier, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return httpResponse(req, res, 200, 'Token is valid', { valid: true })
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/pass/reset
// Method: POST
// Desc: Reset user password
// Access: Public
router.post('/reset', resetPasswordTokenVerifier, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let input = req.body as UserResetPasswordDTO
        input = {
            ...input,
            token: req.query.token as string
        }
        const requestValidation = await validateDTO(UserResetPasswordDTO, input)
        if (!requestValidation.success) {
            return dtoError(next, req, requestValidation.status, requestValidation.errors)
        }
        const { success, statusCode, message, data, error } = await ResetPassword(input)
        if (!success) {
            return httpError(next, error, req, statusCode)
        }
        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

// Route: /api/v1/pass/forgot
// Method: POST
// Desc: Request forgot password
// Access: Public
router.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email
        if (!email) {
            return httpError(next, new Error('Email address is required'), req, 400)
        }
        const { success, statusCode, message, data, error } = await ForgotPassword(email)
        if (!success) {
            return httpError(next, error, req, statusCode)
        }
        return httpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

export default router
