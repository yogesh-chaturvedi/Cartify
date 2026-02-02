const Joi = require('joi')

// signup validation function
const signupValidation = (req, res, next) => {

    const schema = Joi.object({
        fullName: Joi.string().trim().min(3).max(30).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(15).required(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message, success: false })
    }

    next();

}

// login validation function
const loginValidation = (req, res, next) => {

    const schema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(15).required(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message, success: false })
    }

    next();
}

module.exports = { signupValidation, loginValidation }