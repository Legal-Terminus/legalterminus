import { Router } from 'express';
import multer from 'multer';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  recordCreateSchema, recordPatchSchema, columnsSchema, importSchema, recordListQuerySchema, matterQuerySchema,
} from '../schemas/worksheet.schema.js';
import {
  getModule, listRecords, createRecord, updateRecord, deleteRecord, putColumns, importRows, matterOptions,
  uploadImage, getImage, deleteImage,
} from '../controllers/worksheets.controller.js';

/**
 * #210 Trademark Reports — the worksheet engine's router.
 *
 * Access (firm, 29 Oct 2026): admins, managers and team members all view AND
 * edit. Changing columns and deleting a record are the admin's. Clients and
 * professionals never reach any of it — the role guard is on the router, so
 * nothing below runs for them.
 */
const router = Router();
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

// Logos: images only, 2 MB, held in memory just long enough to re-encode.
const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/webp']);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => (ALLOWED_IMAGE.has(file.mimetype)
    ? cb(null, true)
    : cb(Object.assign(new Error('Only JPEG, PNG or WebP images can be added.'), { status: 400 }))),
});
const singleImage = (req, res, next) => imageUpload.single('file')(req, res, (err) => {
  if (!err) return next();
  const message = err.code === 'LIMIT_FILE_SIZE' ? 'The image must be 2 MB or smaller.'
    : err.status === 400 ? err.message : 'The image could not be uploaded.';
  return res.status(400).json({ message });
});

router.get('/modules/:module', getModule);

router.get('/sheets/:sheet/records', validate(recordListQuerySchema, 'query'), listRecords);
router.post('/sheets/:sheet/records', validate(recordCreateSchema), createRecord);
router.patch('/sheets/:sheet/records/:id', validate(recordPatchSchema), updateRecord);
router.delete('/sheets/:sheet/records/:id', requireRole('admin'), deleteRecord);

router.put('/sheets/:sheet/columns', requireRole('admin'), validate(columnsSchema), putColumns);
router.post('/sheets/:sheet/import', validate(importSchema), importRows);
router.get('/sheets/:sheet/matters', validate(matterQuerySchema, 'query'), matterOptions);

router.post('/sheets/:sheet/records/:id/images/:field', singleImage, uploadImage);
router.get('/sheets/:sheet/records/:id/images/:field', getImage);
router.delete('/sheets/:sheet/records/:id/images/:field', deleteImage);

export default router;
