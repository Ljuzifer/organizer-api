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

router.get("/", parseJSON, authentication, mode.getAll);

router.get("/:contactId", parseJSON, authentication, isValidId, mode.getById);

router.post(
    "/",
    parseJSON,
    authentication,
    validateMethod(ValidationSchema),
    mode.postItem,
);

router.delete("/:contactId", authentication, isValidId, mode.deleteItem);

router.put(
    "/:contactId",
    parseJSON,
    authentication,
    isValidId,
    validateMethod(ValidationSchema),
    mode.putItem,
);

router.patch(
    "/:contactId/favorite",
    parseJSON,
    authentication,
    isValidId,
    validateMethod(PatchSchema),
    mode.patchItem,
);

module.exports = router;
