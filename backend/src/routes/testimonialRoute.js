import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { testimonialSchema, testimonialUpdateSchema, statusOnlySchema } from "../schemas/content.schema.js";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller.firestore.js";

const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleStatus: deleteTestimonial,
};

const router = express.Router();

// Public read — consumed by the marketing site.
router.get("/", testimonialController.getAllTestimonials);

// Content management — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];
router.post("/", ...manage, validate(testimonialSchema), testimonialController.createTestimonial);
router.put("/:id", ...manage, validate(testimonialUpdateSchema), testimonialController.updateTestimonial);
router.delete("/:id", ...manage, testimonialController.deleteTestimonial);
router.patch("/:id/status", ...manage, validate(statusOnlySchema), testimonialController.toggleStatus);

export default router;
