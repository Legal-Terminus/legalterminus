import multer from 'multer';
import { COMMENT_IMAGE_MAX_BYTES, COMMENT_IMAGE_TYPES } from '../services/commentImages.service.js';

/**
 * #122 follow-up — multipart parser for ONE comment image.
 *
 * Memory storage (the bytes go straight to the bucket), a mimetype allow-list
 * (JPEG/PNG/WebP) and a 5 MB cap, both enforced before the controller runs. The
 * declared type is only a first filter: the controller re-checks the real type
 * from the file's magic bytes.
 *
 * multer's own errors are turned into messages a person can act on here, rather
 * than reaching the global handler as "File too large" / a 500.
 */
const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: COMMENT_IMAGE_MAX_BYTES, files: 1, fields: 5, parts: 6 },
  fileFilter: (req, file, cb) => {
    if (Object.hasOwn(COMMENT_IMAGE_TYPES, file.mimetype)) return cb(null, true);
    const err = new Error('UNSUPPORTED_TYPE');
    err.code = 'UNSUPPORTED_TYPE';
    return cb(err, false);
  },
}).single('image');

export const TOO_LARGE_MESSAGE = 'That image is larger than 5 MB. Please use a smaller image or a screenshot of the part you need.';
export const WRONG_TYPE_MESSAGE = 'Only JPEG, PNG or WebP images can be added to a comment.';

export function commentImageUpload(req, res, next) {
  parser(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: TOO_LARGE_MESSAGE, code: 'IMAGE_TOO_LARGE' });
    }
    if (err.code === 'UNSUPPORTED_TYPE') {
      return res.status(415).json({ message: WRONG_TYPE_MESSAGE, code: 'IMAGE_TYPE' });
    }
    // Malformed multipart, too many files/fields, etc.
    return res.status(400).json({ message: 'The image could not be read. Please try again.', code: 'IMAGE_UPLOAD_INVALID' });
  });
}
