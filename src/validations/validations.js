import Joi from "joi";

const eamilSchema = Joi.string().email().required();

const passwordSchema = Joi.string().min(5).required();

const validateUserData = {

    Signup: Joi.object({
        username: Joi.string().min(3).required(),
        email: eamilSchema,
        fullName: Joi.string().min(5).required(),
        password: passwordSchema
    }),

    EamilVerification: Joi.object({
        email: eamilSchema
    }),

    ResetPassword: Joi.object({
        newPassword: passwordSchema
    })

}

export { validateUserData }