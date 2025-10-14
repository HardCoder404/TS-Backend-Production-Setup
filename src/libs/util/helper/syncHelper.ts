import argon2 from 'argon2'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ApiError } from './apiError'
import responseMessage from '../constant/responseMessage'

dayjs.extend(utc)
dayjs.extend(timezone)

export const generateStrongPassword = (): string => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const all = upper + lower + digits + special
    const required = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ]
    for (let i = required.length; i < 10; i++) {
        required.push(all[Math.floor(Math.random() * all.length)])
    }
    for (let i = required.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[required[i], required[j]] = [required[j], required[i]]
    }
    return required.join('')
}

export function generateShortToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    const bytes = crypto.randomBytes(length)
    for (let i = 0; i < length; i++) {
        token += chars[bytes[i] % chars.length]
    }
    return token
}

export const GenerateJwtToken = (payload: object, secret: string, expiry: number): string => {
    return jwt.sign(payload, secret, {
        expiresIn: expiry
    })
}

export const GenerateResetPasswordToken = (payload: object, secret: string, expiry: number): string => {
    return jwt.sign(payload, secret, { expiresIn: expiry })
}

export const VerifyToken = (token: string, secret: string): string | JwtPayload => {
    return jwt.verify(token, secret)
}

export const GetDomain = (url: string): string => {
    try {
        const parsedUrl = new URL(url)
        return parsedUrl.hostname
    } catch (error) {
        throw error
    }
}

export const getMainDomainAfterSubdomain = (url: string): string => {
    try {
        const parsedUrl = new URL(url)
        const hostnameParts = parsedUrl.hostname.split('.')
        if (hostnameParts.length < 2) {
            throw new Error('Invalid domain format')
        }
        return hostnameParts.slice(-2).join('.')
    } catch (error) {
        throw error
    }
}

export const GenerateRandomId = (): string => uuidv4()

export const GenerateOTP = (length: number): string => {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    return crypto.randomInt(min, max).toString()
}

export const EncryptPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await argon2.hash(password)
        return hashedPassword
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : responseMessage.PASSWORD_ENCRYPTION_ERROR
        throw new ApiError(errorMessage, 500)
    }
}

export const VerifyPassword = async (password: string, encryptedPassword: string): Promise<boolean> => {
    try {
        const isPasswordCorrect = await argon2.verify(encryptedPassword, password)
        return isPasswordCorrect
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : responseMessage.PASSWORD_ENCRYPTION_ERROR
        throw new ApiError(errorMessage, 500)
    }
}

export const getFormattedISTDateTime = () => {
    const now = dayjs().tz('Asia/Kolkata')
    const date = now.format('MMMM D, YYYY')
    const time = now.format('hh:mm A').replace('AM', 'A.M.').replace('PM', 'P.M.') + ' IST'
    return { date, time }
}

export const getShiftedISTDate = (num: number, type: 'd' | 'm' | 'y'): Date => {
    const now = dayjs().tz('Asia/Kolkata')
    let shiftedDate
    switch (type) {
        case 'd':
            shiftedDate = now.add(num, 'day')
            break
        case 'm':
            shiftedDate = now.add(num, 'month')
            break
        case 'y':
            shiftedDate = now.add(num, 'year')
            break
        default:
            throw new Error('Invalid type. Use "d" for days, "m" for months, or "y" for years.')
    }
    return shiftedDate.toDate()
}

export const getTrimmedBodyDataOfRequest = (reqBody: any): any => {
    const body = reqBody || {}
    return Object.keys(body).reduce((acc: any, key: string) => {
        const value = body[key]
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            acc[key] = getTrimmedBodyDataOfRequest(value)
        } else {
            acc[key] = typeof value === 'string' ? value.trim() : value
        }
        return acc
    }, {})
}

export const generateNomenId = (prefix: string): string => {
    const uniqueId = generateShortToken(7)
    return `${prefix}${uniqueId}`
}

export const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
}

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const scales = ['', 'thousand', 'million', 'billion', 'trillion']

export function numberToWords(num: number): string {
    if (num === 0) return 'zero'

    const [integerPart, decimalPart] = num.toString().split('.')
    let words: string[] = []

    const intNum = parseInt(integerPart, 10)
    let scaleCounter = 0
    let n = intNum

    while (n > 0) {
        const chunk = n % 1000
        if (chunk) {
            words.unshift(`${convertChunk(chunk)}${scales[scaleCounter] ? ' ' + scales[scaleCounter] : ''}`)
        }
        n = Math.floor(n / 1000)
        scaleCounter++
    }

    let result = words.join(' ').trim()

    if (decimalPart) {
        const decimals = decimalPart
            .split('')
            .map((d) => ones[parseInt(d)])
            .join(' ')
        result += ` point ${decimals}`
    }

    return result
}

function convertChunk(num: number): string {
    let str = ''

    const hundred = Math.floor(num / 100)
    const remainder = num % 100

    if (hundred) {
        str += `${ones[hundred]} hundred `
    }

    if (remainder >= 10 && remainder < 20) {
        str += teens[remainder - 10]
    } else {
        const ten = Math.floor(remainder / 10)
        const one = remainder % 10
        if (ten) str += tens[ten] + ' '
        if (one) str += ones[one] + ' '
    }

    return str.trim()
}
