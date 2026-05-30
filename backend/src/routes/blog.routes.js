import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs
} from "../controllers/blog.controller.firestore.js";

const router = express.Router();

router.post("/create", upload.single("image"), createBlog);
router.put("/update/:id", upload.single("image"), updateBlog);
router.delete("/delete/:id", deleteBlog);
router.get("/all", getAllBlogs);


export default router;
