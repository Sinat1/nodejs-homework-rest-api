const { User } = require("../models/user");
const { httpError, sendVerificationEmail } = require("../helpers/index");
const { Conflict } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

async function signup(req, res, next) {
  const { email, password } = req.body;

  try {
    const verificationToken = v4();

    const savedUser = await User.create({
      email,
      password,
      verificationToken,
    });

    await sendVerificationEmail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
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

  if (!storedUser.verify) {
    throw new httpError(
      401,
      "Email is not verified. Please check your mail box."
    );
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
