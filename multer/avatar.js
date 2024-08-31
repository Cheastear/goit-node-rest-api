import multer from "multer";
import path from "path";

export const avatarPath = path.join(process.cwd(), "/public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const avatar = multer({ storage: storage });

export default avatar;
