import passport from "passport";
import { getById } from "../services/usersServices.js";
import ApiError from "./ApiError.js";

const verifyToken = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    try {
      const userDb = await getById(user.id);
      if (req.headers.authorization.replace("Bearer ", "") !== userDb.token) {
        next(new ApiError(401, "Unauthorized"));
        return;
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500, "Server error");
    }
  })(req, res, next);
};

export default verifyToken;
