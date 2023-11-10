// const method = require("../models/contactsForJSON");
const Contact = require("../models/contact");
const { HttpError, ControllerWrap } = require("../helpers");

async function getAll(_, res, __) {
  const answer = await Contact.find({}, "-createdAt -updatedAt -__v").exec();
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
  const answer = await Contact.create(req.body);
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
  const answer = await Contact.findByIdAndUpdate(contactId, req.body, {
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
