const express = require("express");
const mode = require("../../controllers/contactMode");
const {
  isValidId,
  validateMethod,
  authentication,
} = require("../../middlewares");
const { ValidationSchema, PatchSchema } = require("../../schemas/Validation");

const router = express.Router();
const parseJSON = express.json();

router.get("/", authentication, parseJSON, mode.getAll);

router.get("/:contactId", authentication, parseJSON, isValidId, mode.getById);

router.post(
  "/",
  authentication,
  parseJSON,
  validateMethod(ValidationSchema),
  mode.postItem,
);

router.delete("/:contactId", authentication, isValidId, mode.deleteItem);

router.put(
  "/:contactId",
  authentication,
  parseJSON,
  isValidId,
  validateMethod(ValidationSchema),
  mode.putItem,
);

router.patch(
  "/:contactId/favorite",
  authentication,
  parseJSON,
  isValidId,
  validateMethod(PatchSchema),
  mode.patchItem,
);

module.exports = router;
