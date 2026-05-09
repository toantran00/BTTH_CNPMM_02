const bcrypt = require('bcrypt')
const userRepository = require('../repositories/userRepository')
const jwtService = require('./jwtService')
const AuthError = require('../errors/authError')

const roleToProfileUrl = {
    user: '/user/profile',
    admin: '/admin/profile'
}

const isUserActive = (value) => value === true || value === 1 || value === '1'

const authenticateUser = async (credentials) => {
    const { email, password } = credentials
    const userRecord = await userRepository.findUserByEmail(email)

    if (!userRecord) {
        throw new AuthError('Email hoặc password không đúng', 401)
    }

    const isValidPassword = await bcrypt.compare(password, userRecord.passwordHash)
    if (!isValidPassword) {
        throw new AuthError('Email hoặc password không đúng', 401)
    }

    if (!isUserActive(userRecord.isActive)) {
        throw new AuthError('Tài khoản chưa được kích hoạt', 403)
    }

    const userRole = String(userRecord.role || '').toLowerCase()
    if (!roleToProfileUrl[userRole]) {
        throw new AuthError('Role không được hỗ trợ', 403)
    }

    const jwtToken = jwtService.createAccessToken({
        sub: userRecord.id,
        email: userRecord.email,
        role: userRole,
        name: userRecord.name || userRecord.email
    })

    return {
        role: userRole,
        url: roleToProfileUrl[userRole],
        tokenType: 'Bearer',
        token: jwtToken,
        expiresIn: jwtService.getAccessTokenExpiresIn()
    }
}

module.exports = {
    authenticateUser
}
