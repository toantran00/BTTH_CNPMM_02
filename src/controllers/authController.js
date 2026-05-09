const { authenticateUser } = require('../services/authService')
const AuthError = require('../errors/authError')

const handleLogin = async (req, res, next) => {
    try {
        const userAuthData = await authenticateUser(req.body)
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            ...userAuthData
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return next(error)
    }
}

module.exports = {
    handleLogin
}
