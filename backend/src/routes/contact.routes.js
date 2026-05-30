import express from "express";
import {
  createContactLead,
  getContactLeads,
  updateContactLeadStatus,
  deleteContactLead,
} from "../controllers/contact.controller.firestore.js";

const router = express.Router();

router.post("/", createContactLead);
router.get("/", getContactLeads);
router.patch("/:id/status", updateContactLeadStatus);
router.delete("/:id", deleteContactLead);

export default router;
