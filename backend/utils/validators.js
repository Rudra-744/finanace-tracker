import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        "string.min": "Name must be at least 2 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    role: Joi.string().valid("viewer", "analyst", "admin").default("viewer"),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

export const recordSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        "number.positive": "Amount must be a positive number",
        "any.required": "Amount is required",
    }),
    type: Joi.string().valid("income", "expense").required().messages({
        "any.only": "Type must be either income or expense",
        "any.required": "Type is required",
    }),
    category: Joi.string().min(1).max(50).required().messages({
        "any.required": "Category is required",
    }),
    notes: Joi.string().max(200).allow("").optional(),
    date: Joi.date().optional(),
});
