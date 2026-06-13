import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
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
router.post("/", ...manage, testimonialController.createTestimonial);
router.put("/:id", ...manage, testimonialController.updateTestimonial);
router.delete("/:id", ...manage, testimonialController.deleteTestimonial);
router.patch("/:id/status", ...manage, testimonialController.toggleStatus);

export default router;
