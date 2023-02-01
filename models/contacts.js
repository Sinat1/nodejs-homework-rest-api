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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//Model (Class)
const Contact = mongoose.model("contacts", schema);

const listContacts = async () => {};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  Contact,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
