import fs from "fs/promises";
import path from "path";

const isAccessible = async (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  try {
    if (!(await isAccessible(folder))) {
      await fs.mkdir(folder);
    }
  } catch (err) {
    await createFolderIsNotExist(path.join(folder, ".."));
    await fs.mkdir(folder);
  }
};
export default createFolderIsNotExist;
