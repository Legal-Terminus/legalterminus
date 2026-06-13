import { ZodError } from "zod";

/**
 * Request-validation middleware factory.
 *
 * Usage: router.post("/", validate(createUserSchema), handler)
 *
 * Validates `req.body` against the given Zod schema. On success the parsed
 * (and coerced/stripped) value REPLACES `req.body`, so handlers receive clean,
 * typed input and never see unknown fields. On failure responds 400 with the
 * field-level issues — these are safe, caller-facing validation messages.
 *
 * Pass `source: "query"` to validate query params instead (used for pagination).
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    // Express 5 makes `req.query` (and `req.params`) getter-only — a plain
    // `req.query = parsed` throws, and mutating the object the getter returns
    // doesn't stick (it can re-parse lazily). Redefine the property as a
    // writable own-value so the parsed/coerced result is what handlers read.
    // `req.body` is still a normal writable property.
    if (source === "body") {
      req.body = parsed;
    } else {
      Object.defineProperty(req, source, {
        value: parsed,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }
    next(err);
  }
};
