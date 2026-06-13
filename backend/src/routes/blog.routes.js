import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs
} from "../controllers/blog.controller.firestore.js";

const router = express.Router();

// Public read — consumed by the marketing site.
router.get("/all", getAllBlogs);

// Content management — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];
router.post("/create", ...manage, upload.single("image"), createBlog);
router.put("/update/:id", ...manage, upload.single("image"), updateBlog);
router.delete("/delete/:id", ...manage, deleteBlog);

export default router;
