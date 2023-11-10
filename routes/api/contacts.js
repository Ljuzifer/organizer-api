const express = require("express");
const mode = require("../../controllers/contactMode");
const { isValidId, validateMethod } = require("../../middlewares");
const { ValidationSchema, PatchSchema } = require("../../schemas/Validation");

const router = express.Router();
const parseJSON = express.json();

router.get("/", parseJSON, mode.getAll);

router.get("/:contactId", isValidId, parseJSON, mode.getById);

router.post("/", validateMethod(ValidationSchema), mode.postItem);

router.delete("/:contactId", isValidId, mode.deleteItem);

router.put(
  "/:contactId",
  isValidId,
  validateMethod(ValidationSchema),
  mode.putItem,
);

router.patch(
  "/:contactId",
  isValidId,
  validateMethod(PatchSchema),
  mode.patchItem,
);

module.exports = router;
