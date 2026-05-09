const crypto = require('crypto')

const encodeBase64Url = (value) =>
    Buffer.from(value)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

const decodeBase64Url = (value) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    return Buffer.from(padded, 'base64').toString('utf8')
}

const parseExpiresIn = (expiresIn) => {
    if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
        return expiresIn
    }

    if (typeof expiresIn !== 'string' || expiresIn.trim().length === 0) {
        return 3600
    }

    const trimmed = expiresIn.trim().toLowerCase()
    if (/^\d+$/.test(trimmed)) {
        return Number(trimmed)
    }

    const match = trimmed.match(/^(\d+)([smhd])$/)
    if (!match) {
        return 3600
    }

    const amount = Number(match[1])
    const unit = match[2]
    const unitInSeconds = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400
    }

    return amount * unitInSeconds[unit]
}

const createSignature = (unsignedToken, secret) =>
    crypto
        .createHmac('sha256', secret)
        .update(unsignedToken)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

const signJwt = (payload, secret, expiresIn = '1h') => {
    if (!secret) {
        throw new Error('JWT secret is required')
    }

    const issuedAt = Math.floor(Date.now() / 1000)
    const expiration = issuedAt + parseExpiresIn(expiresIn)
    const header = { alg: 'HS256', typ: 'JWT' }
    const fullPayload = { ...payload, iat: issuedAt, exp: expiration }
    const encodedHeader = encodeBase64Url(JSON.stringify(header))
    const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload))
    const unsignedToken = `${encodedHeader}.${encodedPayload}`
    const signature = createSignature(unsignedToken, secret)

    return `${unsignedToken}.${signature}`
}

const verifyJwt = (token, secret) => {
    if (!secret) {
        throw new Error('JWT secret is required')
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        throw new Error('Invalid token format')
    }

    const [encodedHeader, encodedPayload, signature] = parts
    const unsignedToken = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = createSignature(unsignedToken, secret)

    const incomingSignatureBuffer = Buffer.from(signature)
    const expectedSignatureBuffer = Buffer.from(expectedSignature)
    if (
        incomingSignatureBuffer.length !== expectedSignatureBuffer.length ||
        !crypto.timingSafeEqual(incomingSignatureBuffer, expectedSignatureBuffer)
    ) {
        throw new Error('Invalid token signature')
    }

    const header = JSON.parse(decodeBase64Url(encodedHeader))
    if (header.alg !== 'HS256') {
        throw new Error('Unsupported token algorithm')
    }

    const payload = JSON.parse(decodeBase64Url(encodedPayload))
    const now = Math.floor(Date.now() / 1000)
    if (typeof payload.exp !== 'number' || now >= payload.exp) {
        throw new Error('Token expired')
    }

    return payload
}

module.exports = {
    signJwt,
    verifyJwt
}
