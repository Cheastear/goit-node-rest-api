import path from "path";

import { avatarPath } from "../multer/avatar.js";
import { isExist, removeFile, rename } from "../services/avatarSchemas.js";
import ApiError from "../utils/ApiError.js";

export const postAvatar = async (req, res) => {
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(avatarPath, originalname);

  if (fileName != temporaryName) {
    await rename(temporaryName, fileName);
    await removeFile(temporaryName);
  }
  res.status(200).json({ message: "File created" });
};

export const getAvatar = async (req, res) => {
  const { fileName } = req.params;

  const filePath = path.join(avatarPath, fileName);

  if (!(await isExist(filePath))) throw new ApiError(404, "File not found");

  res.download(filePath);
};
