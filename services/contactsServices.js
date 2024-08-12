import Contact from "../schemas/requestSchema.js";

export async function listContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return await Contact.findByIdAndDelete(contactId, { new: true });
}

export async function addContact({ name, email, phone, favorite }) {
  return await Contact.create({ name, email, phone, favorite });
}

export async function updateContactFile({ id, name, email, phone, favorite }) {
  return await Contact.findByIdAndUpdate(
    { _id: id },
    { name, email, phone, favorite },
    { new: true }
  );
}

export async function updateStatusContact(id, body) {
  return await Contact.findByIdAndUpdate(
    { _id: id },
    {
      favorite: body.favorite,
    },
    { new: true }
  );
}
