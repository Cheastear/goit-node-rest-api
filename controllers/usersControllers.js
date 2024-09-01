import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";

import { userValidator } from "../schemas/userValidateSchema.js";
import {
  addToken,
  addUser,
  getByEmail,
  getById,
  removeToken,
  subscriptionUpdate,
} from "../services/usersServices.js";
import ApiError from "../utils/ApiError.js";
import { passwordHash, passwordVerify } from "../utils/passwordHashVerify.js";
import { avatarPathTo } from "../multer/avatar.js";
import { rename } from "../services/avatarServices.js";

export const register = async (req, res) => {
  const { password, email } = req.body;

  await userValidator(req.body);

  const existedUser = await getByEmail({ email });

  if (existedUser != null) throw new ApiError(409, "Email is use");

  const avatarFileName = `${await gravatar
    .url(email)
    .replace("//www.gravatar.com/avatar/", "")}${".jpeg"}`;

  const newUser = await addUser({
    email,
    hashedPassword: await passwordHash(password),
    avatarURL: avatarFileName,
  });

  if (newUser === null) throw new ApiError(500, "Database error");

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.SECRET,
    {
      expiresIn: "1h",
    }
  );

  await addToken({ id: newUser._id, token });

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  await userValidator(req.body);

  const user = await getByEmail({ email });

  if (user === null) throw new ApiError(401, "Email or password is wrong");

  if (!(await passwordVerify(password, user.password)))
    throw new ApiError(401, "Email or password is wrong");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET,
    {
      expiresIn: "1h",
    }
  );

  await addToken({ id: user._id, token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export const logout = async (req, res) => {
  const user = await removeToken({ id: req.user._id });

  if (!user) throw new ApiError(401, "Unauthorized");

  res.status(204).send();
};

export const current = async (req, res) => {
  const user = await getById({ id: req.user._id });

  if (!user) throw new ApiError(401, "Unauthorized");

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const subscription = async (req, res) => {
  const { subscription } = req.body;

  const allowedSubscriptions = ["starter", "pro", "business"];
  if (!allowedSubscriptions.includes(subscription))
    throw new ApiError(400, "Invalid subscription value");

  const user = await subscriptionUpdate({ id: req.user._id, subscription });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const uploadAvatar = async (req, res) => {
  const { path: temporaryName } = req.file;

  const user = await getById({ id: req.user._id });

  if (!user) throw new ApiError(404, "User not found");

  const fileName = path.join(avatarPathTo, user.avatarURL);

  rename(temporaryName, fileName);

  res.status(200).json({ avatarURL: path.join("/avatars/", user.avatarURL) });
};
