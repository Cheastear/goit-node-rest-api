import {
  add,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
} from "../db/MongoDB.js";

export async function listContacts() {
  try {
    return await getAll();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    return await getById({ id: contactId });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await remove({ id: contactId });
    return contact;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function addContact({ name, email, phone, favorite }) {
  try {
    return await add({ name, email, phone, favorite });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateContactFile({ id, name, email, phone, favorite }) {
  try {
    return await update({ id, name, email, phone, favorite });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateStatusContact(id, body) {
  try {
    return await updateStatus(id, body);
  } catch (err) {
    console.log(err);
  }
}
