const Contact = require("../models/contact");
const Task = require("../models/task");
const { HttpError } = require("../helpers");

const ownerChecker = async (req, res, next) => {
    try {
        const { contactId, taskId } = req.params;
        const { _id } = req.user;
        if (contactId) {
            const answer = await Contact.findById(contactId).exec();

            if (answer.owner.toString() !== _id.toString()) {
                throw HttpError(404);
            }
        } else if (taskId) {
            const answer = await Task.findById(taskId).exec();

            if (answer.owner.toString() !== _id.toString()) {
                throw HttpError(404);
            }
        }

        next();
    } catch {
        next(HttpError(404));
    }
};

module.exports = ownerChecker;
