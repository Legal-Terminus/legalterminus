import { z } from "zod";

// Shared primitives.
const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().max(20000);
const url = z.string().trim().url().max(2000);
const status = z.enum(["draft", "published", "active", "inactive"]).optional();

/* ── Blog ─────────────────────────────────────────────────────────────── */
// NOTE: multipart/form-data (image upload) — all values arrive as strings.
export const blogCreateSchema = z.object({
  title: z.string().trim().min(5).max(200),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  category: shortText,
  tags: z.string().trim().max(500).optional(),
  author: shortText,
  shortDesc: z.string().trim().min(10).max(500),
  content: z.string().trim().min(50),
  status,
  metaTitle: z.string().trim().min(1).max(200),
  metaDesc: z.string().trim().min(1).max(500),
  metaKeywords: z.string().trim().min(1).max(500),
}).strip(); // strip unknown (multipart can include stray fields)

export const blogUpdateSchema = blogCreateSchema.partial();

/* ── Category ─────────────────────────────────────────────────────────── */
export const categoryCreateSchema = z.object({ name: shortText }).strict();
export const categoryUpdateSchema = z.object({ name: shortText }).strict();

/* ── Employee ─────────────────────────────────────────────────────────── */
// multipart/form-data (avatar upload).
export const employeeCreateSchema = z.object({
  name: shortText,
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(7).max(20),
  department: shortText,
  designation: shortText,
  joiningDate: z.string().trim().min(1),
  status: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  password: z.string().min(6).max(128),
  confirmPassword: z.string().min(6).max(128),
}).strip();

export const employeeUpdateSchema = employeeCreateSchema
  .omit({ password: true, confirmPassword: true, email: true })
  .partial();

/* ── Testimonial (text) ───────────────────────────────────────────────── */
// Controllers spread req.body into Firestore — .strict() prevents mass-assignment.
export const testimonialSchema = z.object({
  name: shortText,
  role: z.string().trim().max(120).optional(),
  company: z.string().trim().max(200).optional(),
  message: longText,
  rating: z.coerce.number().min(0).max(5).optional(),
  image: z.string().trim().max(2000).optional(),
  status,
}).strict();

export const testimonialUpdateSchema = testimonialSchema.partial();

/* ── Video testimonial ────────────────────────────────────────────────── */
export const videoTestimonialSchema = z.object({
  title: shortText,
  name: z.string().trim().max(200).optional(),
  videoUrl: url,
  thumbnail: z.string().trim().max(2000).optional(),
  description: z.string().trim().max(2000).optional(),
  status,
}).strict();

export const videoTestimonialUpdateSchema = videoTestimonialSchema.partial();

/* ── Status-only PATCH (testimonials/video) ───────────────────────────── */
export const statusOnlySchema = z.object({
  status: z.enum(["draft", "published", "active", "inactive"]),
}).strict();

/* ── Contact lead (public submit) ─────────────────────────────────────── */
export const contactCreateSchema = z.object({
  fullName: z.string().trim().max(100).optional(),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(7).max(15),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(2000),
  state: z.string().trim().max(60).optional(),
  preferredCallTime: z.string().trim().max(50).optional(),
  source: z.string().trim().max(80).optional(),
  sourceLabel: z.string().trim().max(200).optional(),
  whatsapp: z.union([z.boolean(), z.literal("true"), z.literal("false")]).optional(),
}).strip(); // marketing form may post extra UTM-ish fields; strip them

export const contactStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
}).strict();

/* ── Lead (manual create/update by staff) ─────────────────────────────── */
export const leadCreateSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  company: z.string().trim().max(100).optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(15).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  state: z.string().trim().max(60).optional(),
  preferredCallTime: z.string().trim().max(50).optional(),
  sourceLabel: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
}).strip().refine((v) => v.email || v.phone, { message: "email or phone is required" });

export const leadUpdateSchema = z.object({
  fullName: z.string().trim().max(100).optional(),
  company: z.string().trim().max(100).optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(15).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  state: z.string().trim().max(60).optional(),
  preferredCallTime: z.string().trim().max(50).optional(),
  sourceLabel: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
  status: z.enum(["new", "contacted", "closed"]).optional(),
}).strip();
