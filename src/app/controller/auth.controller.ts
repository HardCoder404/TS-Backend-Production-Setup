import dayjs from 'dayjs'
import config from '../../config/config'
import responseMessage from '../../libs/util/constant/responseMessage'
import { ApiError } from '../../libs/util/helper/apiError'
import { EncryptPassword, GenerateJwtToken, VerifyPassword } from '../../libs/util/helper/syncHelper'
import { AuthDocs } from '../../libs/util/types/auth/AuthResponse'
import { ApiResponse } from '../../libs/util/types/application'
import { UserLoginDTO } from '../../libs/util/DTO/auth/UserLoginDTO'
import { RefreshToken } from '../../libs/database/mongoDB/model/authUser/RefreshTokens'
import { User } from '../../libs/database/mongoDB/model/authUser/authUser'
import { UserRegisterDTO } from '../../libs/util/DTO/auth/UserRegisterDTO'

// Register User
export const UserRegister = async (input: UserRegisterDTO): Promise<ApiResponse<AuthDocs>> => {
    try {
        const { firstName, lastName, username, email, password } = input

        // Check if user or email already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })
        if (existingUser) {
            throw new ApiError(responseMessage.ALREADY_EXISTS_USER, 400)
        }

        // Hash password
        const hashedPassword = await EncryptPassword(password)

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        })

        // Generate tokens
        const accessToken = GenerateJwtToken(
            { userId: newUser._id, email: newUser.email },
            config.ACCESS_TOKEN.SECRET || 'default',
            config.ACCESS_TOKEN.EXPIRY || 1
        )

        const refreshToken = GenerateJwtToken({ userId: newUser._id }, config.REFRESH_TOKEN.SECRET || 'default', config.REFRESH_TOKEN.EXPIRY || 86400)

        // Save refresh token
        await RefreshToken.create({
            userId: newUser._id,
            refreshToken,
            expiresAt: dayjs().add(config.REFRESH_TOKEN.EXPIRY, 'second').toDate()
        })

        const response: AuthDocs = {
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email
            },
            accessToken,
            refreshToken
        }

        return {
            success: true,
            statusCode: 201,
            message: responseMessage.REGISTER(`${firstName} ${lastName}`),
            data: { docs: response }
        }
    } catch (error: any) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return { success: false, statusCode, message: errMessage, error }
    }
}

// Login User
export const UserLogin = async (input: UserLoginDTO): Promise<ApiResponse<AuthDocs>> => {
    const { email, username, password, isRememberMe } = input
    try {
        const rememberMe = isRememberMe === 'true'

        // Fetch user by email or username
        const user = await User.findOne({
            $or: [{ email }, { username }]
        })

        // User not found or wrong password → generic error
        if (!user) {
            throw new ApiError(responseMessage.INVALID_CREDENTIALS('Login'), 400)
        }

        // User exists but inactive
        if (!user.isActive) {
            throw new ApiError(responseMessage.LOGIN_RESTRICTED, 403)
        }

        // Verify password
        const isPasswordCorrect = await VerifyPassword(password, user.password)
        if (!isPasswordCorrect) {
            throw new ApiError(responseMessage.INVALID_CREDENTIALS('Login'), 400)
        }

        // Generate access token
        const accessToken = GenerateJwtToken(
            { userId: user._id, email: user.email },
            config.ACCESS_TOKEN.SECRET || 'default',
            config.ACCESS_TOKEN.EXPIRY || 1
        )

        // Generate refresh token with dynamic expiry
        const refreshToken = GenerateJwtToken(
            { userId: user._id },
            config.REFRESH_TOKEN.SECRET || 'default',
            rememberMe
                ? config.REFRESH_TOKEN.RememberExpiry || 604800 // 7 days
                : config.REFRESH_TOKEN.EXPIRY || 86400 // 1 day
        )

        // Save refresh token with expiry
        await RefreshToken.create({
            userId: user._id,
            refreshToken,
            expiresAt: dayjs()
                .add(rememberMe ? config.REFRESH_TOKEN.RememberExpiry : config.REFRESH_TOKEN.EXPIRY, 'second')
                .toDate()
        })

        // Prepare response
        const response: AuthDocs = {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.LOGIN,
            data: { docs: response }
        }
    } catch (error: any) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return { success: false, statusCode, message: errMessage, error }
    }
}
