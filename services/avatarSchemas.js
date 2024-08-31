import fs from "fs/promises";
import ApiError from "../utils/ApiError.js";
import Jimp from "jimp";

export const rename = (oldPath, newPath) => {
  return Jimp.read(oldPath, (err, file) => {
    if (err) throw new ApiError(500, err);
    file.resize(256, 256).quality(60).write(newPath);
  });
};

export const removeFile = async (path) => {
  return await fs.unlink(path, () => {
    throw new ApiError(500, "Server Error");
  });
};

export const isExist = async (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};
