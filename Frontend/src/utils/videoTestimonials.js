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

/**
 * The Media page's "Media Coverage" grid: six videos under TV channel names,
 * none of which is that channel's coverage of the firm (same placeholders, plus
 * two music videos). Hidden until the real coverage links are supplied — put
 * them in `mediaCoverage` in Pages/Media/Media.jsx, then set this to true.
 */
export const REAL_MEDIA_COVERAGE_READY = false;

/**
 * The "Watch our process" video (ProcessSection). Its default link is the same
 * placeholder. With this false the two play buttons are not shown and the video
 * cannot be opened; the section's text and steps stay. Pass a real `videoSrc`
 * (or change the default) and set this to true.
 */
export const REAL_PROCESS_VIDEO_READY = false;

