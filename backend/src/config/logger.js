import pino from "pino";

/**
 * Structured JSON logger (Cloud Logging-friendly).
 *
 * Emits one JSON object per log line so entries are queryable in Cloud Logging
 * (severity, request id, fields) instead of unstructured console strings. Level
 * is controlled by LOG_LEVEL (default "info").
 *
 * Use `logger.info({ foo }, "msg")` / `logger.error({ err }, "msg")`. The
 * request logger (pino-http, wired in server.js) attaches `req.log` with a
 * per-request id so logs within a request can be correlated.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // Map pino levels to Cloud Logging severity for nicer rendering in GCP.
  formatters: {
    level: (label) => ({ severity: label.toUpperCase() }),
  },
  redact: {
    // Never log auth tokens or secrets if an object containing them is passed.
    paths: ["req.headers.authorization", "*.password", "*.private_key", "*.hash"],
    remove: true,
  },
});

export default logger;
