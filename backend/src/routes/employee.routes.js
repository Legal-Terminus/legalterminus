import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.firestore.js";
import { upload } from "../middleware/upload.middleware.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { employeeCreateSchema, employeeUpdateSchema } from "../schemas/content.schema.js";

const router = express.Router();

// Content management — admin + manager only.
const manage = [verifyToken, requireRole("admin", "manager")];

/* 📥 Public reads — consumed by the marketing site. */
router.get("/", getAllEmployees);
router.get("/:id", getEmployee);

/* ➕ Create Employee */
router.post("/create", ...manage, upload.single("avatar"), validate(employeeCreateSchema), createEmployee);

/* ✏️ Update Employee */
router.put("/update/:id", ...manage, upload.single("avatar"), validate(employeeUpdateSchema), updateEmployee);

/* ❌ Delete Employee */
router.delete("/delete/:id", ...manage, deleteEmployee);

export default router;
