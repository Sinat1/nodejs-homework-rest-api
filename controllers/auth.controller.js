const { User } = require("../models/user");
const { httpError } = require("../helpers/index");
const { Conflict } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signup(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      data: {
        user: {
          email,
          id: savedUser._id,
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      //   throw new httpError(409, "User with current email already exists");
      throw Conflict("User with current email already exists");
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new httpError(401, "Email or password is wrong");
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new httpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    data: {
      token,
      user: {
        email,
        id: storedUser._id,
        subscription: "starter",
      },
    },
  });
}

module.exports = {
  signup,
  login,
};
