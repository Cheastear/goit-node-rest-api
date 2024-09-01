import passport from "passport";
import passportJWT from "passport-jwt";

import User from "../models/userSchema.js";

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const options = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(options, (payload, next) => {
    User.findById(payload.id)
      .then((user) => {
        if (!user) {
          return next(new Error("Not authorized"));
        }
        return next(null, user);
      })
      .catch((err) => next(err));
  })
);
