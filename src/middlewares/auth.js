const jwtService = require('../services/jwtService')

const authenticateToken = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: thiếu Bearer token' })
    }

    const token = authorization.slice(7).trim()
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: token không hợp lệ' })
    }

    try {
        req.user = jwtService.verifyAccessToken(token)
        next()
    } catch (error) {
        return res.status(401).json({ message: `Unauthorized: ${error.message}` })
    }
}

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: chưa xác thực' })
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: bạn không có quyền truy cập' })
    }

    next()
}

module.exports = {
    authenticateToken,
    authorizeRoles
}
