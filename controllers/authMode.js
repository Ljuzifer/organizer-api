const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const { HttpError, ControllerWrap, EmailSender } = require("../helpers");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const avatarPath = path.join(__dirname, "../", "public", "avatars");

// signup //
async function registration(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
        throw HttpError(409, "This email is exist already");
    }

    const salt = bcrypt.genSaltSync(13);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();

    const answer = await User.create({
        ...req.body,
        password: hashedPassword,
        avatarURL,
        verificationToken,
    });

    await EmailSender(email, verificationToken);

    res.status(201).json({
        user: {
            // name: answer.name,
            email: answer.email,
            subscription: answer.subscription,
        },
    });
}

async function confirmEmail(req, res) {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404, "User not found or email was confirmed already");
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: "",
    });

    res.json({ message: "Email was confirm successfull!" });
}

async function resendConfirmEmail(req, res) {
    console.log(req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, "User not found...");
    }

    if (user.verify) {
        throw HttpError(400, "This email is verified already!");
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: "",
    });

    await EmailSender(email, user.verificationToken);

    res.json({ message: "Email was confirmed successfull!" });
}

// signin //
async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password are incorrect");
    }

    if (!user.verify) {
        throw HttpError(401, "Sorry, your email is not verified...");
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

async function updAvatar(req, res) {
    if (!req.file) {
        throw HttpError(400, "Avatar must be provided");
    }

    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const ava = await Jimp.read(tempUpload);
    ava.resize(250, 250).quality(60).write(path.join(tempUpload));

    const filename = `${_id}_${originalname}`;
    const resUpload = path.join(avatarPath, filename);

    await fs.rename(tempUpload, resUpload);

    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
}

const removeUser = async (req, res) => {
    const removedUser = await User.findOneAndDelete({ email: req.query.email });
    if (!removedUser) {
        throw HttpError(404);
    }

    res.json({ message: "User credentials removed successfull!" });
};

module.exports = {
    registration: ControllerWrap(registration),
    confirmEmail: ControllerWrap(confirmEmail),
    resendConfirmEmail: ControllerWrap(resendConfirmEmail),
    login: ControllerWrap(login),
    logout: ControllerWrap(logout),
    current: ControllerWrap(current),
    subscription: ControllerWrap(subscription),
    updAvatar: ControllerWrap(updAvatar),
    removeUser: ControllerWrap(removeUser),
};
