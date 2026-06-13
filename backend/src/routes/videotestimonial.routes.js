import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import {
  createVideoTestimonial,
  getVideoTestimonials,
  updateVideoTestimonial,
  deleteVideoTestimonial,
  toggleVideoTestimonialStatus,
} from "../controllers/videotestimonial.controller.firestore.js";

const router = express.Router();

// Public read — consumed by the marketing site.
router.get("/", getVideoTestimonials);

// Content management — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];
router.post("/", ...manage, createVideoTestimonial);
router.put("/:id", ...manage, updateVideoTestimonial);
router.delete("/:id", ...manage, deleteVideoTestimonial);
router.patch("/:id/status", ...manage, toggleVideoTestimonialStatus);

export default router;
