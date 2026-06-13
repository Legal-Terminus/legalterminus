import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";
import { logger } from "../config/logger.js";

const COLLECTION = "testimonials";

/* ================= CREATE TESTIMONIAL ================= */
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await createDoc(COLLECTION, null, {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(testimonial);
  } catch (error) {
    logger.error({ err: error }, "[TESTIMONIAL_ERROR]");
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET ALL TESTIMONIALS ================= */
export const getAllTestimonials = async (req, res) => {
  try {
    // Ordered + capped in Firestore (no full scan, no in-memory sort).
    const testimonials = await getAllDocs(COLLECTION, [], { orderBy: { field: "createdAt", direction: "desc" } });
    res.status(200).json(testimonials);
  } catch (error) {
    logger.error({ err: error }, "[TESTIMONIAL_ERROR]");
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET SINGLE TESTIMONIAL ================= */
export const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await getDoc(COLLECTION, id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    logger.error({ err: error }, "[TESTIMONIAL_ERROR]");
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= UPDATE TESTIMONIAL ================= */
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await getDoc(COLLECTION, id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    req.body.updatedAt = new Date();

    await updateDoc(COLLECTION, id, req.body);

    res.status(200).json({ id, ...testimonial, ...req.body });
  } catch (error) {
    logger.error({ err: error }, "[TESTIMONIAL_ERROR]");
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE TESTIMONIAL ================= */
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await getDoc(COLLECTION, id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await deleteDoc(COLLECTION, id);

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    logger.error({ err: error }, "[TESTIMONIAL_ERROR]");
    res.status(500).json({ message: "Internal server error" });
  }
};
