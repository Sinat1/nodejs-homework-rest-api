// const e = require("express");
const express = require("express");
const db = require("../../db/db");
const { httpError, tryCatchWrapper } = require("../../helpers/index");
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares/index");
const { addContactSchema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContactById));
router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);
router.delete("/:contactId", tryCatchWrapper(deleteContact));
router.put(
  "/:contactId",
  validateBody(addContactSchema),
  tryCatchWrapper(updateContact)
);

module.exports = router;
