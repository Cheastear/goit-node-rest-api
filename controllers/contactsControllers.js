import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  listContacts,
  removeContact,
  updateContactFile,
} from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
  listContacts().then((data) => {
    res.status(200).json({
      contacts: data,
    });
  });
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  listContacts().then((data) => {
    const contact = data.find((el) => el.id === id);
    if (contact) {
      res.status(200).json({
        contact: contact,
      });
      return;
    }
    res.status(404).json({ message: "Not found" });
  });
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  removeContact(id).then((data) => {
    if (data != null) {
      res.status(200).json({
        contact: data,
      });
      return;
    }
    res.status(404).json({ message: "Not found" });
  });
};

export const createContact = (req, res) => {
  try {
    const validate = createContactSchema.validate(req.body);
    if (!validate.error) {
      const { name, email, phone } = validate.value;
      addContact(name, email, phone).then((data) =>
        res.status(201).json({ contact: data })
      );
      return;
    }
    throw validate.error;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  if (req.body) {
    try {
      const validate = updateContactSchema.validate(req.body);
      console.log(validate);
      if (!validate.error) {
        const { name, email, phone } = validate.value;
        updateContactFile(id, name, email, phone).then((data) => {
          if (data != null) {
            res.status(200).json({ contact: data });
            return;
          }
          res.status(404).json({ message: "Not found" });
        });
        return;
      }
      throw validate.error;
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  res.status(400).json({ message: "Body must have at least one field" });
};
