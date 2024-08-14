import Joi from "joi";

export const userValidateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
