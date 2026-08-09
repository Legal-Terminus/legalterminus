import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import pinoHttp from "pino-http";

import { FirestoreStore } from "./middleware/firestoreRateLimitStore.js";
import { logger } from "./config/logger.js";

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
import notificationsRoutes from "./routes/notifications.routes.js";
import workflowDefinitionsRoutes from "./routes/workflowDefinitions.routes.js";
import healthRoutes from "./routes/health.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
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

/* ================= REQUEST LOGGING ================= */
// Structured per-request logs with an auto-generated request id (req.id),
// available as req.log inside handlers for correlated logging.
app.use(pinoHttp({ logger }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ================= SECURITY HEADERS ================= */
// helmet sets sensible secure defaults (HSTS, X-Content-Type-Options, etc.).
// crossOriginResourcePolicy is relaxed so /uploads images can be embedded
// cross-origin by the marketing site.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ================= MIDDLEWARE ================= */
// Cap JSON body size to mitigate large-payload DoS.
app.use(express.json({ limit: "1mb" }));

/* ================= RATE LIMITING ================= */
// Lenient global cap across all API routes — catches broad abuse without
// affecting normal interactive use.
// The full Playwright suite drives ~260 tests through this API from ONE IP in a
// single window and legitimately exceeds 1000 requests, so every run poisoned its
// own tail with 429s ("workflow-definitions did not return a list"). Raise the
// ceiling for E2E only — production keeps the real limit. Mirrors the
// EMAIL_DISABLED kill-switch used by emailService.
const isE2E = String(process.env.EMAIL_DISABLED ?? "").toLowerCase() === "true"
  || process.env.NODE_ENV === "test";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isE2E ? 100_000 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." },
});
app.use("/api", globalLimiter);

// Strict limiter for abuse-prone / unauthenticated-entry endpoints
// (contact form, payment initiation, auth register).
// - Backed by Firestore so the limit is SHARED across instances and survives
//   deploys (the default memory store is per-instance).
// - Keyed by the authenticated uid when present, else the client IP — so users
//   behind a shared NAT aren't throttled as one, and an attacker can't dodge by
//   rotating IPs once authenticated.
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isE2E ? 100_000 : 20, // see isE2E above — real limit in production
  standardHeaders: true,
  legacyHeaders: false,
  store: new FirestoreStore(),
  keyGenerator: (req) => req.user?.uid || ipKeyGenerator(req.ip),
  message: { success: false, error: "Too many attempts, please try again later." },
});

/* ================= 🔥 STATIC FILE SERVING ================= */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ================= ROUTES ================= */
app.use("/api/admin/blog", blogRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/video-testimonials", videoTestimonialRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/auth", sensitiveLimiter, authRoutes);
app.use("/api/payment", sensitiveLimiter, paymentRoutes);
app.use("/api/contact", sensitiveLimiter, contactRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/portal/users", portalUsersRoutes);
app.use("/api/service-config", serviceConfigRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/workflow-definitions", workflowDefinitionsRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/settings", settingsRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

/* ================= GLOBAL ERROR HANDLER ================= */
// Centralised handler — logs the real error server-side and returns a generic
// message so internal details / stack traces never leak to clients.
// (4-arg signature is required for Express to treat this as an error handler.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  (req.log || logger).error({ err }, "Unhandled error");
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? "Internal server error" : err.message || "Request failed",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const startServer = () => {
  // Initialize Firebase
  initializeFirebase();

  app.listen(PORT, () => {
    logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
  });
};

startServer();
