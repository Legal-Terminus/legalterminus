import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";

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
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL TESTIMONIALS ================= */
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await getAllDocs(COLLECTION);

    // Sort by createdAt descending
    testimonials.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const dateB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return dateB - dateA;
    });

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};
