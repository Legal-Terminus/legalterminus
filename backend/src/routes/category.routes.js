import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.firestore.js";

const router = express.Router();

/* ROUTES */
router.get("/all", getCategories);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
