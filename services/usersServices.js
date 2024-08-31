import User from "../schemas/userSchema.js";

export const getById = async ({ id }) => {
  return await User.findOne(id);
};

export const getByEmail = async ({ email }) => {
  return await User.findOne({ email: email });
};

export const addUser = async ({ email, hashedPassword, avatarURL }) => {
  return await User.create({ email, password: hashedPassword, avatarURL });
};

export const addToken = async ({ id, token }) => {
  return await User.findOneAndUpdate({ _id: id }, { token });
};

export const removeToken = async ({ id }) => {
  return await User.findOneAndUpdate({ _id: id }, { token: null });
};

export const subscriptionUpdate = async ({ id, subscription }) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
};
