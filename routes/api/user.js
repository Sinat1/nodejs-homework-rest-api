const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  logout,
  current,
  uploadAvatar,
} = require("../../controllers/user.controller");
const { auth, upload } = require("../../middlewares/index");

const userRouter = express.Router();

userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));

userRouter.patch(
  "/:id/avatars",
  upload.single("avatar"),
  tryCatchWrapper(uploadAvatar)
);

module.exports = { userRouter };
