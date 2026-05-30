import fs from "fs";
import path from "path";
import { processImage } from "../middleware/upload.middleware.js";
import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
} from "../config/firestore.js";
import { getAuth } from "../config/firebase.js";

const COLLECTION = "employees";

/* ================= CREATE EMPLOYEE ================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      joiningDate,
      status,
      address,
      password,
      confirmPassword,
    } = req.body;

    /* 1️⃣ Basic validation */
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    /* 2️⃣ Check duplicate email - Query Firestore */
    const employees = await getAllDocs(COLLECTION);
    const existingEmployee = employees.find(emp => emp.email === email);
    
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    /* 3️⃣ Image processing */
    let avatar = null;
    if (req.file) {
      avatar = await processImage(req.file);
    }

    /* 4️⃣ Create Firebase Auth user first */
    const auth = getAuth();
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    /* 5️⃣ Create employee document in Firestore with Firebase UID */
    const employee = await createDoc(COLLECTION, userRecord.uid, {
      name,
      email,
      phone,
      department,
      designation,
      joiningDate: new Date(joiningDate),
      status: status || "Active",
      address,
      avatar,
      role: "employee",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    /* 6️⃣ Success response */
    res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        status: employee.status,
      },
    });
  } catch (error) {
    console.error("Employee Create Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* ================= GET ALL EMPLOYEES ================= */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await getAllDocs(COLLECTION);
    
    // Sort by createdAt descending
    employees.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const dateB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

/* ================= GET SINGLE EMPLOYEE ================= */
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getDoc(COLLECTION, id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
    });
  }
};

/* ================= UPDATE EMPLOYEE ================= */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getDoc(COLLECTION, id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    let newAvatar = null;
    if (req.file) {
      newAvatar = await processImage(req.file);
      if (employee.avatar) {
        fs.unlinkSync(path.join("uploads/employees", employee.avatar));
      }
      req.body.avatar = newAvatar;
    }

    req.body.updatedAt = new Date();

    await updateDoc(COLLECTION, id, req.body);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: { id, ...employee, ...req.body },
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

/* ================= DELETE EMPLOYEE ================= */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getDoc(COLLECTION, id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Delete avatar if exists
    if (employee.avatar) {
      const imgPath = path.join("uploads/employees", employee.avatar);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    // Delete from Firebase Auth
    const auth = getAuth();
    await auth.deleteUser(id);

    // Delete from Firestore
    await deleteDoc(COLLECTION, id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};
