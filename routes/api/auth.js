const { Router, json } = require("express");
const mode = require("../../controllers/authMode");
const {
    RegisterSchema,
    LoginSchema,
    SubscriptionSchema,
} = require("../../schemas/Validation");
const { validateMethod, authentication } = require("../../middlewares");

const router = Router();
const parseJSON = json();

router.post(
    "/registration",
    parseJSON,
    validateMethod(RegisterSchema),
    mode.registration,
);

router.post("/login", parseJSON, validateMethod(LoginSchema), mode.login);

router.post("/logout", parseJSON, authentication, mode.logout);

router.get("/current", parseJSON, authentication, mode.current);

router.patch(
    "/subscription",
    parseJSON,
    authentication,
    validateMethod(SubscriptionSchema),
    mode.subscription,
);

module.exports = router;
