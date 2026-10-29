import { Node } from '@tiptap/react';
import { hydrateCommentImage, placeholderFor } from './commentImageDom';

/**
 * #122 follow-up — the editor's image node.
 *
 * Serialises to exactly the form the server keeps: `<img data-lt-image="{id}"
 * alt="…">`, with NO src. In the editor it is shown by fetching the bytes with
 * the viewer's credentials (an object URL that lives only in this tab).
 *
 * Parsing matches only `img[data-lt-image]`, so an image pasted from a website
 * or Word (a plain `<img src>`) is not carried over as a remote/inline image —
 * images enter a comment only by being uploaded to the matter.
 */
export const LtImage = Node.create<{ taskId: string | null }>({
  name: 'ltImage',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { taskId: null };
  },

  addAttributes() {
    return {
      imageId: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-lt-image'),
        renderHTML: (attrs) => ({ 'data-lt-image': attrs.imageId }),
      },
      alt: {
        default: null,
        parseHTML: (el) => el.getAttribute('alt'),
        renderHTML: (attrs) => (attrs.alt ? { alt: attrs.alt } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img[data-lt-image]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },

  // An image is not text: it adds nothing to getText(), so it never counts as words.
  renderText() {
    return '';
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      dom.contentEditable = 'false';
      dom.className = 'inline-block';
      const img = document.createElement('img');
      img.setAttribute('data-lt-image', String(node.attrs.imageId ?? ''));
      if (node.attrs.alt) img.setAttribute('alt', String(node.attrs.alt));
      dom.appendChild(img);
      const cleanup = hydrateCommentImage(img, this.options.taskId, (el) => {
        el.replaceWith(placeholderFor(el.getAttribute('alt')));
      });
      return { dom, destroy: cleanup };
    };
  },
});
