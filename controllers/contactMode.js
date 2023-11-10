const method = require("../models/contacts");
const Contact = require("../models/contact");
const { HttpError, ControllerWrap } = require("../helpers");

async function getAll(req, res, next) {
  const answer = await Contact.find({}, "-createdAt -updatedAt -__v").exec();
  res.json(answer);
}

async function getById(req, res, next) {
  const { contactId } = req.params;
  // const answer = await Contact.findOne({ _id: contactId });
  const answer = await Contact.findById(contactId).exec();

  if (!answer) {
    throw HttpError(404, "Not found");
  }

  res.json(answer);
}

async function postItem(req, res, next) {
  const answer = await Contact.create(req.body);
  return res.status(201).json(answer);
}

async function deleteItem(req, res, next) {
  const { contactId } = req.params;
  const answer = await method.removeContact(contactId);

  if (!answer) {
    throw HttpError(404, "Not found");
  }

  res.json({ message: "Delete success!" });
}

async function putItem(req, res, next) {
  const { contactId } = req.params;
  const answer = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  console.log(answer);

  if (!answer) {
    throw HttpError(404, "Not found");
  }

  res.json(answer);
}

async function patchItem(req, res, next) {
  const { contactId } = req.params;
  const answer = await method.changeContact(contactId, req.body);

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
