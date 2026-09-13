/**
 * Formats cover image URLs to handle both relative paths from the server
 * and full external URLs.
 */
export function getCoverImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const serverBase = apiBase.replace(/\/api\/?$/, '');
  return `${serverBase}${url.startsWith('/') ? '' : '/'}${url}`;
}
