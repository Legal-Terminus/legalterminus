import { randomUUID } from 'crypto';
import sanitizeHtml from 'sanitize-html';
import { RICH_TEXT_OPTIONS, IMAGE_ID_RE } from './richText.service.js';

/**
 * #122 (follow-up) — images in step comments and Discussion messages.
 *
 * An image is NEVER inlined into the comment (base64 would blow the 1 MB
 * Firestore document limit, bloat every email and escape the auth model). It is
 * uploaded once, stored in the bucket, and the comment carries only a REFERENCE:
 *
 *     <img data-lt-image="{imageId}" alt="…">
 *
 * There is no `src`. The Portal resolves each reference with an authenticated
 * fetch, so every view is checked against the caller's live session — a plain
 * <img src> could not authenticate itself, and a signed URL would be replayable.
 *
 * Storage:
 *   • Bytes    → bucket `tasks/{taskId}/comment-images/{imageId}.{ext}`
 *   • Metadata → Firestore `tasks/{taskId}/commentImages/{imageId}`
 *
 * Everything below the I/O helpers is pure so the security rules are unit-tested
 * without Firestore.
 */

export const COMMENT_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const COMMENT_IMAGE_TYPES = Object.freeze({
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
});
export { IMAGE_ID_RE };
export const COMMENT_IMAGES_SUB = 'commentImages';

export const newImageId = () => randomUUID().replace(/-/g, '');
export const isImageId = (s) => typeof s === 'string' && IMAGE_ID_RE.test(s);
export const commentImageObjectPath = (taskId, imageId, ext) => `tasks/${taskId}/comment-images/${imageId}.${ext}`;

/**
 * The real type of the bytes, read from their magic numbers. The multipart
 * Content-Type is whatever the browser (or an attacker) said; this is what the
 * file IS. Returns null for anything that is not JPEG, PNG or WebP.
 */
export function sniffImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
    && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) return 'image/png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

/** Image ids referenced by (sanitised) rich text, de-duplicated, in order. */
export function extractImageIds(html) {
  if (typeof html !== 'string' || !html.includes('data-lt-image')) return [];
  const ids = [];
  sanitizeHtml(html, {
    allowedTags: ['img'],
    allowedAttributes: { img: ['data-lt-image'] },
    exclusiveFilter: (frame) => {
      const id = frame.tag === 'img' ? frame.attribs['data-lt-image'] : null;
      if (isImageId(id) && !ids.includes(id)) ids.push(id);
      return false;
    },
  });
  return ids;
}

/**
 * Drop every image reference whose id is not in `keep`. Used when a comment is
 * saved: references to images of ANOTHER matter, or that the author may not
 * use, are removed from the stored content rather than trusted.
 */
export function keepImageRefs(html, keep) {
  if (typeof html !== 'string' || !html.includes('data-lt-image')) return html;
  const allowed = keep instanceof Set ? keep : new Set(keep ?? []);
  return sanitizeHtml(html, {
    ...RICH_TEXT_OPTIONS,
    exclusiveFilter: (frame) => frame.tag === 'img' && !allowed.has(frame.attribs['data-lt-image']),
  });
}

const STAFF = new Set(['admin', 'manager', 'team_member']);

/**
 * May this caller add an image to this matter? Staff on any matter; a client on
 * a matter they can see (primary, additional login or listed contact — the
 * caller passes the result of clientCanSeeMatter). Professionals are view-only.
 */
export function canUploadCommentImage({ role, clientCanSee = false }) {
  if (STAFF.has(role)) return true;
  if (role === 'client') return clientCanSee === true;
  return false;
}

/**
 * May this caller SEE this image? Deny by default.
 *  • Staff: any matter's images.
 *  • Professional: only on the matter they are the professional on (they read
 *    the whole discussion and activity, internal notes included).
 *  • Client: on a matter they can see, and only an image they uploaded or one
 *    that sits in a comment/message shared with the client (`clientVisible`).
 */
export function canReadCommentImage({ role, uid, task, image, clientCanSee = false }) {
  if (!task || !image) return false;
  if (STAFF.has(role)) return true;
  if (role === 'professional') return !!uid && task.professionalUid === uid;
  if (role === 'client') {
    if (clientCanSee !== true) return false;
    return (!!uid && image.uploadedBy === uid) || image.clientVisible === true;
  }
  return false;
}

/**
 * May this author put a reference to this image in their comment? Staff may use
 * any image of the matter. A client may use only their own uploads or images
 * already shared with the client — otherwise a client who learned an internal
 * image's id could publish it to themselves by quoting it in a comment.
 */
export function canReferenceCommentImage({ role, uid, image }) {
  if (!image) return false;
  if (STAFF.has(role)) return true;
  if (role === 'client') return (!!uid && image.uploadedBy === uid) || image.clientVisible === true;
  return false;
}

// ─── I/O helpers (Firestore) ──────────────────────────────────────────────

const imagesCol = (db, taskId) => db.collection('tasks').doc(taskId).collection(COMMENT_IMAGES_SUB);

/**
 * Bind a comment's image references to this matter before it is stored.
 * Returns `{ html, ids }`: the content with every reference the author may not
 * use removed (unknown ids, another matter's ids, internal images quoted by a
 * client), and the ids that remain.
 */
export async function resolveCommentImages(db, taskId, html, { role, uid }) {
  const ids = extractImageIds(html);
  if (!ids.length) return { html, ids: [] };
  const snaps = await Promise.all(ids.map((id) => imagesCol(db, taskId).doc(id).get()));
  const keep = ids.filter((id, i) => snaps[i].exists && canReferenceCommentImage({ role, uid, image: snaps[i].data() }));
  return { html: keep.length === ids.length ? html : keepImageRefs(html, keep), ids: keep };
}

/** A comment/message shared with the client shares its images with them too. */
export async function shareCommentImages(db, taskId, ids) {
  if (!ids?.length) return;
  const batch = db.batch();
  for (const id of ids) batch.set(imagesCol(db, taskId).doc(id), { clientVisible: true }, { merge: true });
  await batch.commit();
}
