export interface AuthUser {
    id: string | number
    firstName: string
    lastName: string
    username: string
    email: string
}

export interface AuthDocs {
    user: AuthUser
    accessToken?: string | null
    refreshToken?: string | null
}

export interface AuthResponse {
    docs?: AuthDocs
}
