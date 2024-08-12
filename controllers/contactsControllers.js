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

export const getAllContacts = async (req, res, next) => {
  try {
    res.status(200).json({
      contacts: await listContacts(),
    });
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (!contact) {
      throw new ApiError(404, "Not found");
    }
    res.status(200).json({
      contact: contact,
    });
  } catch (err) {
    if (err.kind) next(new ApiError(404, "Not found"));
    else next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await removeContact(id);
    if (!contact) {
      throw new ApiError(404, "Not found");
    }
    res.status(200).json({
      contact: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const validate = createContactSchema.validate(req.body);
    if (validate.error) {
      throw validate.error;
    }
    const { name, email, phone, favorite } = validate.value;
    const newContact = await addContact({ name, email, phone, favorite });
    res.status(201).json({ contact: newContact });
  } catch (err) {
    if (err.statusCode === 400) res.status(400).json({ message: err.message });
    else next(err);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const validate = updateContactSchema.validate(req.body);
    if (validate.error) {
      throw validate.error;
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
  } catch (err) {
    if (err.statusCode == 400) res.status(400).json({ message: err.message });
    else next(err);
  }
};

export const favoriteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.body.favorite === undefined) {
      throw new ApiError(400, "Not found: favorite, in body");
    }
    await updateStatusContact(id, req.body);
    res.status(200).send();
  } catch (err) {
    if (err.statusCode === 400) res.status(400).json({ message: err.message });
    else next(err);
  }
};
