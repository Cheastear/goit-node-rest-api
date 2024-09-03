import path from "path";

import { avatarPathTo } from "../multer/avatar.js";
import { isExist, removeFile, rename } from "../services/avatarServices.js";
import ApiError from "../utils/ApiError.js";
import { getById } from "../services/usersServices.js";

export const postAvatar = async (req, res) => {
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(avatarPathTo, originalname);

  if (fileName != temporaryName) {
    await rename(temporaryName, fileName);
    await removeFile(temporaryName);
  }
  res.status(200).json({ message: "File created" });
};

export const getAvatar = async (req, res) => {
  const { fileName } = req.params;

  const filePath = path.join(avatarPathTo, fileName);

  if (!(await isExist(filePath))) throw new ApiError(404, "File not found");

  const user = await getById({ id: req.user._id });

  if (fileName !== user.avatarURL) throw new ApiError(404, "User incorrect");

  res.download(filePath);
};
