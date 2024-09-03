import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.boolean().required(),
});

export const createContactValidator = async ({
  name,
  email,
  phone,
  favorite,
}) => {
  const validate = await createContactSchema.validate({
    name,
    email,
    phone,
    favorite,
  });
  if (validate.error) throw new ApiError(400, validate.error.message);
  return validate;
};

const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(10),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

export const updateContactValidator = async ({
  name,
  email,
  phone,
  favorite,
}) => {
  const validate = await updateContactSchema.validate({
    name,
    email,
    phone,
    favorite,
  });
  if (validate.error) throw new ApiError(400, validate.error.message);
  return validate;
};
