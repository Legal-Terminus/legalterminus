import { z } from "zod";
import { VALID_ROLES } from "../config/roles.js";

// Reusable field primitives — trimmed, length-clamped, format-checked.
const name = z.string().trim().min(1).max(200);
const email = z.string().trim().toLowerCase().email().max(254);
const phone = z.string().trim().min(7).max(20).regex(/^[0-9+\-() ]+$/, "Invalid phone number");
const optShort = z.string().trim().max(100).optional();
const optLong = z.string().trim().max(200).optional();
const role = z.enum(VALID_ROLES);

// Profile fields shared/optional across roles. `.partial()`-friendly.
const profileFields = {
  designation: optShort,
  joiningDate: optShort,
  fathersName: optLong,
  dateOfBirth: optShort,
  address: z.string().trim().max(500).optional(),
  organisation: optLong,
  businessName: optLong,
  // #62: map a client to a handling professional and/or parent/group company, for
  // reporting "clients per professional / per group". Note this is the CLIENT's
  // free-text "Reference" (#150) — distinct from `professionalUid` below.
  professionalName: optLong,
  // #151: the staff professional this user reports to / is assigned under, picked
  // from the staff directory in the Role & Access section. Empty string clears it.
  professionalUid: z.string().trim().max(128).optional(),
  groupCompany: optLong,
  gstNumber: z.string().trim().max(30).optional(),
  panNumber: z.string().trim().max(20).optional(),
  aadhaarNumber: z.string().trim().max(20).optional(),
  state: optShort,
  emailIds: z.array(email).max(20).optional(),
};

// POST /api/portal/users — role-aware required fields enforced via superRefine.
export const createUserSchema = z
  .object({
    name,
    email,
    phone,
    role,
    ...profileFields,
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.role !== "client" && !val.designation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["designation"], message: "designation is required for staff roles" });
    }
  });

// PATCH /api/portal/users/:uid — everything optional; role handled by controller authz.
export const updateUserSchema = z
  .object({
    name: name.optional(),
    phone: phone.optional(),
    role: role.optional(),
    ...profileFields,
  })
  .strict();

// POST /api/portal/users/:uid/reassign — bulk-move a user's work to another (E09-S04).
export const reassignWorkSchema = z
  .object({
    toUid: z.string().trim().min(1, "toUid is required"),
  })
  .strict();
