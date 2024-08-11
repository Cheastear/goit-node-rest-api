import Contact from "../schemas/requestSchema.js";

export const getAll = async () => {
  return await Contact.find();
};
export const getById = async ({ id }) => {
  return await Contact.findById(id);
};

export const remove = async ({ id }) => {
  return await Contact.findByIdAndDelete(id, { new: true });
};

export const add = async ({ name, email, phone, favorite }) => {
  return await Contact.create({ name, email, phone, favorite });
};

export const update = async ({ id, name, email, phone, favorite }) => {
  return await Contact.findByIdAndUpdate(
    { _id: id },
    { name, email, phone, favorite },
    { new: true }
  );
};

export const updateStatus = async (id, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: id },
    {
      favorite: body.favorite,
    },
    { new: true }
  );
};
