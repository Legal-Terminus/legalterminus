/**
 * #122 follow-up — images in step comments and Discussion messages.
 *
 * The security of this feature rests on three pure rules, tested here:
 *   1. the sanitiser lets through ONLY `<img data-lt-image="{id}" alt>` — any
 *      src (remote, data:, anything) removes the whole image;
 *   2. ids are extracted / filtered so a comment can reference only images the
 *      server has bound to it;
 *   3. who may see an image (deny by default; a client only their own uploads
 *      or images shared with them).
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeRichText,
  prepareRichText,
  richTextToPlain,
  countWords,
  COMMENT_IMAGE_LIMIT,
} from '../services/richText.service.js';
import {
  extractImageIds,
  keepImageRefs,
  canReadCommentImage,
  canUploadCommentImage,
  canReferenceCommentImage,
  sniffImageType,
  isImageId,
  newImageId,
  commentImageObjectPath,
} from '../services/commentImages.service.js';

const A = 'a'.repeat(32);
const B = 'b'.repeat(32);
const ref = (id, alt = '') => `<img data-lt-image="${id}"${alt ? ` alt="${alt}"` : ''} />`;

// ── 1. Sanitiser ──────────────────────────────────────────────────────────

test('an image reference survives with exactly data-lt-image and alt', () => {
  const out = sanitizeRichText(`<p>See <img data-lt-image="${A}" alt="Screenshot" class="x" style="width:9999px" onerror="alert(1)" width="10" title="t"></p>`);
  assert.equal(out, `<p>See <img data-lt-image="${A}" alt="Screenshot" /></p>`);
});

test('an <img> with ANY src is removed entirely, even with a valid id', () => {
  for (const src of ['https://evil.test/pixel.png', 'data:image/png;base64,AAAA', '/api/tasks/x/comment-images/y', '']) {
    const out = sanitizeRichText(`<p>x<img src="${src}" data-lt-image="${A}" alt="a">y</p>`);
    assert.equal(out, '<p>xy</p>', `src=${JSON.stringify(src)} must be removed`);
  }
  assert.equal(sanitizeRichText(`<p>x<img srcset="https://e/1.png 1x" data-lt-image="${A}"></p>`), '<p>x</p>');
});

test('an <img> without a well-formed id is removed', () => {
  for (const id of ['', '../../secret', 'A'.repeat(32), 'a'.repeat(31), 'a'.repeat(33), `${A} `, `javascript:${A}`]) {
    assert.equal(sanitizeRichText(`<p>x<img data-lt-image="${id}"></p>`), '<p>x</p>', `id=${id}`);
  }
  assert.equal(sanitizeRichText('<p>x<img alt="no id"></p>'), '<p>x</p>');
});

test('alt text is escaped and clamped', () => {
  const out = sanitizeRichText(`<p><img data-lt-image="${A}" alt="&quot;><script>x</script>"></p>`);
  assert.ok(!out.includes('<script'));
  const long = sanitizeRichText(`<p><img data-lt-image="${A}" alt="${'z'.repeat(500)}"></p>`);
  assert.ok(long.length < 300);
});

test('existing protections still hold alongside images', () => {
  const out = sanitizeRichText(`<p>ok</p><script>alert(1)</script><img src=x onerror=alert(1)>${ref(A)}`);
  assert.equal(out, `<p>ok</p>${ref(A)}`);
});

// ── Plain projection, words and limits ────────────────────────────────────

test('emails / previews show an image as "[image]" — never a link', () => {
  const plain = richTextToPlain(`<p>Please see${ref(A, 'MCA error')}and reply</p>`);
  assert.equal(plain, 'Please see [image] and reply');
  assert.ok(!plain.includes(A));
});

test('an image is not counted as a word', () => {
  assert.equal(countWords(`<p>two words${ref(A)}${ref(B)}</p>`), 2);
});

test('an image-only comment is accepted (not "empty")', () => {
  const out = prepareRichText(`<p>${ref(A)}</p>`);
  assert.equal(out.ok, true);
  assert.equal(out.words, 0);
  assert.ok(richTextToPlain(out.html));
});

test('more than the image limit is refused with a reason', () => {
  const html = `<p>${Array.from({ length: COMMENT_IMAGE_LIMIT + 1 }, () => ref(A)).join('')}</p>`;
  const out = prepareRichText(html, { what: 'message' });
  assert.equal(out.ok, false);
  assert.equal(out.code, 'TOO_MANY_IMAGES');
  assert.match(out.message, /at most 20 images/);
});

// ── 2. Id extraction / binding ────────────────────────────────────────────

test('extractImageIds returns valid ids, de-duplicated, in order', () => {
  const html = `<p>${ref(B)}x${ref(A)}${ref(B)}<img data-lt-image="nope"></p>`;
  assert.deepEqual(extractImageIds(html), [B, A]);
  assert.deepEqual(extractImageIds('<p>no images</p>'), []);
  assert.deepEqual(extractImageIds(''), []);
  assert.deepEqual(extractImageIds(undefined), []);
});

test('keepImageRefs drops references not bound to this matter', () => {
  const html = sanitizeRichText(`<p>a${ref(A)}b${ref(B)}c</p>`);
  assert.equal(keepImageRefs(html, new Set([A])), `<p>a${ref(A)}bc</p>`);
  assert.equal(keepImageRefs(html, []), '<p>abc</p>');
  assert.equal(keepImageRefs('<p>plain</p>', []), '<p>plain</p>');
});

test('ids, object paths and type sniffing', () => {
  const id = newImageId();
  assert.ok(isImageId(id));
  assert.equal(commentImageObjectPath('T1', id, 'png'), `tasks/T1/comment-images/${id}.png`);
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]);
  assert.equal(sniffImageType(png), 'image/png');
  assert.equal(sniffImageType(jpg), 'image/jpeg');
  assert.equal(sniffImageType(webp), 'image/webp');
  assert.equal(sniffImageType(Buffer.from('%PDF-1.7 pretending to be png')), null);
  assert.equal(sniffImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">')), null);
  assert.equal(sniffImageType(Buffer.alloc(3)), null);
});

// ── 3. Access rules ───────────────────────────────────────────────────────

const task = { clientUid: 'c1', professionalUid: 'p1' };
const internal = { uploadedBy: 's1', clientVisible: false };
const shared = { uploadedBy: 's1', clientVisible: true };
const clientOwn = { uploadedBy: 'c1', clientVisible: false };

test('staff read any image of the matter', () => {
  for (const role of ['admin', 'manager', 'team_member']) {
    assert.equal(canReadCommentImage({ role, uid: 's9', task, image: internal }), true);
  }
});

test('a client reads only their own uploads or shared images, on a matter they can see', () => {
  assert.equal(canReadCommentImage({ role: 'client', uid: 'c1', task, image: internal, clientCanSee: true }), false);
  assert.equal(canReadCommentImage({ role: 'client', uid: 'c1', task, image: shared, clientCanSee: true }), true);
  assert.equal(canReadCommentImage({ role: 'client', uid: 'c1', task, image: clientOwn, clientCanSee: true }), true);
  // Another login on the account sees a colleague's upload only once shared.
  assert.equal(canReadCommentImage({ role: 'client', uid: 'c2', task, image: clientOwn, clientCanSee: true }), false);
  // A client of ANOTHER matter: nothing, even a shared image.
  assert.equal(canReadCommentImage({ role: 'client', uid: 'x', task, image: shared, clientCanSee: false }), false);
  // clientCanSee must be literally true (fail closed on undefined).
  assert.equal(canReadCommentImage({ role: 'client', uid: 'c1', task, image: shared }), false);
});

test('a professional reads images only on their own matter', () => {
  assert.equal(canReadCommentImage({ role: 'professional', uid: 'p1', task, image: internal }), true);
  assert.equal(canReadCommentImage({ role: 'professional', uid: 'p2', task, image: shared }), false);
});

test('unknown roles and missing records are refused', () => {
  assert.equal(canReadCommentImage({ role: 'auditor', uid: 's1', task, image: shared }), false);
  assert.equal(canReadCommentImage({ role: undefined, uid: 's1', task, image: shared }), false);
  assert.equal(canReadCommentImage({ role: 'admin', uid: 's1', task, image: null }), false);
  assert.equal(canReadCommentImage({ role: 'admin', uid: 's1', task: null, image: shared }), false);
});

test('upload: staff and a client of the matter; never a professional or stranger', () => {
  assert.equal(canUploadCommentImage({ role: 'team_member' }), true);
  assert.equal(canUploadCommentImage({ role: 'client', clientCanSee: true }), true);
  assert.equal(canUploadCommentImage({ role: 'client', clientCanSee: false }), false);
  assert.equal(canUploadCommentImage({ role: 'professional', clientCanSee: true }), false);
  assert.equal(canUploadCommentImage({ role: 'nobody' }), false);
});

test('a client cannot publish an internal image by quoting its id', () => {
  assert.equal(canReferenceCommentImage({ role: 'client', uid: 'c1', image: internal }), false);
  assert.equal(canReferenceCommentImage({ role: 'client', uid: 'c1', image: clientOwn }), true);
  assert.equal(canReferenceCommentImage({ role: 'client', uid: 'c1', image: shared }), true);
  assert.equal(canReferenceCommentImage({ role: 'manager', uid: 's2', image: clientOwn }), true);
  assert.equal(canReferenceCommentImage({ role: 'admin', uid: 's2', image: null }), false);
});
