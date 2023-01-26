const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  const list = await fs.readFile(contactsPath, (err, data) => {
    if (err) return console.error(err.message);
    return data;
  });
  return JSON.parse(list);
}

async function getContactById(contactId) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    return contacts.find((contact) => contactId.toString() === contact.id);
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    const newContact = { id: (data.length + 1).toString(), name, email, phone };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data), "utf8");
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    const newData = data.filter(
      (contact) => contactId.toString() !== contact.id
    );
    await fs.writeFile(contactsPath, JSON.stringify(newData), "utf8");
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

async function updContact(contactId, body) {
  const contactsList = await listContacts();
  const { name, email, phone } = body;

  contactsList.forEach((contact) => {
    if (contact.id === contactId) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
    }
  });
  await fs.writeFile(contactsPath, JSON.stringify(contactsList), "utf8");
  return await getContactById(contactId);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact,
};
