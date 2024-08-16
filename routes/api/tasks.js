const express = require("express");
const mode = require("../../controllers/tasksMode");
const {
    isValidId,
    validateMethod,
    authentication,
    ownerChecker,
} = require("../../middlewares");
const { CompletedSchema, TaskSchema } = require("../../schemas/Validation");

const router = express.Router();
const parseJSON = express.json();

router.get("/", parseJSON, authentication, mode.getAll);

router.post(
    "/",
    parseJSON,
    authentication,
    validateMethod(TaskSchema),
    mode.postTask
);

router.delete(
    "/:taskId",
    authentication,
    isValidId,
    ownerChecker,
    mode.deleteTask
);

router.patch(
    "/:taskId/completed",
    parseJSON,
    authentication,
    isValidId,
    ownerChecker,
    validateMethod(CompletedSchema),
    mode.patchTask
);

module.exports = router;
