import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { avatarPathFrom, avatarPathTo } from "./multer/avatar.js";
import createFolderIsNotExist from "./utils/createFolderIsNotExist.js";
import "./utils/Strategy.js";
import avatarRouter from "./routes/avatarRouter.js";

const app = express();

app.use(passport.initialize());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(express.static(process.cwd()));

app.use("/", avatarRouter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status, message = "Server error" } = err;
  res.status(status ? status : 500).json({ message });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);
connection
  .then(() => {
    console.log("Database connection successful");
    createFolderIsNotExist(avatarPathFrom);
    createFolderIsNotExist(avatarPathTo);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
