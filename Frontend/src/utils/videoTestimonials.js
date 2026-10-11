/**
 * Video testimonial sections are hidden until the firm supplies real videos.
 *
 * Every one of these sliders was built with the same four placeholder YouTube
 * ids under clients' names, and they were never replaced. None is a client:
 * two are a well-known joke video, one is YouTube's first upload, one a stock
 * sample. A visitor who presses play sees that under a named person's face —
 * worse than no section at all.
 *
 * To bring a section back: put the real embed links in that component's list
 * and delete its `if (!REAL_VIDEOS_READY) return null;` line. Only flip
 * REAL_VIDEOS_READY itself when EVERY such component has real links.
 */
export const REAL_VIDEOS_READY = false;
