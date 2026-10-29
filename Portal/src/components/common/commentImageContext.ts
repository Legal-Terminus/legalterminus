import { createContext, useContext } from 'react';

/**
 * #122 follow-up — the matter whose comment images are being shown or added.
 *
 * Comments and messages render deep inside the matter page (activity rows, step
 * panels, the Discussion thread). Rather than thread a `taskId` prop through each
 * of them, the matter page provides it once; RichText and RichTextEditor read it.
 * Without a provider (or an explicit prop) images show as "Image unavailable" and
 * the editor offers no image upload.
 */
export const CommentImageTaskContext = createContext<string | null>(null);

export const useCommentImageTaskId = (override?: string | null) => {
  const ctx = useContext(CommentImageTaskContext);
  return override ?? ctx;
};
