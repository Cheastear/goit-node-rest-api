import User from "../schemas/userSchema.js";

export const getById = async ({ id }) => {
  return await User.findOne(id);
};

export const getByEmail = async ({ email }) => {
  return await User.findOne({ email: email });
};

export const addUser = async ({ email, hashedPassword }) => {
  return await User.create({ email, password: hashedPassword });
};
