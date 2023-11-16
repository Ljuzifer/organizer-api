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
    name: answer.name,
    email: answer.email,
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

  res.json({ token });
}

async function logout(req, res) {}

module.exports = {
  registration: ControllerWrap(registration),
  login: ControllerWrap(login),
  logout: ControllerWrap(logout),
};
