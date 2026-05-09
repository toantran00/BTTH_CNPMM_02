const express = require('express')
const { getUserProfile, getAdminProfile } = require('../controllers/profileController')
const { authenticateToken, authorizeRoles } = require('../middlewares/auth')

const router = express.Router()

router.get('/user/profile', authenticateToken, authorizeRoles('user'), getUserProfile)
router.get('/admin/profile', authenticateToken, authorizeRoles('admin'), getAdminProfile)

module.exports = router
