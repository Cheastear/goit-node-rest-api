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
import ApiError from "../utils/ApiError.js";

export const getAllContacts = async (req, res) => {
  res.status(200).json({
    contacts: await listContacts(),
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    throw new ApiError(404, "Not found");
  }
  res.status(200).json({
    contact: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  if (!contact) {
    throw new ApiError(404, "Not found");
  }
  res.status(200).json({
    contact: contact,
  });
};

export const createContact = async (req, res) => {
  const validate = createContactSchema.validate(req.body);
  if (validate.error) {
    throw new ApiError(400, validate.error.message);
  }
  const { name, email, phone, favorite } = validate.value;
  const newContact = await addContact({ name, email, phone, favorite });
  res.status(201).json({ contact: newContact });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const validate = updateContactSchema.validate(req.body);
  if (validate.error) {
    throw new ApiError(400, validate.error.message);
  }
  const { name, email, phone, favorite } = validate.value;
  const contact = await updateContactFile({
    id,
    name,
    email,
    phone,
    favorite,
  });
  if (!contact) {
    throw new ApiError(404, "Not found");
  }
  res.status(200).json({ contact: contact });
};

export const favoriteContact = async (req, res) => {
  const { id } = req.params;
  if (req.body.favorite === undefined) {
    throw new ApiError(400, "Not found: favorite, in body");
  }
  await updateStatusContact(id, req.body);
  res.status(200).send();
};
