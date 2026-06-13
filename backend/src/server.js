import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import videoTestimonialRoutes from "./routes/videotestimonial.routes.js";
import testimonialRoutes from "./routes/testimonialRoute.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import portalUsersRoutes from "./routes/portalUsers.routes.js";
import serviceConfigRoutes from "./routes/serviceConfig.routes.js";
import initializeFirebase from "./config/firebase.js";

// Load environment variables
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.qa" });

const app = express();

/* ================= FIX __dirname (ES MODULE) ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CORS ================= */
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,   // any localhost port in development
  "capacitor://localhost",          // Capacitor iOS app
  "http://localhost",               // Capacitor Android app
  /\.firebaseapp\.com$/,
  /\.web\.app$/,
  /legalterminus\.com$/,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= 🔥 STATIC FILE SERVING ================= */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ================= ROUTES ================= */
app.use("/api/admin/blog", blogRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/video-testimonials", videoTestimonialRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/portal/users", portalUsersRoutes);
app.use("/api/service-config", serviceConfigRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const startServer = () => {
  // Initialize Firebase
  initializeFirebase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
