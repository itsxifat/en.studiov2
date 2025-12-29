/**
 * Extract YouTube Video ID from ANY valid YouTube URL
 * Supports:
 * - youtube.com/watch?v=
 * - youtu.be/
 * - youtube.com/shorts/
 * - youtube.com/embed/
 * - m.youtube.com
 */
export function extractYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsedUrl = new URL(url.trim());

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.split('/')[1] || null;
    }

    // youtube.com / m.youtube.com
    if (
      parsedUrl.hostname.includes('youtube.com') ||
      parsedUrl.hostname.includes('m.youtube.com')
    ) {
      // youtube.com/watch?v=VIDEO_ID
      const vParam = parsedUrl.searchParams.get('v');
      if (vParam) return vParam;

      // youtube.com/shorts/VIDEO_ID
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/')[2] || null;
      }

      // youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2] || null;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
