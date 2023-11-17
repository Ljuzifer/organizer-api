// const method = require("../models/contactsForJSON");
const Contact = require("../models/contact");
const { HttpError, ControllerWrap } = require("../helpers");

async function getAll(req, res, __) {
    const { _id: owner } = req.user;
    const { page = 0, limit = 0, favorite } = req.query;

    const skip = (page - 1) * limit;
    const query = { owner };

    if (favorite !== undefined) {
        query.favorite = favorite;
    }

    const answer = await Contact.find(query, "-createdAt -updatedAt -__v", {
        skip,
        limit,
    })
        .populate("owner", "name email")
        .exec();

    res.json(answer);
}

async function getById(req, res, __) {
    const { contactId } = req.params;
    // const answer = await Contact.findOne({ _id: contactId });
    const answer = await Contact.findById(contactId).exec();

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.json(answer);
}

async function postItem(req, res, __) {
    const { body } = req;
    const { _id: owner } = req.user;
    const data = await Contact.find({ owner }).exec();
    const isNameExist = data.map((i) => i.name).includes(body.name);

    if (isNameExist) {
        throw HttpError(400, "That name is already exist");
    }

    const answer = await Contact.create({ ...body, owner });
    return res.status(201).json(answer);
}

async function deleteItem(req, res, __) {
    const { contactId } = req.params;
    const answer = await Contact.findByIdAndDelete(contactId);

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.json({ message: "Delete success!" });
}

async function putItem(req, res, __) {
    const { contactId } = req.params;
    const { body } = req;
    const answer = await Contact.findByIdAndUpdate(contactId, body, {
        new: true,
    });

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.json(answer);
}

async function patchItem(req, res, __) {
    const { contactId } = req.params;
    const { body } = req;

    const answer = await Contact.findByIdAndUpdate(contactId, body, {
        new: true,
    });

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.json(answer);
}

module.exports = {
    getAll: ControllerWrap(getAll),
    getById: ControllerWrap(getById),
    postItem: ControllerWrap(postItem),
    deleteItem: ControllerWrap(deleteItem),
    putItem: ControllerWrap(putItem),
    patchItem: ControllerWrap(patchItem),
};
