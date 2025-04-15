import Joi from "joi";

const passwordSchema = Joi.string().min(5).required();

const validateUserData = {

    Signup: Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        fullName: Joi.string().min(5).required(),
        password: passwordSchema
    }),

    ResetPassword: Joi.object({
        newPassword: passwordSchema
    })

}

export { validateUserData }