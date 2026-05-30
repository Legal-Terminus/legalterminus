import express from "express";
import {
  createVideoTestimonial,
  getVideoTestimonials,
  updateVideoTestimonial,
  deleteVideoTestimonial,
  toggleVideoTestimonialStatus,
} from "../controllers/videotestimonial.controller.firestore.js";

const router = express.Router();

router.post("/", createVideoTestimonial);
router.get("/", getVideoTestimonials);
router.put("/:id", updateVideoTestimonial);
router.delete("/:id", deleteVideoTestimonial);
router.patch("/:id/status", toggleVideoTestimonialStatus);

export default router;
