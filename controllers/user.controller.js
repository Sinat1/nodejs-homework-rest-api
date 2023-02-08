const { User } = require("../models/user");
const { httpError } = require("../helpers/index");
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

module.exports = {
  logout,
  current,
  uploadAvatar,
};
