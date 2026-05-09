const { signJwt, verifyJwt } = require('../utils/jwt')

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-jwt-secret'
const getAccessTokenExpiresIn = () => process.env.JWT_EXPIRES_IN || '1h'

const createAccessToken = (payload) =>
    signJwt(payload, getJwtSecret(), getAccessTokenExpiresIn())

const verifyAccessToken = (token) => verifyJwt(token, getJwtSecret())

module.exports = {
    createAccessToken,
    verifyAccessToken,
    getAccessTokenExpiresIn
}
