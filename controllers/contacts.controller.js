const { httpError } = require("../helpers/index");
const { Contact } = require("../models/contacts");

//GET ALL CONTACTS
async function getContacts(req, res, next) {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const contactsList = await Contact.find({}).skip(skip).limit(limit);
  res.status(200).json(contactsList);
}

//GET CONTACT BY ID
async function getContactById(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);

    return res.status(200).json(contact);
  } catch (error) {
    return next(httpError(404, "Not found"));
  }

  // return res.status(404).json({ message: "Not found" }); --> easy way
}

//CREATE CONTACT
async function createContact(req, res, next) {
  const { name, email, phone, favorite } = req.body;

  const newContact = await Contact.create({ name, email, phone, favorite });
  res.status(201).json(newContact);
}

//DELETE CONTACT
async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(httpError(404, "Not found"));
  }
  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "Contact deleted", contact });
}

//UPDATE CONTACT
async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contacts = await Contact.find({});
    if (!contacts.find((contact) => contact.id === contactId)) {
      return next(httpError(404, "Not found"));
    }

    const contact = await Contact.findByIdAndUpdate(contactId, req.body);
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
