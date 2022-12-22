import joi from "joi";

export const userSchema = joi.object({
    name: joi.string().required().min(2).max(100),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref("password")
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});