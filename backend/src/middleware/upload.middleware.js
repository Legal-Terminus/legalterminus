import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const storage = multer.memoryStorage();

// Only accept image types we actually process with sharp. Rejects everything
// else before the bytes are touched, so non-image / disguised uploads can't
// reach processing or storage.
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error("Only JPEG, PNG, or WebP images are allowed");
    err.status = 400;
    cb(err, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter,
});

export const processImage = async (file) => {
  if (!file) return null;

  const uploadDir = "uploads/blogs";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueName = `blog-${Date.now()}-${Math.floor(
    Math.random() * 1e6
  )}.webp`;

  const outputPath = path.join(uploadDir, uniqueName);

  await sharp(file.buffer)
    .resize(1200)
    .webp({ quality: 80 })
    .toFile(outputPath);

  return uniqueName;
};
