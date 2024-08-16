const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
    const { contactId, taskId } = req.params;

    if (contactId && !isValidObjectId(contactId)) {
        next(HttpError(404, `${contactId} is no valid contact ID!`));
    }

    if (taskId && !isValidObjectId(taskId)) {
        return next(HttpError(404, `${taskId} is not a valid task ID!`));
    }
    next();
};

module.exports = isValidId;
