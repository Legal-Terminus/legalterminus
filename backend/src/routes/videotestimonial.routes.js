import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { videoTestimonialSchema, videoTestimonialUpdateSchema, statusOnlySchema } from "../schemas/content.schema.js";
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
router.post("/", ...manage, validate(videoTestimonialSchema), createVideoTestimonial);
router.put("/:id", ...manage, validate(videoTestimonialUpdateSchema), updateVideoTestimonial);
router.delete("/:id", ...manage, deleteVideoTestimonial);
router.patch("/:id/status", ...manage, validate(statusOnlySchema), toggleVideoTestimonialStatus);

export default router;
