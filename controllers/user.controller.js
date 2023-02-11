const { User } = require("../models/user");
const { httpError, sendVerificationEmail } = require("../helpers/index");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

async function logout(req, res, next) {
  const user = req.user;
  const loggedUser = await User.findById(user._id);

  if (!loggedUser) {
    throw httpError(401, "Not authorized");
  }

  loggedUser.token = null;

  res.status(204).json();
}

async function current(req, res, next) {
  const { user } = req;
  const { email, _id: id, subscription } = user;
  return res.status(200).json({
    data: {
      user: {
        email,
        id,
        subscription,
      },
    },
  });
}

async function uploadAvatar(req, res, next) {
  // console.log("req.file: ", req.file);

  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const avatarsPath = path.resolve(__dirname, "../public/avatars", filename);

  try {
    const image = await Jimp.read(tmpPath);
    image.cover(250, 250).quality(60).write(avatarsPath);

    // await fs.rename(tmpPath, avatarsPath);
  } catch (error) {
    await fs.unlink(tmpPath);
  }

  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    throw httpError(401, "Not authorized");
  }

  user.avatarURL = `/public/avatars/${filename}`;

  await user.save();

  return res.json({
    data: {
      avatarURL: user.avatarURL,
    },
  });
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw httpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({ message: "Verification successful" });
}

async function repeatVerification(req, res, next) {
  const { email } = req.body;
  const { verificationToken } = req;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw httpError(400, "Missing required field email");
  }

  const userWithToken = await User.findByIdAndUpdate(user, verificationToken);

  if (!userWithToken.verificationToken) {
    throw httpError(400, "Verification has already been passed");
  }

  await sendVerificationEmail({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="localhost:3000/api/users/verify/${userWithToken.verificationToken}">Confirm your email</a>`,
  });

  res.status(200).json({
    message: "Verification email sent",
  });
}

module.exports = {
  logout,
  current,
  uploadAvatar,
  verifyEmail,
  repeatVerification,
};
