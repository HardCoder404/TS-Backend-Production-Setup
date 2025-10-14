import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

// Indexes for fast lookup
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })

export const User = mongoose.model<IUser>('User', UserSchema, 'Users')
