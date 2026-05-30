import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.firestore.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/* ➕ Create Employee */
router.post("/create", upload.single("avatar"), createEmployee);

/* 📥 Fetch All Employees */
router.get("/", getAllEmployees);

/* 👤 Get Single Employee */
router.get("/:id", getEmployee);

/* ✏️ Update Employee */
router.put("/update/:id", upload.single("avatar"), updateEmployee);

/* ❌ Delete Employee */
router.delete("/delete/:id", deleteEmployee);

export default router;
