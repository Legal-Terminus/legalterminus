import {
  createDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";

const COLLECTION = "contactLeads";

/* ── Sanitization helpers ───────────────────────────────────────────────── */
// Strip all HTML/script tags and trim whitespace
const stripTags = (str) =>
  typeof str === "string" ? str.replace(/<[^>]*>/g, "").trim() : "";

// Keep only digits (for phone numbers)
const digitsOnly = (str) =>
  typeof str === "string" ? str.replace(/\D/g, "") : "";

const FIELD_LIMITS = {
  fullName: 100,
  company: 100,
  phone: 15,
  email: 254,
  subject: 200,
  message: 2000,
  state: 60,
  preferredCallTime: 50,
  source: 80,
  sourceLabel: 200,
};

/* ================= SUBMIT CONTACT FORM ================= */
export const createContactLead = async (req, res) => {
  try {
    const raw = req.body;

    const fullName         = stripTags(raw.fullName).slice(0, FIELD_LIMITS.fullName);
    const company          = stripTags(raw.company).slice(0, FIELD_LIMITS.company);
    const phone            = digitsOnly(raw.phone).slice(0, FIELD_LIMITS.phone);
    const email            = stripTags(raw.email).toLowerCase().slice(0, FIELD_LIMITS.email);
    const subject          = stripTags(raw.subject).slice(0, FIELD_LIMITS.subject);
    const message          = stripTags(raw.message).slice(0, FIELD_LIMITS.message);
    const state            = stripTags(raw.state).slice(0, FIELD_LIMITS.state);
    const preferredCallTime = stripTags(raw.preferredCallTime).slice(0, FIELD_LIMITS.preferredCallTime);
    const source           = stripTags(raw.source).slice(0, FIELD_LIMITS.source) || "unknown";
    const sourceLabel      = stripTags(raw.sourceLabel).slice(0, FIELD_LIMITS.sourceLabel) || "";
    const whatsapp         = raw.whatsapp === true || raw.whatsapp === "true";

    // Validate required fields
    if (!phone || !email || !message) {
      return res.status(400).json({ message: "Phone, email, and message are required." });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Phone must be 7–15 digits
    if (phone.length < 7) {
      return res.status(400).json({ message: "Invalid phone number." });
    }

    const lead = await createDoc(COLLECTION, null, {
      fullName,
      company,
      phone,
      email,
      subject,
      message,
      state,
      preferredCallTime,
      source,                      // internal key — never changes, used for filtering
      sourceLabel,                 // user-customizable display name from serviceCategories
      whatsapp,
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
