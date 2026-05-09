const Joi = require('joi')

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email không đúng định dạng',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'Password phải có ít nhất 6 ký tự',
        'any.required': 'Password là bắt buộc'
    })
})

const validateLogin = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    })

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.details.map((detail) => detail.message)
        })
    }

    req.body = value
    next()
}

module.exports = validateLogin
