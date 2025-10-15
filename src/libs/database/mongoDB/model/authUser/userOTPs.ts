import mongoose, { Document, Schema } from 'mongoose'

export interface IUserOTP extends Document {
    userId: mongoose.Types.ObjectId
    otp: string
    token: string
    expiresAt: Date
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date | null
}

const UserOTPSchema = new Schema<IUserOTP>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true // adds createdAt and updatedAt automatically
    }
)

// Optional: emulate “paranoid delete” like Sequelize
UserOTPSchema.methods.softDelete = async function () {
    this.deletedAt = new Date()
    await this.save()
}

export const UserOTPs = mongoose.model<IUserOTP>('UserOTPs', UserOTPSchema)
