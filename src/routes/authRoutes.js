const express = require('express')
const { handleLogin } = require('../controllers/authController')
const validateLogin = require('../middlewares/validateLogin')
const { loginRateLimiter } = require('../middlewares/rateLimiters')

const router = express.Router()

router.post('/login', loginRateLimiter, validateLogin, handleLogin)

module.exports = router
