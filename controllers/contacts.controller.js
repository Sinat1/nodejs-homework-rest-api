const db = require("../db/db");
const { httpError } = require("../helpers/index");
const Joi = require("joi");

//GET ALL CONTACTS
async function getContacts(req, res, next) {
  const contactsList = await db.listContacts();
  res.status(200).json(contactsList);
}

//GET CONTACT BY ID
async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(httpError(404, "Not found"));
  }
  return res.status(200).json(contact);

  // return res.status(404).json({ message: "Not found" }); --> easy way
}

//CREATE CONTACT
async function createContact(req, res, next) {
  const { name, email, phone } = req.body;

  const newContact = await db.addContact(name, email, phone);
  res.status(201).json(newContact);
}

//DELETE CONTACT
async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(httpError(404, "Not found"));
  }
  await db.removeContact(contactId);
  return res.status(200).json({ message: "Contact deleted", contact });
}

//UPDATE CONTACT
async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contacts = await db.listContacts();
    if (!contacts.find((contact) => contact.id === contactId)) {
      return next(httpError(404, "Not found"));
    }

    const contact = await db.updContact(contactId, req.body);
    return res.status(200).json({ contact });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
