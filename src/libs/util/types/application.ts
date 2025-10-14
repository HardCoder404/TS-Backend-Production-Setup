import { ValidationError } from "../helper/validateDTO"

export type THttpResponse = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THttpError = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
    trace?: object | null
}

export type ApiResponse<T = unknown> = {
    success: boolean
    statusCode: number
    message: string
    error?: Error
    data?: {
        docs: T
        total?: number
        page?: number
        limit?: number
    }
}

export type functionResponse<T = undefined> = {
    success: boolean
    statusCode: number
    message: string
    data?: T
    error?: Error
}

export type TDtoError = {
    success: boolean
    statusCode: number
    request: {
        method: string
        url: string
    }
    message: ValidationError[]
    data: unknown
    trace: null
}
