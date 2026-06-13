import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";
import { logger } from "../config/logger.js";

const COLLECTION = "categories";

/* ================= GET ALL CATEGORIES ================= */
export const getCategories = async (req, res) => {
  try {
    // Bounded read (cap in Firestore). Categories is a small, naturally-bounded
    // set; we sort case-insensitively in JS because Firestore orderBy is
    // case-sensitive and there is no normalized name field to order on.
    const categories = await getAllDocs(COLLECTION, [], { limit: 200 });
    categories.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
    );

    res.status(200).json(categories);
  } catch (error) {
    logger.error({ err: error }, "Fetch Categories Error:");
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ================= CREATE CATEGORY ================= */
export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    name = name.trim();

    // Check if category exists (case-insensitive)
    const categories = await getAllDocs(COLLECTION);
    const exists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await createDoc(COLLECTION, null, {
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(category);
  } catch (error) {
    logger.error({ err: error }, "Create Category Error:");
    res.status(500).json({ message: "Failed to create category" });
  }
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await getDoc(COLLECTION, id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if another category has this name
    const categories = await getAllDocs(COLLECTION);
    const exists = categories.some(
      (cat) =>
        cat.id !== id &&
        cat.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    await updateDoc(COLLECTION, id, {
      name: name.trim(),
      updatedAt: new Date(),
    });

    res.status(200).json({ id, name: name.trim(), updatedAt: new Date() });
  } catch (error) {
    logger.error({ err: error }, "Update Category Error:");
    res.status(500).json({ message: "Failed to update category" });
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getDoc(COLLECTION, id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await deleteDoc(COLLECTION, id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error({ err: error }, "Delete Category Error:");
    res.status(500).json({ message: "Failed to delete category" });
  }
};
