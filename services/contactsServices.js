import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const list = JSON.parse(data);
    return list;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    const list = await listContacts();
    console.log(list.find((elem) => elem.id == contactId));
    return list.find((elem) => elem.id == contactId);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const list = await listContacts();
    const contact = list.find((elem) => elem.id == contactId);
    if (contact) {
      const updatedList = list.filter((elem) => elem.id !== contactId);
      await fs.writeFile(contactsPath, JSON.stringify(updatedList));
      return contact;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const list = await listContacts();
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify([...list, newContact]));
    return newContact;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateContactFile(id, name, email, phone) {
  try {
    const list = await listContacts();
    const contact = list.find((el) => el.id === id);
    if (!contact) {
      return null;
    }
    const newContact = {
      id: contact.id,
      name: name ? name : contact.name,
      email: email ? email : contact.email,
      phone: phone ? phone : contact.phone,
    };
    const newList = list.map((el) => (el.id === id ? newContact : el));
    await fs.writeFile(contactsPath, JSON.stringify(newList));
    return newContact;
  } catch (err) {
    console.log(err);
    return null;
  }
}
