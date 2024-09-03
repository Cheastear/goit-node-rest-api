import ApiError from "./ApiError.js";

const asyncTryCatchWrapper = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      if (err.kind) {
        next(new ApiError(404, "Not found"));
      } else {
        next(err);
      }
    }
  };
};

export default asyncTryCatchWrapper;
