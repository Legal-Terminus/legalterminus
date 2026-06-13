import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { contactCreateSchema, contactStatusSchema } from "../schemas/content.schema.js";
import {
  createContactLead,
  getContactLeads,
  updateContactLeadStatus,
  deleteContactLead,
} from "../controllers/contact.controller.firestore.js";

const router = express.Router();

// Public submit — the marketing site contact form posts here.
router.post("/", validate(contactCreateSchema), createContactLead);

// Lead data (PII) — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];
router.get("/", ...manage, getContactLeads);
router.patch("/:id/status", ...manage, validate(contactStatusSchema), updateContactLeadStatus);
router.delete("/:id", ...manage, deleteContactLead);

export default router;
