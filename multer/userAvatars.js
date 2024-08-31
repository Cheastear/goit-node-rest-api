import multer from "multer";
import path from "path";

import { getById } from "../services/usersServices.js";

export const avatarPathFrom = path.join(process.cwd(), "/tmp");
export const avatarPathTo = path.join(process.cwd(), "/public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarPathFrom);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const userAvatars = multer({ storage: storage });

export default userAvatars;
