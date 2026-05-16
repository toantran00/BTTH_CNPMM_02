const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const authRoutes = require('./src/routes/authRoutes')
const profileRoutes = require('./src/routes/profileRoutes')

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))

// Middleware xử lý dữ liệu JSON từ request body
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/', profileRoutes)


app.get('/', (req, res) => {
    res.json({
        message: 'Auth API is running',
        endpoints: {
            login: '/api/auth/login',
            userProfile: '/user/profile',
            adminProfile: '/admin/profile'
        }
    })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    return res.status(500).json({
        message: 'Lỗi hệ thống, vui lòng thử lại sau'
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
