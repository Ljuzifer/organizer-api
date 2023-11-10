const express = require("express");
const mode = require("../../controllers/contactMode");
const { isValidId, validateMethod } = require("../../middlewares");
const { ValidationSchema, PatchSchema } = require("../../schemas/Validation");

const router = express.Router();
const parseJSON = express.json();

router.get("/", parseJSON, mode.getAll);

router.get("/:contactId", parseJSON, isValidId, mode.getById);

router.post("/", validateMethod(ValidationSchema), mode.postItem);

router.delete("/:contactId", isValidId, mode.deleteItem);

router.put(
  "/:contactId",
  parseJSON,
  isValidId,
  validateMethod(ValidationSchema),
  mode.putItem,
);

router.patch(
  "/:contactId/favorite",
  parseJSON,
  isValidId,
  validateMethod(PatchSchema),
  mode.patchItem,
);

module.exports = router;
