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
    }
} as const
