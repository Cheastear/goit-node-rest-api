import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
  return await bcrypt.hash(password, await bcrypt.genSalt(10));
};

export const passwordVerify = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};
