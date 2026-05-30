import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";

const COLLECTION = "clients";

/* ================= CREATE CLIENT ================= */
export const createClient = async (req, res) => {
  try {
    const client = await createDoc(COLLECTION, null, {
      ...req.body,
      status: req.body.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL CLIENTS ================= */
export const getClients = async (req, res) => {
  try {
    const clients = await getAllDocs(COLLECTION);

    // Sort by createdAt descending
    clients.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const dateB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return dateB - dateA;
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE CLIENT ================= */
export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getDoc(COLLECTION, id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE CLIENT ================= */
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await getDoc(COLLECTION, id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    req.body.updatedAt = new Date();

    await updateDoc(COLLECTION, id, req.body);

    res.status(200).json({ id, ...client, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE CLIENT ================= */
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await getDoc(COLLECTION, id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await deleteDoc(COLLECTION, id);

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= TOGGLE CLIENT STATUS ================= */
export const toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await getDoc(COLLECTION, id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newStatus =
      client.status === "active" ? "inactive" : "active";

    await updateDoc(COLLECTION, id, {
      status: newStatus,
      updatedAt: new Date(),
    });

    res.status(200).json({ id, ...client, status: newStatus });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
