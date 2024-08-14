import jwt from "jsonwebtoken";

import { userValidateSchema } from "../schemas/userValidateSchema.js";
import {
  addToken,
  addUser,
  getByEmail,
  getById,
  removeToken,
} from "../services/usersServices.js";
import ApiError from "../utils/ApiError.js";
import { passwordHash, passwordVerify } from "../utils/passwordHashVerify.js";

export const register = async (req, res) => {
  const validate = userValidateSchema.validate(req.body);

  if (validate.error) throw new ApiError(400, validate.error.message);

  const { password, email } = req.body;

  const existedUser = await getByEmail({ email });

  if (existedUser != null) throw new ApiError(409, "Email is use");

  const newUser = await addUser({
    email,
    hashedPassword: await passwordHash(password),
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
  const validate = userValidateSchema.validate(req.body);

  if (validate.error) throw new ApiError(400, validate.error.message);

  const { email, password } = req.body;

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
  const user = removeToken({ id: req.user._id });

  if (!user) throw new ApiError(401, { message: "Unauthorized" });

  res.status(204).send();
};
