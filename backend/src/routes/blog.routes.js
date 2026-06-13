import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { blogCreateSchema, blogUpdateSchema } from "../schemas/content.schema.js";
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
// NOTE: validate runs AFTER multer so req.body is populated from multipart.
const manage = [verifyToken, requireRole("admin", "manager")];
router.post("/create", ...manage, upload.single("image"), validate(blogCreateSchema), createBlog);
router.put("/update/:id", ...manage, upload.single("image"), validate(blogUpdateSchema), updateBlog);
router.delete("/delete/:id", ...manage, deleteBlog);

export default router;
