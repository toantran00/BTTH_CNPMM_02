const getUserProfile = (req, res) => {
    res.status(200).json({
        message: 'Authorized user',
        url: '/user/profile',
        profile: {
            id: req.user.sub,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    })
}

const getAdminProfile = (req, res) => {
    res.status(200).json({
        message: 'Authorized admin',
        url: '/admin/profile',
        profile: {
            id: req.user.sub,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    })
}

module.exports = {
    getUserProfile,
    getAdminProfile
}
