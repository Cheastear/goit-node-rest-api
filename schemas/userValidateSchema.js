import Joi from "joi";

const userValidateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userValidator = ({ email, password }) => {
  const validate = userValidateSchema.validate({ email, password });
  if (validate.error) throw new ApiError(400, validate.error.message);
  return validate;
};
