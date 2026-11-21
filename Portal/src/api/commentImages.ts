import { apiFetch } from './client';
import { auth } from '../lib/firebase';
import { getIdToken } from 'firebase/auth';
import { commentImageDimensionProblem } from '@shared/richText/limits.js';

/**
 * #122 follow-up — images in step comments and Discussion messages.
 *
 * An image is uploaded to the matter once; the comment stores only a reference
 * (`<img data-lt-image="{id}">`, no src). Viewing fetches the bytes through the
 * authenticated backend — never a public or signed link — so every view is
 * checked against the viewer's session.
 */

export const COMMENT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const COMMENT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** A person-readable reason this file can't be added, or null if it can. */
export function commentImageProblem(file: File): string | null {
  if (!(COMMENT_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Only JPEG, PNG or WebP images can be added to a comment.';
  }
  if (file.size > COMMENT_IMAGE_MAX_BYTES) {
    return 'That image is larger than 5 MB. Please use a smaller image or a screenshot of the part you need.';
  }
  return null;
}

/**
 * #319: the image's pixel size, decoded by the browser. null if the browser
 * cannot read it (a corrupt file, or bytes that are not really an image).
 */
export function readImageFileDimensions(file: Blob): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    let url: string;
    try { url = URL.createObjectURL(file); } catch { resolve(null); return; }
    const img = new Image();
    const done = (v: { width: number; height: number } | null) => { URL.revokeObjectURL(url); resolve(v); };
    img.onload = () => done(img.naturalWidth && img.naturalHeight ? { width: img.naturalWidth, height: img.naturalHeight } : null);
    img.onerror = () => done(null);
    img.src = url;
  });
}

/**
 * Every check that can be made before uploading: type and size first (instant),
 * then #319's pixel dimensions. A person-readable reason, or null if the image
 * may be added. The upload endpoint applies the same rules regardless.
 */
export async function checkCommentImage(file: File): Promise<string | null> {
  const problem = commentImageProblem(file);
  if (problem) return problem;
  const dims = await readImageFileDimensions(file);
  return commentImageDimensionProblem(dims?.width ?? 0, dims?.height ?? 0);
}

export async function uploadCommentImage(taskId: string, file: File): Promise<{ imageId: string }> {
  const form = new FormData();
  form.append('image', file, file.name || 'image');
  return apiFetch<{ imageId: string }>(`/api/tasks/${encodeURIComponent(taskId)}/comment-images`, {
    method: 'POST',
    body: form,
  });
}

/**
 * Fetch one image as an object URL. The CALLER owns the URL and must revoke it
 * (URL.revokeObjectURL) when the image leaves the screen.
 */
export async function fetchCommentImageUrl(taskId: string, imageId: string, signal?: AbortSignal): Promise<string> {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;
  const res = await fetch(
    `${base}/api/tasks/${encodeURIComponent(taskId)}/comment-images/${encodeURIComponent(imageId)}`,
    { headers, signal },
  );
  if (!res.ok) throw new Error('Image unavailable');
  return URL.createObjectURL(await res.blob());
}
