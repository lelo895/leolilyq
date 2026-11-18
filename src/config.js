// Configuration for media CDN / Cloudflare R2
// In development, defaults to local '/images'.
// In production on Vercel, set VITE_MEDIA_BASE_URL to your Cloudflare R2 custom domain or CDN URL,
// e.g. https://media.yourdomain.com/images
export const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE_URL || '/images').replace(/\/+$/, '');
