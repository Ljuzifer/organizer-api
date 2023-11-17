const Contact = require("../models/contact");
const { HttpError } = require("../helpers");

const ownerChecker = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { _id } = req.user;
        const answer = await Contact.findById(contactId).exec();

        if (answer.owner.toString() !== _id.toString()) {
            throw HttpError(404);
        }

        next();
    } catch {
        next(HttpError(404));
    }
};

module.exports = ownerChecker;
