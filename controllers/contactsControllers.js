import { query } from "express";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsValidateSchemas.js";
import {
  addContact,
  getContactById,
  getCountDocuments,
  listContacts,
  removeContact,
  updateContactFile,
  updateStatusContact,
} from "../services/contactsServices.js";
import ApiError from "../utils/ApiError.js";

export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = {
    owner: req.user._id,
  };
  if (favorite) {
    query.favorite = favorite === "true";
  }

  res.status(200).json({
    page: parseInt(page),
    limit: parseInt(limit),
    totalCount: await getCountDocuments(),
    contacts: await listContacts(query, {
      skip: parseInt(skip),
      limit: parseInt(limit),
    }),
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById({
    id,
    owner: req.user._id,
  });

  if (!contact) throw new ApiError(404, "Not found");

  res.status(200).json({
    contact: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact({
    id,
    owner: req.user._id,
  });

  if (!contact) throw new ApiError(404, "Not found");

  res.status(200).json({
    contact: contact,
  });
};

export const createContact = async (req, res) => {
  const validate = createContactSchema.validate(req.body);

  if (validate.error) throw new ApiError(400, validate.error.message);

  const { name, email, phone, favorite } = validate.value;
  const newContact = await addContact({
    name,
    email,
    phone,
    favorite,
    owner: req.user._id,
  });
  res.status(201).json({ contact: newContact });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const validate = updateContactSchema.validate(req.body);

  if (validate.error) throw new ApiError(400, validate.error.message);

  const { name, email, phone, favorite } = validate.value;
  const contact = await updateContactFile({
    id,
    owner: req.user._id,
    name,
    email,
    phone,
    favorite,
  });

  if (!contact) throw new ApiError(404, "Not found");

  res.status(200).json({ contact: contact });
};

export const favoriteContact = async (req, res) => {
  const { id } = req.params;

  if (req.body.favorite === undefined)
    throw new ApiError(400, "Not found: favorite, in body");

  await updateStatusContact({ id, owner: req.user._id }, req.body);
  res.status(200).send();
};
