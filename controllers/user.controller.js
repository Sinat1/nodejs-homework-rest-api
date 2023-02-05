const { User } = require("../models/user");
const { httpError } = require("../helpers/index");

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

module.exports = {
  logout,
  current,
};
