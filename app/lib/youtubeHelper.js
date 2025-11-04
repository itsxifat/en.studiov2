// This regex is a robust version to find a YouTube ID from various URL formats
const YOUTUBE_ID_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

/**
 * Extracts a YouTube Video ID from a URL.
 * @param {string} url The YouTube URL
 * @returns {string | null} The 11-character Video ID or null if not found.
 */
export function extractYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  const match = trimmedUrl.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}