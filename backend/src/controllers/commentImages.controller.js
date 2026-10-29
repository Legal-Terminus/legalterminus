import { db, getBucket } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { clientCanSeeMatter, professionalCanSee } from './tasks.controller.js';
import {
  COMMENT_IMAGES_SUB,
  COMMENT_IMAGE_TYPES,
  canReadCommentImage,
  canUploadCommentImage,
  commentImageObjectPath,
  isImageId,
  newImageId,
  sniffImageType,
} from '../services/commentImages.service.js';
import { WRONG_TYPE_MESSAGE } from '../middleware/commentImageUpload.middleware.js';

/**
 * #122 follow-up — images in step comments and Discussion messages.
 * The storage model and access rules are documented in commentImages.service.js.
 */

const imagesCol = (taskId) => db.collection('tasks').doc(taskId).collection(COMMENT_IMAGES_SUB);

// ─── POST /api/tasks/:taskId/comment-images ───────────────────────────────
// multipart/form-data, one file in field `image`. Returns { imageId }.
export async function uploadCommentImage(req, res) {
  try {
    const { taskId } = req.params;
    const snap = await db.collection('tasks').doc(taskId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    const { role, uid } = req.user;
    const clientCanSee = role === 'client' && clientCanSeeMatter(req.user, task);
    if (!canUploadCommentImage({ role, clientCanSee })) return res.status(403).json({ message: 'Forbidden' });

    const file = req.file;
    if (!file?.buffer?.length) return res.status(400).json({ message: 'Choose an image to add.', code: 'IMAGE_MISSING' });

    // The declared type passed the allow-list; the BYTES must agree. A renamed
    // PDF or HTML file labelled image/png is refused here.
    const contentType = sniffImageType(file.buffer);
    if (!contentType) return res.status(415).json({ message: WRONG_TYPE_MESSAGE, code: 'IMAGE_TYPE' });

    const imageId = newImageId();
    const objectPath = commentImageObjectPath(taskId, imageId, COMMENT_IMAGE_TYPES[contentType]);
    await getBucket().file(objectPath).save(file.buffer, {
      resumable: false,
      contentType,
      metadata: { cacheControl: 'private, no-store' },
    });

    const record = {
      taskId,
      objectPath,
      contentType,
      size: file.buffer.length,
      uploadedBy: uid ?? null,
      uploadedByRole: role ?? null,
      // Fail closed: the image becomes visible to the client only when a comment
      // or message that is shared with the client references it.
      clientVisible: false,
      createdAt: new Date(),
    };
    await imagesCol(taskId).doc(imageId).set(record);
    logger.info({ taskId, imageId, size: record.size, role }, 'comment image uploaded');

    res.status(201).json({ imageId, contentType, size: record.size });
  } catch (err) {
    logger.error({ err }, 'uploadCommentImage error:');
    res.status(500).json({ message: 'The image could not be uploaded. Please try again.' });
  }
}

// ─── GET /api/tasks/:taskId/comment-images/:imageId ───────────────────────
// Streams the bytes through the backend — never a signed URL — after checking
// the caller may see this image (canReadCommentImage). A client asking for an
// internal image gets 404, the same as a missing one: whether an internal image
// exists is itself internal.
export async function getCommentImage(req, res) {
  try {
    const { taskId, imageId } = req.params;
    if (!isImageId(imageId)) return res.status(404).json({ message: 'Image not found' });

    const taskSnap = await db.collection('tasks').doc(taskId).get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Image not found' });
    const task = taskSnap.data();
    const { role, uid } = req.user;

    const imgSnap = await imagesCol(taskId).doc(imageId).get();
    const image = imgSnap.exists ? imgSnap.data() : null;
    const clientCanSee = role === 'client' && clientCanSeeMatter(req.user, task);
    // The same rule as the matter itself, so additional professionals (#181) see its images too.
    const proCanSee = role === 'professional' && professionalCanSee(task, uid);
    if (!image || !canReadCommentImage({ role, uid, task, image, clientCanSee, proCanSee })) {
      // A caller with no access to the MATTER is told so; inside a matter they
      // can see, an image they may not view is indistinguishable from none.
      const seesMatter = role === 'client' ? clientCanSee
        : role === 'professional' ? proCanSee
          : true;
      return seesMatter
        ? res.status(404).json({ message: 'Image not found' })
        : res.status(403).json({ message: 'Forbidden' });
    }

    const file = getBucket().file(image.objectPath);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ message: 'Image not found' });

    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Content-Disposition', 'inline');
    // `private, no-store`: the response is per-user. A shared browser cache keyed
    // only by URL must never hand one login's image to the next.
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const stream = file.createReadStream();
    stream.on('error', (e) => {
      logger.error({ err: e }, 'getCommentImage stream error');
      if (!res.headersSent) res.status(500).json({ message: 'Failed to load the image' });
      else res.destroy();
    });
    stream.pipe(res);
  } catch (err) {
    logger.error({ err }, 'getCommentImage error:');
    if (!res.headersSent) res.status(500).json({ message: 'Failed to load the image' });
  }
}
