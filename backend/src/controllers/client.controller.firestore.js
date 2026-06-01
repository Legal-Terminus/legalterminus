import { db } from "../config/firebase.js";
import {
  upsertUser,
  validateProfileData,
  getUserByUid,
  getUserByEmail,
  updateUserRole,
  deleteUser,
} from '../services/userService.js';

const COLLECTION = "clients";

/* ================= CREATE CLIENT ================= */
export const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      organisation,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      state,
      emailIds,
    } = req.body;
    const adminUid = req.user?.uid || 'admin';

    // Validation
    const required = ['name', 'email', 'phone', 'address'];
    const validation = validateProfileData(req.body, required);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'Missing required fields',
        missing: validation.missing,
      });
    }

    // Call unified upsertUser service
    const result = await upsertUser(
      email,
      'client',
      {
        name,
        email,
        phone,
        address,
        organisation,
        businessName,
        gstNumber,
        panNumber,
        aadhaarNumber,
        state,
        emailIds: emailIds && emailIds.length > 0 ? emailIds : [email],
      },
      {
        sendEmail: true,
        authProvider: 'email',
        createdBy: adminUid,
      }
    );

    // Also create/update client-specific document
    const clientData = {
      uid: result.uid,
      name,
      email,
      phone,
      address,
      organisation,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      state,
      emailIds: emailIds && emailIds.length > 0 ? emailIds : [email],
      status: 'active',
      type: 'client',
      createdAt: result.isUpdate ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (result.isUpdate) {
      // Update existing client document
      const { createdAt, ...updateData } = clientData;
      await db.collection(COLLECTION).doc(result.uid).update(updateData);
    } else {
      // Create new client document
      await db.collection(COLLECTION).doc(result.uid).set(clientData);
    }

    res.status(result.isUpdate ? 200 : 201).json({
      uid: result.uid,
      email: result.email,
      name: result.name,
      role: result.role,
      isUpdate: result.isUpdate,
      scenario: result.scenario,
      message: result.message,
      emailIds: clientData.emailIds,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL CLIENTS ================= */
export const getClients = async (req, res) => {
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    const clients = [];
    snapshot.forEach(doc => {
      clients.push({
        uid: doc.id,
        clientId: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE CLIENT ================= */
export const getClient = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      uid: doc.id,
      clientId: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE CLIENT ================= */
export const updateClient = async (req, res) => {
  try {
    const { id: clientId } = req.params;
    const {
      name,
      phone,
      address,
      organisation,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      state,
      emailIds,
    } = req.body;
    const adminUid = req.user?.uid || 'admin';

    // Get current client
    const clientDoc = await db.collection(COLLECTION).doc(clientId).get();
    if (!clientDoc.exists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const currentClient = clientDoc.data();
    const now = new Date().toISOString();

    // Update user document
    const userUpdates = {
      name,
      phone,
      address,
      organisation,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      state,
      emailIds: emailIds && emailIds.length > 0 ? emailIds : [currentClient.email],
      updatedAt: now,
      updatedBy: adminUid,
    };

    await db.collection('users').doc(clientId).update(userUpdates);

    // Update client document
    await db.collection(COLLECTION).doc(clientId).update({
      ...userUpdates,
    });

    res.status(200).json({
      clientId,
      message: 'Client updated successfully',
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE CLIENT ================= */
export const deleteClient = async (req, res) => {
  try {
    const { id: clientId } = req.params;

    // Check if client exists
    const clientDoc = await db.collection(COLLECTION).doc(clientId).get();
    if (!clientDoc.exists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Delete using unified service (also deletes from users collection)
    await deleteUser(clientId);

    // Delete from clients collection
    await db.collection(COLLECTION).doc(clientId).delete();

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= TOGGLE CLIENT STATUS ================= */
export const toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Client not found" });
    }

    const clientData = doc.data();
    const newStatus = clientData.status === "active" ? "inactive" : "active";

    await db.collection(COLLECTION).doc(id).update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error toggling client status:', error);
    res.status(500).json({ message: error.message });
  }
};
