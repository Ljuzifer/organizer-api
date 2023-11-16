const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpError, ControllerWrap } = require("../helpers");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// signup //
async function registration(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
        throw HttpError(409, "This email is exist already");
    }

    const salt = bcrypt.genSaltSync(13);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const answer = await User.create({ ...req.body, password: hashedPassword });

    res.status(201).json({
        user: {
            // name: answer.name,
            email: answer.email,
            subscription: answer.subscription,
        },
    });
}

// signin //
async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password are incorrect");
    }

    const userPassword = bcrypt.compareSync(password, user.password);
    if (!userPassword) {
        throw HttpError(401, "Email or password are incorrect");
    }

    const payload = {
        id: user._id,
        name: user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1w" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: { email: user.email, subscription: user.subscription },
    });
}

async function logout(req, res) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).json({
        message: "Logout successfull",
    });
}

async function current(req, res) {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
}

async function subscription(req, res) {
    const { _id } = req.user;
    const { body } = req;

    const answer = await User.findByIdAndUpdate(_id, body, { new: true });
    if (!answer) {
        throw HttpError(404);
    }

    res.json(answer);
}

module.exports = {
    registration: ControllerWrap(registration),
    login: ControllerWrap(login),
    logout: ControllerWrap(logout),
    current: ControllerWrap(current),
    subscription: ControllerWrap(subscription),
};
