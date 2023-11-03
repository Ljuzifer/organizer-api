const express = require("express");
const method = require("../../models/contacts");
const HttpError = require("../../helpers");
const validateMethod = require("../../middlewares");
const { ValidationSchema, PatchSchema } = require("../../schemas/Validation");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const answer = await method.listContacts();
    res.json(answer);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const answer = await method.getContactById(contactId);
    res.json(answer);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateMethod(ValidationSchema), async (req, res, next) => {
  try {
    const answer = await method.addContact(req.body);
    return res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const answer = await method.removeContact(contactId);
    if (!answer) {
      throw HttpError(404, "Not found");
    }

    res.json({ message: "Delete success!" });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:contactId",
  validateMethod(ValidationSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const answer = await method.updateContact(contactId, req.body);
      if (!answer) {
        throw HttpError(404, "Not found");
      }

      res.json(answer);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:contactId",
  validateMethod(PatchSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;

      const answer = await method.changeContact(contactId, req.body);
      if (!answer) {
        throw HttpError(404, "Not found");
      }

      res.json(answer);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
