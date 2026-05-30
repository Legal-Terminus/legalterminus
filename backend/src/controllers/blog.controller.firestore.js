import fs from "fs";
import path from "path";
import { processImage } from "../middleware/upload.middleware.js";
import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
  getDocBySlug,
} from "../config/firestore.js";

const COLLECTION = "blogs";

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  let imageName = null;

  try {
    const {
      title,
      slug,
      category,
      tags,
      author,
      shortDesc,
      content,
      status,
      metaTitle,
      metaDesc,
      metaKeywords,
    } = req.body;

    /* REQUIRED */
    if (
      !title ||
      !slug ||
      !category ||
      !author ||
      !shortDesc ||
      !content ||
      !metaTitle ||
      !metaDesc ||
      !metaKeywords
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    /* LENGTH VALIDATION */
    if (title.length < 5)
      return res.status(400).json({ message: "Title too short" });
    if (shortDesc.length < 10)
      return res.status(400).json({ message: "Short description too short" });
    if (content.length < 50)
      return res.status(400).json({ message: "Content too short" });

    /* SLUG UNIQUE */
    const existingSlug = await getDocBySlug(COLLECTION, slug);
    if (existingSlug)
      return res.status(409).json({ message: "Slug already exists" });

    /* PROCESS IMAGE AFTER VALIDATION */
    imageName = await processImage(req.file);

    const blog = await createDoc(COLLECTION, null, {
      title,
      slug,
      category,
      tags,
      author,
      shortDesc,
      content,
      status: status || "draft",
      metaTitle,
      metaDesc,
      metaKeywords,
      image: imageName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    /* ❗ DELETE IMAGE IF DB FAILS */
    if (imageName) {
      fs.unlinkSync(path.join("uploads/blogs", imageName));
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  let newImage = null;

  try {
    const { id } = req.params;

    const blog = await getDoc(COLLECTION, id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    /* PROCESS NEW IMAGE */
    if (req.file) {
      newImage = await processImage(req.file);

      /* DELETE OLD IMAGE */
      if (blog.image) {
        fs.unlinkSync(path.join("uploads/blogs", blog.image));
      }

      req.body.image = newImage;
    }

    /* UPDATE FIELDS */
    req.body.updatedAt = new Date();

    await updateDoc(COLLECTION, id, req.body);

    res.json({
      message: "Blog updated successfully",
      blog: { id, ...blog, ...req.body },
    });
  } catch (error) {
    /* CLEAN UP NEW IMAGE IF UPDATE FAILS */
    if (newImage) {
      fs.unlinkSync(path.join("uploads/blogs", newImage));
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await getDoc(COLLECTION, id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    /* DELETE IMAGE */
    if (blog.image) {
      const imgPath = path.join("uploads/blogs", blog.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await deleteDoc(COLLECTION, id);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await getAllDocs(COLLECTION);
    // Sort by createdAt descending
    blogs.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const dateB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return dateB - dateA;
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};
