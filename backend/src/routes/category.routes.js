import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { categoryCreateSchema, categoryUpdateSchema } from "../schemas/content.schema.js";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.firestore.js";

const router = express.Router();

// Public read — consumed by the marketing site.
router.get("/all", getCategories);

// Content management — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];
router.post("/create", ...manage, validate(categoryCreateSchema), createCategory);
router.put("/update/:id", ...manage, validate(categoryUpdateSchema), updateCategory);
router.delete("/delete/:id", ...manage, deleteCategory);

export default router;
