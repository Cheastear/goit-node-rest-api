import ApiError from "./ApiError.js";

const asyncTryCatchWrapper = async (callback, args) => {
  const [req, res, next] = [...args];
  try {
    return await callback(...args);
  } catch (err) {
    if (err.kind) next(new ApiError(404, "Not found"));
    else next(err);
  }
};

export default asyncTryCatchWrapper;
