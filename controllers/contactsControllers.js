import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactFile,
  updateStatusContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  res.status(200).json({
    contacts: await listContacts(),
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (contact) {
    res.status(200).json({
      contact: contact,
    });
    return;
  }
  res.status(404).json({ message: "Not found" });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  if (contact != null) {
    res.status(200).json({
      contact: contact,
    });
    return;
  }
  res.status(404).json({ message: "Not found" });
};

export const createContact = async (req, res) => {
  try {
    const validate = createContactSchema.validate(req.body);
    if (!validate.error) {
      const { name, email, phone, favorite } = validate.value;
      const newContact = await addContact({ name, email, phone, favorite });
      console.log(newContact);
      res.status(201).json({ contact: newContact });
      return;
    }
    throw validate.error;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  try {
    const validate = updateContactSchema.validate(req.body);
    if (!validate.error) {
      const { name, email, phone, favorite } = validate.value;
      const contact = await updateContactFile({
        id,
        name,
        email,
        phone,
        favorite,
      });
      if (contact != null) {
        res.status(200).json({ contact: contact });
        return;
      }
      res.status(404).json({ message: "Not found" });
      return;
    }
    throw validate.error;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const favoriteContact = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.favorite === undefined) {
      throw { message: "Not found: favorite, in body" };
    }
    await updateStatusContact(id, req.body);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
