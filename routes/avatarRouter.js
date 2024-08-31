import express from "express";

import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";
import verifyToken from "../utils/verifyToken.js";
import avatar from "../multer/avatar.js";
import { getAvatar, postAvatar } from "../controllers/avatarControllers.js";

const avatarRouter = express.Router();

avatarRouter.post(
  "/upload",
  verifyToken,
  avatar.single("avatar"),
  asyncTryCatchWrapper(postAvatar)
);

avatarRouter.get(
  "/avatars/:fileName",
  verifyToken,
  asyncTryCatchWrapper(getAvatar)
);

export default avatarRouter;
