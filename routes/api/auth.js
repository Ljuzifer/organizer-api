const { Router, json } = require("express");
const mode = require("../../controllers/authMode");
const { RegisterSchema, LoginSchema } = require("../../schemas/Validation");
const { validateMethod } = require("../../middlewares");

const router = Router();
const parseJSON = json();

router.post(
  "/registration",
  parseJSON,
  validateMethod(RegisterSchema),
  mode.registration,
);

router.post("/login", parseJSON, validateMethod(LoginSchema), mode.login);

module.exports = router;
