import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import { v4 } from "uuid";
import sg from "@sendgrid/mail";

import { userValidator } from "../schemas/userValidateSchema.js";
import {
  addToken,
  addUser,
  getByEmail,
  getById,
  getByVerifyToken,
  removeToken,
  setVeryfyToken,
  subscriptionUpdate,
} from "../services/usersServices.js";
import ApiError from "../utils/ApiError.js";
import { passwordHash, passwordVerify } from "../utils/passwordHashVerify.js";
import { avatarPathTo } from "../multer/avatar.js";
import { rename } from "../services/avatarServices.js";

sg.setApiKey(process.env.API_SENDGRID_KEY);

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
    verificationToken: v4(),
  });

  if (newUser === null) throw new ApiError(500, "Database error");

  const msg = {
    to: newUser.email,
    from: process.env.API_EMAIL,
    subject: "Verifing email",
    text: `Veryfy code: ${newUser.verificationToken}`,
  };

  sg.send(msg)
    .then(() => console.log("Veryfication token is send"))
    .catch((err) => console.error(err));

  res.status(201).json({ message: "Register succesfull" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  await userValidator(req.body);

  const user = await getByEmail({ email });

  if (!user.verify) throw new ApiError(400, "Email is not verificated");

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

export const verificationRequest = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await getByVerifyToken({ verificationToken });
  if (!user) throw new ApiError(404, "User not found");

  const verifyUser = await setVeryfyToken({
    id: user.id,
    verify: true,
    verificationToken: null,
  });
  if (!verifyUser) throw new ApiError(500, "Server error");

  res.status(200).json({ message: "Verification successful" });
};

export const sendVerify = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Missing required field email");

  const user = await getByEmail({ email });

  if (!user) throw new ApiError(404, "User not found");

  if (user.verify)
    throw new ApiError(400, "Verification has already been passed");

  const msg = {
    to: user.email,
    from: process.env.API_EMAIL,
    subject: "Verifing email",
    text: `Veryfy code: ${user.verificationToken}`,
  };

  sg.send(msg)
    .then(() => console.log("Veryfication token is send"))
    .catch((err) => console.error(err));

  await setVeryfyToken({ email, verify: false, verificationToken: v4() });

  res.status(200).json({ message: "Verification email send" });
};
