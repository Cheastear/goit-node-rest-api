import express from "express";

import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";
import { register, login, logout } from "../controllers/usersControllers.js";
import verifyToken from "../utils/verifyToken.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  async (req, res, next) =>
    await asyncTryCatchWrapper(register, [req, res, next])
);

usersRouter.post(
  "/login",
  async (req, res, next) => await asyncTryCatchWrapper(login, [req, res, next])
);

usersRouter.post(
  "logout",
  verifyToken,
  async () => await asyncTryCatchWrapper(logout, [req, res, next])
);

export default usersRouter;
