import express from "express";

import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";
import {
  register,
  login,
  logout,
  current,
  subscription,
  uploadAvatar,
} from "../controllers/usersControllers.js";
import verifyToken from "../utils/verifyToken.js";
import userAvatars from "../multer/userAvatars.js";

const usersRouter = express.Router();

usersRouter.post("/register", asyncTryCatchWrapper(register));

usersRouter.post("/login", asyncTryCatchWrapper(login));

usersRouter.post("/logout", verifyToken, asyncTryCatchWrapper(logout));

usersRouter.get("/current", verifyToken, asyncTryCatchWrapper(current));

usersRouter.patch("/", verifyToken, asyncTryCatchWrapper(subscription));

usersRouter.patch(
  "/avatars",
  verifyToken,
  userAvatars.single("avatar"),
  asyncTryCatchWrapper(uploadAvatar)
);

export default usersRouter;
