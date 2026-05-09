const rateLimit = require('express-rate-limit')

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau 15 phút'
    }
})

module.exports = {
    loginRateLimiter
}
