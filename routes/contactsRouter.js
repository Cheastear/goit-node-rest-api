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
import verifyToken from "../utils/verifyToken.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(getAllContacts, [req, res, next])
);

contactsRouter.get(
  "/:id",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(getOneContact, [req, res, next])
);

contactsRouter.delete(
  "/:id",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(deleteContact, [req, res, next])
);

contactsRouter.post(
  "/",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(createContact, [req, res, next])
);

contactsRouter.put(
  "/:id",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(updateContact, [req, res, next])
);

contactsRouter.patch(
  "/:id/favorite",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(favoriteContact, [req, res, next])
);

export default contactsRouter;
