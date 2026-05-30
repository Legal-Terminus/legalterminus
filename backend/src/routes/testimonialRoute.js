import express from "express";
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

router.post("/", testimonialController.createTestimonial);
router.get("/", testimonialController.getAllTestimonials);
router.put("/:id", testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);
router.patch("/:id/status", testimonialController.toggleStatus);

export default router;
