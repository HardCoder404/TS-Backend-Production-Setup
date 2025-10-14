import mongoose, { Schema, Document } from 'mongoose'

export interface IRefreshToken extends Document {
    userId?: mongoose.Schema.Types.ObjectId
    refreshToken: string
    expiresAt: Date
    system?: boolean
    createdAt?: Date
    updatedAt?: Date
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            index: true
        },
        refreshToken: {
            type: String,
            required: true,
            index: true
        },
        system: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true // adds createdAt & updatedAt automatically
    }
)

// Optional index optimization (similar to Sequelize indexes)
RefreshTokenSchema.index({ userId: 1 }, { name: 'RefreshToken_userId' })
RefreshTokenSchema.index({ refreshToken: 1 }, { name: 'RefreshToken_refreshToken' })
RefreshTokenSchema.index({ expiresAt: 1 }, { name: 'RefreshToken_expiresAt' })

// Create and export model
export const RefreshToken = mongoose.model<IRefreshToken>(
    'RefreshToken',
    RefreshTokenSchema,
    'RefreshTokens' // optional custom collection name
)
