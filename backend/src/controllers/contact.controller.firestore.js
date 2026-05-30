import {
  createDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";

const COLLECTION = "contactLeads";

/* ================= SUBMIT CONTACT FORM ================= */
export const createContactLead = async (req, res) => {
  try {
    const { fullName, company, phone, email, subject, message, state, preferredCallTime, source } = req.body;

    if (!phone || !email || !message) {
      return res.status(400).json({ message: "Phone, email, and message are required." });
    }

    const lead = await createDoc(COLLECTION, null, {
      fullName: fullName || "",
      company: company || "",
      phone,
      email,
      subject: subject || "",
      message,
      state: state || "",
      preferredCallTime: preferredCallTime || "",
      source: source || "unknown",
      status: "new",               // new | contacted | closed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL LEADS ================= */
export const getContactLeads = async (req, res) => {
  try {
    const leads = await getAllDocs(COLLECTION);

    leads.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime() ?? 0;
      const dateB = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime() ?? 0;
      return dateB - dateA;
    });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE LEAD STATUS ================= */
export const updateContactLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["new", "contacted", "closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const updated = await updateDoc(COLLECTION, id, {
      status,
      updatedAt: new Date(),
    });

    res.status(200).json({ success: true, ...updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE LEAD ================= */
export const deleteContactLead = async (req, res) => {
  try {
    await deleteDoc(COLLECTION, req.params.id);
    res.status(200).json({ success: true, message: "Lead deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
