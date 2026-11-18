/**
 * Generate a full URL for images stored in Laravel's public storage.
 *
 * @param {string|null} path - The image path from the database
 * @returns {string|null} The full image URL, or null if no path provided
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // VITE_API_URL is the single source of truth for the deployed API. The
  // previous VITE_API_BASE_URL name was never configured on Railway, so the
  // production bundle fell back to localhost for every relative image path.
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  // Remove leading slashes or redundant storage/ prefixes if present
  const cleanPath = path.replace(/^\/?(storage\/|public\/)?/, '');
  return `${baseUrl}/storage/${cleanPath}`;
};

/**
 * Construct the full image URL for achievement thumbnails.
 * Handles various API response key formats and path structures.
 *
 * @param {Object} item - The achievement item from the API
 * @returns {string|null} The full thumbnail URL, or null if no image
 */
export const getAchievementThumbnail = (item) => {
  // Extract image path/filename from API response keys
  const imageValue = item?.thumbnail || item?.image || item?.thumbnail_url || item?.image_path;
  if (!imageValue) return null;

  // If it's already a full HTTP URL, return it
  if (imageValue.startsWith('http')) return imageValue;

  // Extract filename if it contains a path
  const filename = imageValue.split('/').pop().split('\\').pop();

  // Construct the full URL using Laravel's public storage link
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  return `${baseUrl}/storage/achievements/${filename}`;
};

/**
 * Convert a standard Google Drive share/view link into a direct download URL
 * that bypasses the "Google Drive can't scan this file for viruses" warning.
 *
 * Example:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   → https://drive.usercontent.google.com/download?id=FILE_ID&export=download&confirm=t
 *
 * @param {string} url - The URL stored in the database file_path column
 * @returns {string} The direct download URL, or the original URL if not a Drive link
 */
export const getDirectDownloadUrl = (url) => {
  if (!url) return '#';

  // Extract File ID from standard view links, uc links, or any Drive URL
  const match = url.match(/[-\w]{25,}/);
  if (match) {
    const fileId = match[0];
    // Bypass Google Drive Virus Warning screen using confirm=t
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  }

  return url; // Return as is if already formatted or external link
};
