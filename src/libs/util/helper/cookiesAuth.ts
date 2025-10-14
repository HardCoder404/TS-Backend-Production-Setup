import { Response } from 'express'
import { GetDomain, getMainDomainAfterSubdomain } from './syncHelper'
import config from '../../../config/config'

export const clearRefreshTokenCookies = (res: Response) => {
    const DOMAIN = GetDomain(config.CLIENT_URL || '')
    res.clearCookie('refreshToken', {
        path: '/',
        domain: config.CLIENT_URL
            ? config.CLIENT_URL.startsWith('https')
                ? `.${getMainDomainAfterSubdomain(config.CLIENT_URL)}`
                : undefined
            : DOMAIN,
        sameSite: 'lax',
        maxAge: 1e3 * config.ACCESS_TOKEN.EXPIRY,
        httpOnly: true,
        secure: config.CLIENT_URL ? config.CLIENT_URL.startsWith('https') : false
    })
}

export const clearAccessTokenCookies = (res: Response) => {
    const DOMAIN = GetDomain(config.CLIENT_URL || '')
    res.clearCookie('accessToken', {
        path: '/',
        domain: config.CLIENT_URL
            ? config.CLIENT_URL.startsWith('https')
                ? `.${getMainDomainAfterSubdomain(config.CLIENT_URL)}`
                : undefined
            : DOMAIN,
        sameSite: 'lax',
        maxAge: 1e3 * config.ACCESS_TOKEN.EXPIRY,
        httpOnly: true,
        secure: config.CLIENT_URL ? config.CLIENT_URL.startsWith('https') : false
    })
}

export const generateAccessTokenCookie = (res: Response, accessToken: string) => {
    const DOMAIN = GetDomain(config.CLIENT_URL || '')
    res.cookie('accessToken', accessToken, {
        path: '/',
        domain: config.CLIENT_URL
            ? config.CLIENT_URL.startsWith('https')
                ? `.${getMainDomainAfterSubdomain(config.CLIENT_URL)}`
                : undefined
            : DOMAIN,
        sameSite: 'lax',
        maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
        httpOnly: true,
        secure: config.CLIENT_URL ? config.CLIENT_URL.startsWith('https') : false
    })
    return res
}

export const generateRefreshTokenCookie = (res: Response, refreshToken: string, isRememberMe: boolean) => {
    const DOMAIN = GetDomain(config.CLIENT_URL || '')
    res.cookie('refreshToken', refreshToken, {
        path: '/',
        domain: config.CLIENT_URL
            ? config.CLIENT_URL.startsWith('https')
                ? `.${getMainDomainAfterSubdomain(config.CLIENT_URL)}`
                : undefined
            : DOMAIN,
        sameSite: 'lax',
        maxAge: 1000 * (isRememberMe ? config.REFRESH_TOKEN.RememberExpiry : config.REFRESH_TOKEN.EXPIRY),
        httpOnly: true,
        secure: config.CLIENT_URL ? config.CLIENT_URL.startsWith('https') : false
    })
    return res
}
