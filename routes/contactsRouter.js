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

contactsRouter.get("/", verifyToken, asyncTryCatchWrapper(getAllContacts));

contactsRouter.get("/:id", verifyToken, asyncTryCatchWrapper(getOneContact));

contactsRouter.delete("/:id", verifyToken, asyncTryCatchWrapper(deleteContact));

contactsRouter.post("/", verifyToken, asyncTryCatchWrapper(createContact));

contactsRouter.put("/:id", verifyToken, asyncTryCatchWrapper(updateContact));

contactsRouter.patch(
  "/:id/favorite",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(favoriteContact, [req, res, next])
);

export default contactsRouter;
