import dayjs from 'dayjs'
import config from '../../config/config'
import { sendEmailToSingleUser } from '../../libs/AWS/ses/emailSender'
import { User } from '../../libs/database/mongoDB/model/authUser/authUser'
import responseMessage from '../../libs/util/constant/responseMessage'
import { UserChangePasswordDTO } from '../../libs/util/DTO/auth/UserChangePasswordDTO'
import { ApiError } from '../../libs/util/helper/apiError'
import { EncryptPassword, GenerateResetPasswordToken, getFormattedISTDateTime, VerifyPassword } from '../../libs/util/helper/syncHelper'
import { ApiResponse } from '../../libs/util/types/application'
import { PasswordChangeSuccess } from '../../libs/util/view/passwordChangeSuccess'
import { ResetPasswordEmail } from '../../libs/util/view/passwordResetMail'
import { UserOTPs } from '../../libs/database/mongoDB/model/authUser/userOTPs'
import { UserResetPasswordDTO } from '../../libs/util/DTO/auth/UserResetPasswordDTO'

export const ChangePassword = async (input: UserChangePasswordDTO, userId: string): Promise<ApiResponse> => {
    const { newPassword, oldPassword, confirmPassword } = input

    try {
        // Validate new & confirm password
        if (newPassword !== confirmPassword) {
            throw new ApiError(responseMessage.CONFIRM_PASS_NEW_PASS_NOT_MATCH, 400)
        }

        // Prevent using same old & new password
        if (oldPassword === newPassword) {
            throw new ApiError(responseMessage.OLD_PASS_NEW_PASS_MATCH, 400)
        }

        // Find user by ID
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        // Verify old password
        const isPasswordMatching = await VerifyPassword(oldPassword, user.password)
        if (!isPasswordMatching) {
            throw new ApiError(responseMessage.OLD_PASS_NOT_MATCH, 400)
        }

        // Encrypt new password
        const encryptedPassword = await EncryptPassword(newPassword)
        user.password = encryptedPassword

        // Save user
        await user.save()

        // Send success email
        const { date, time } = getFormattedISTDateTime()
        const { success, message } = await sendEmailToSingleUser({
            subject: 'Password changed successfully',
            sourceName: 'TS-Production-Backend',
            sourceEmail: config.OPERATION_EMAIL as string,
            body: PasswordChangeSuccess(user.firstName + user.lastName, date, time, `${config.CLIENT_URL}/auth/login`),
            to: user.email,
            replyTo: config.REPLY_TO_EMAIL as string
        })

        if (!success) {
            throw new ApiError(message, 500)
        }

        // Return final response
        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS('Password')
        }
    } catch (error: any) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500

        return {
            success: false,
            statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const ForgotPassword = async (identifier: string): Promise<ApiResponse> => {
    try {
        // Find user by either email OR username
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        })

        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        // Generate reset password token
        const token = GenerateResetPasswordToken(
            { userId: user.id.toString() },
            config.RESET_PASSWORD_TOKEN.SECRET as string,
            config.RESET_PASSWORD_TOKEN.EXPIRY
        )

        // Calculate expiry time
        const expiry = dayjs().add(config.RESET_PASSWORD_TOKEN.EXPIRY, 'second').toDate()

        // Check if OTP record already exists
        const existingOtp = await UserOTPs.findOne({ userId: user.id })

        if (existingOtp) {
            existingOtp.otp = '-1'
            existingOtp.token = token
            existingOtp.expiresAt = expiry
            await existingOtp.save()
        } else {
            await UserOTPs.create({
                otp: '-1',
                token,
                expiresAt: expiry,
                userId: user._id
            })
        }

        // Send reset password email
        const { success, message } = await sendEmailToSingleUser({
            subject: 'Reset Password Request',
            sourceName: 'TS-Production-Backend',
            sourceEmail: config.OPERATION_EMAIL as string,
            body: ResetPasswordEmail(
                user.firstName + user.lastName,
                `${config.CLIENT_URL}/reset-password?token=${token}`,
                config.RESET_PASSWORD_TOKEN.EXPIRY / 60
            ),
            to: user.email,
            replyTo: config.REPLY_TO_EMAIL as string
        })

        if (!success) {
            throw new ApiError(message, 500)
        }

        // Return success response
        return {
            success: true,
            statusCode: 200,
            message: responseMessage.RESET_PASSWORD_LINK_SENT
        }
    } catch (error: any) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500

        return {
            success: false,
            statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const ResetPassword = async (input: UserResetPasswordDTO): Promise<ApiResponse> => {
    const { newPassword, confirmPassword, token } = input
    try {
        if (newPassword !== confirmPassword) {
            throw new ApiError(responseMessage.CONFIRM_PASS_NEW_PASS_NOT_MATCH, 400)
        }
        const passwordReset = await UserOTPs.findOne({ token })

        if (!passwordReset) {
            throw new ApiError(responseMessage.INVALID('Token'), 400)
        }
        if (dayjs().isAfter(dayjs(passwordReset.expiresAt))) {
            throw new ApiError(responseMessage.INVALID('Token'), 400)
        }
        const user = await User.findById(passwordReset.userId)
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }
        const isPasswordMatching = await VerifyPassword(newPassword, user.password)
        if (isPasswordMatching) {
            throw new ApiError(responseMessage.OLD_PASS_NEW_PASS_MATCH, 400)
        }
        const encryptedPassword = await EncryptPassword(newPassword)
        user.password = encryptedPassword
        await user.save()
        await UserOTPs.deleteOne({ userId: user.id })

        const { date, time } = getFormattedISTDateTime()
        await sendEmailToSingleUser({
            subject: 'Password changed successfully',
            sourceName: 'TS-Production-Backend',
            sourceEmail: config.OPERATION_EMAIL as string,
            body: PasswordChangeSuccess(user.firstName + user.lastName, date, time, `${config.CLIENT_URL}/auth/login`),
            to: user.email,
            replyTo: config.REPLY_TO_EMAIL as string
        })
        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS('Passsword')
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}
