import express from "express";

import asyncTryCatchWrapper from "../utils/tryCatchWrapper.js";
import {
  register,
  login,
  logout,
  current,
  subscription,
} from "../controllers/usersControllers.js";
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
  "/logout",
  verifyToken,
  async (req, res, next) => await asyncTryCatchWrapper(logout, [req, res, next])
);

usersRouter.get(
  "/current",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(current, [req, res, next])
);

usersRouter.patch(
  "/",
  verifyToken,
  async (req, res, next) =>
    await asyncTryCatchWrapper(subscription, [req, res, next])
);

export default usersRouter;
