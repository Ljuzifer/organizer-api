const express = require("express");
const mode = require("../../controllers/contactMode");
const {
    isValidId,
    validateMethod,
    authentication,
    ownerChecker,
} = require("../../middlewares");
const { ValidationSchema, PatchSchema } = require("../../schemas/Validation");

const router = express.Router();
const parseJSON = express.json();

router.get("/", parseJSON, authentication, mode.getAll);

router.get(
    "/:contactId",
    parseJSON,
    authentication,
    isValidId,
    ownerChecker,
    mode.getById,
);

router.post(
    "/",
    parseJSON,
    authentication,
    validateMethod(ValidationSchema),
    mode.postItem,
);

router.delete(
    "/:contactId",
    authentication,
    isValidId,
    ownerChecker,
    mode.deleteItem,
);

router.put(
    "/:contactId",
    parseJSON,
    authentication,
    isValidId,
    ownerChecker,
    validateMethod(ValidationSchema),
    mode.putItem,
);

router.patch(
    "/:contactId/favorite",
    parseJSON,
    authentication,
    isValidId,
    ownerChecker,
    validateMethod(PatchSchema),
    mode.patchItem,
);

module.exports = router;
