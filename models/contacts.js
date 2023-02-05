// const fs = require('fs/promises')
const mongoose = require("mongoose");

//Schema
const schema = mongoose.Schema(
  {
    name: {
      type: String, //mongoose.Types.String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//Model (Class)
const Contact = mongoose.model("contacts", schema);

module.exports = {
  Contact,
};
