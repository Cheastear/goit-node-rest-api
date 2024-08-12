import {
  add,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
} from "../db/MongoDB.js";

export async function listContacts() {
  return await getAll();
}

export async function getContactById(contactId) {
  return await getById({ id: contactId });
}

export async function removeContact(contactId) {
  return await remove({ id: contactId });
}

export async function addContact({ name, email, phone, favorite }) {
  return await add({ name, email, phone, favorite });
}

export async function updateContactFile({ id, name, email, phone, favorite }) {
  return await update({ id, name, email, phone, favorite });
}

export async function updateStatusContact(id, body) {
  return await updateStatus(id, body);
}
