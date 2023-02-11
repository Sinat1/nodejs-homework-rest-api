const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

const secureUrl = gravatar.url(
  "emerleite@gmail.com",
  { s: "100", r: "x", d: "retro" },
  true
);

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/[a-z0-9]+@[a-z0-9]+/, "User email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters long"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: secureUrl,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.pre("save", async function () {
  // console.log("pre save");
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
});

const User = mongoose.model("user", schema);

module.exports = {
  User,
};
