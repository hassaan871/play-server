import Joi from "joi";

const validateUserData = {
    body: Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        fullName: Joi.string().min(5).required(),
        password: Joi.string().min(5).required()
    })
}

export {validateUserData}