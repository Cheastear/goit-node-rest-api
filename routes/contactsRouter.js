import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  favoriteContact,
} from "../controllers/contactsControllers.js";
import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  async (req, res, next) =>
    await asyncTryCatchWrapper(getAllContacts, [req, res, next])
);

contactsRouter.get(
  "/:id",
  async (req, res, next) =>
    await asyncTryCatchWrapper(getOneContact, [req, res, next])
);

contactsRouter.delete(
  "/:id",
  async (req, res, next) =>
    await asyncTryCatchWrapper(deleteContact, [req, res, next])
);

contactsRouter.post(
  "/",
  async (req, res, next) =>
    await asyncTryCatchWrapper(createContact, [req, res, next])
);

contactsRouter.put(
  "/:id",
  async (req, res, next) =>
    await asyncTryCatchWrapper(updateContact, [req, res, next])
);

contactsRouter.patch(
  "/:id/favorite",
  async (req, res, next) =>
    await asyncTryCatchWrapper(favoriteContact, [req, res, next])
);

export default contactsRouter;
