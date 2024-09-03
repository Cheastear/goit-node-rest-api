import express from "express";

import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";
import {
  register,
  login,
  logout,
  current,
  subscription,
  uploadAvatar,
  verificationRequest,
  sendVerify,
} from "../controllers/usersControllers.js";
import verifyToken from "../utils/verifyToken.js";
import avatar from "../multer/avatar.js";

const usersRouter = express.Router();

usersRouter.post("/register", asyncTryCatchWrapper(register));

usersRouter.post("/login", asyncTryCatchWrapper(login));

usersRouter.post("/logout", verifyToken, asyncTryCatchWrapper(logout));

usersRouter.get("/current", verifyToken, asyncTryCatchWrapper(current));

usersRouter.patch("/", verifyToken, asyncTryCatchWrapper(subscription));

usersRouter.patch(
  "/avatars",
  verifyToken,
  avatar.single("avatar"),
  asyncTryCatchWrapper(uploadAvatar)
);

usersRouter.get(
  "/verify/:verificationToken",
  asyncTryCatchWrapper(verificationRequest)
);
usersRouter.post("/verify", asyncTryCatchWrapper(sendVerify));

export default usersRouter;
