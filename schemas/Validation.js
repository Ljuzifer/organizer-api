const Joi = require("joi");

const ValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.alternatives()
        .try(
            Joi.string().pattern(/^\d{10}$/),
            Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{2}-\d{2}$/),
            Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{2}-\d{2}$/),
            Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/),
            Joi.string().pattern(/^\d{3} \d{3}-\d{2}-\d{2}$/),
            Joi.string().pattern(/^\d{3}-\d{3}-\d{2}-\d{2}$/),
            Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{4}$/),
            Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
            Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{4}$/),
            Joi.string().pattern(/^\(\d{3}\)\d{7}$/),
            Joi.string().pattern(/^\(\d{3}\) \d{7}$/),
            Joi.string().pattern(/^\(\d{3}\)-\d{7}$/),
            Joi.string().pattern(/^\d{3} \d{7}$/),
            Joi.string().pattern(/^\d{3}-\d{7}$/),
        )
        .required(),
    favorite: Joi.boolean(),
});

const PatchSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const RegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default("starter"),
});

const LoginSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
});

const SubscriptionSchema = Joi.object({
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default("starter")
        .required(),
});

module.exports = {
    ValidationSchema,
    PatchSchema,
    RegisterSchema,
    LoginSchema,
    SubscriptionSchema,
};
