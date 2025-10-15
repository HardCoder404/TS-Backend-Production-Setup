import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.SERVER_URL,

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Tokens
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET,
        EXPIRY: 60 * 10 // 10 minutes
    },
    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET,
        EXPIRY: 60 * 60 * 12, // 12 hours
        RememberExpiry: 60 * 60 * 24 * 10 // 10 days
    },
    RESET_PASSWORD_TOKEN: {
        SECRET: process.env.RESET_PASSWORD_TOKEN_SECRET,
        EXPIRY: 60 * 15 // 15 minutes
    },

    //AWS
    ORIGIN: process.env.AWS_REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_KMS_KEY: process.env.AWS_KMS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_SIGN_EXPIRY_TIME: 60 * 5,

    //MAILS
    OPERATION_EMAIL: process.env.OPERATION_EMAIL,
    PAYMENT_EMAIL: process.env.PAYMENT_EMAIL,
    REPLY_TO_EMAIL: process.env.REPLY_TO_EMAIL,
    DOMAIN: process.env.DOMAIN
} as const
