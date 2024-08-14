import Contact from "../schemas/requestSchema.js";

export async function getCountDocuments() {
  return await Contact.countDocuments();
}

export async function listContacts(query, { skip, limit }) {
  return await Contact.find(query).skip(skip).limit(limit).exec();
}

export async function getContactById({ id, owner }) {
  return await Contact.findOne({ _id: id, owner });
}

export async function removeContact({ id, owner }) {
  return await Contact.findOneAndDelete({ _id: id, owner }, { new: true });
}

export async function addContact({ name, email, phone, favorite, owner }) {
  return await Contact.create({ name, email, phone, favorite, owner });
}

export async function updateContactFile({
  id,
  owner,
  name,
  email,
  phone,
  favorite,
}) {
  return await Contact.findByIdAndUpdate(
    { _id: id, owner },
    { name, email, phone, favorite },
    { new: true }
  );
}

export async function updateStatusContact({ id, owner }, body) {
  return await Contact.findByIdAndUpdate(
    { _id: id, owner },
    {
      favorite: body.favorite,
    },
    { new: true }
  );
}
