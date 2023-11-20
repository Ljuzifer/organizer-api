const validateMethod = require("./validateMethod");
const isValidId = require("./isValidId");
const authentication = require("./authentication");
const ownerChecker = require("./ownerChecker");
const upload = require("./upload");

module.exports = {
    validateMethod,
    isValidId,
    authentication,
    ownerChecker,
    upload,
};
