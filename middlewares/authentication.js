const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpError } = require("../helpers");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authentication = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const tokenArr = authorization.split(" ");
    const [bearer, token] = tokenArr;

    if (bearer !== "Bearer") {
        next(HttpError(401));
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET_KEY);
        const isUser = await User.findById(id);

        if (!isUser) {
            next(HttpError(401));
        }

        next();
    } catch {
        next(HttpError(401));
    }
};

module.exports = authentication;
