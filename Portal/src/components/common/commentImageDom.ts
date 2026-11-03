import { fetchCommentImageUrl } from '../../api/commentImages';
import { openBlobNative } from '../../lib/native';

/**
 * #122 follow-up — turn an `<img data-lt-image="{id}">` reference into a visible
 * image by fetching its bytes with the viewer's credentials.
 *
 * Shared by RichText (stored comments) and the editor's image node. Returns a
 * cleanup that aborts the fetch and revokes the object URL — call it when the
 * image leaves the screen, or the blob stays in memory for the page's lifetime.
 */
export function placeholderFor(alt?: string | null): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'lt-image-unavailable';
  span.setAttribute('role', 'img');
  span.setAttribute('aria-label', alt ? `Image unavailable: ${alt}` : 'Image unavailable');
  span.textContent = 'Image unavailable';
  return span;
}

export function hydrateCommentImage(
  img: HTMLImageElement,
  taskId: string | null,
  onFail: (img: HTMLImageElement) => void = (el) => el.replaceWith(placeholderFor(el.getAttribute('alt'))),
): () => void {
  const id = img.getAttribute('data-lt-image') ?? '';
  const ctrl = new AbortController();
  let url: string | null = null;
  let disposed = false;

  if (!taskId || !/^[0-9a-f]{32}$/.test(id)) {
    onFail(img);
    return () => {};
  }
  if (!img.getAttribute('alt')) img.setAttribute('alt', 'Image');
  img.setAttribute('loading', 'lazy');
  img.setAttribute('aria-busy', 'true');

  fetchCommentImageUrl(taskId, id, ctrl.signal)
    .then((u) => {
      if (disposed) { URL.revokeObjectURL(u); return; }
      url = u;
      img.src = u;
      img.removeAttribute('aria-busy');
    })
    .catch(() => {
      if (!disposed) onFail(img);
    });

  return () => {
    disposed = true;
    ctrl.abort();
    if (url) URL.revokeObjectURL(url);
  };
}

/** Open an already-loaded image full size in a new tab. */
export function openImageFullSize(img: HTMLImageElement) {
  if (!img.src || !img.src.startsWith('blob:')) return;
  const src = img.src;
  // An Android WebView cannot window.open() a blob: URL, so inside the app hand the
  // image to the phone's own viewer. In a browser openBlobNative returns false and the
  // original new-tab behaviour runs unchanged.
  void (async () => {
    try {
      if (await openBlobNative(await (await fetch(src)).blob(), `image-${Date.now()}`)) return;
    } catch { /* fall through to the browser behaviour */ }
    window.open(src, '_blank', 'noopener,noreferrer');
  })();
}
