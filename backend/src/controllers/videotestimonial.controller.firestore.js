import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";

const COLLECTION = "videotestimonials";

/* ================= CREATE VIDEO TESTIMONIAL ================= */
export const createVideoTestimonial = async (req, res) => {
  try {
    const video = await createDoc(COLLECTION, null, {
      ...req.body,
      status: req.body.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json(video);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL VIDEO TESTIMONIALS ================= */
export const getVideoTestimonials = async (req, res) => {
  try {
    const videos = await getAllDocs(COLLECTION);

    // Sort by createdAt descending
    videos.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const dateB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return dateB - dateA;
    });

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE VIDEO TESTIMONIAL ================= */
export const getVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await getDoc(COLLECTION, id);

    if (!video) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE VIDEO TESTIMONIAL ================= */
export const updateVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await getDoc(COLLECTION, id);
    if (!video) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    req.body.updatedAt = new Date();

    await updateDoc(COLLECTION, id, req.body);

    return res.status(200).json({ id, ...video, ...req.body });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE VIDEO TESTIMONIAL ================= */
export const deleteVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await getDoc(COLLECTION, id);
    if (!video) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    await deleteDoc(COLLECTION, id);

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* ================= TOGGLE VIDEO TESTIMONIAL STATUS ================= */
export const toggleVideoTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await getDoc(COLLECTION, id);
    if (!video) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    const newStatus =
      video.status === "draft" ? "published" : "draft";

    await updateDoc(COLLECTION, id, {
      status: newStatus,
      updatedAt: new Date(),
    });

    return res.status(200).json({ id, ...video, status: newStatus });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
