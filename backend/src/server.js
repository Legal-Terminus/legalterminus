import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import videoTestimonialRoutes from "./routes/videotestimonial.routes.js";
import clientRoutes from "./routes/client.routes.js";
import testimonialRoutes from "./routes/testimonialRoute.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
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
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
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

// Serve React static files from public folder (built frontend)
app.use(express.static(path.join(__dirname, "../public")));

/* ================= ROUTES ================= */
app.use("/api/admin/blog", blogRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/video-testimonials", videoTestimonialRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= FALLBACK ROUTE (SPA) ================= */
// Serve React app for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

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
