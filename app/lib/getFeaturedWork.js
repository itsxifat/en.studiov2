// Server-only by convention: imported only from app/page.js. Do not add the `server-only`
// package (not installed). Uses unstable_cache — still the supported API in Next 15.5; the
// experimental 'use cache' directive is deliberately not used.
import { unstable_cache } from 'next/cache';
import { FEATURED_LIMIT } from './media';

// Nobody waits during `next build`, and a failed build-time fetch is baked into the deployed
// page for up to 300s, so the cold Atlas connect gets the full serverSelectionTimeoutMS (5000)
// plus query budget there. At request time only the single blocking regeneration after an
// admin change waits on this, so 4000ms keeps a dead-DB first request under ~5s.
const timeoutMs = () =>
  process.env.NEXT_PHASE === 'phase-production-build' ? 8000 : 4000;

async function fetchFeatured() {
  // Local dev / build without a DB: intentional empty result.
  if (!process.env.MONGODB_URI) return [];

  // Dynamic imports: dbConnect.js throws at import time when MONGODB_URI is missing,
  // so it must never be a static import of a module that can run without the env var.
  const [{ default: dbConnect }, { default: PortfolioItem }, { default: PhotoProject }] =
    await Promise.all([
      import('./dbConnect'),
      import('../models/portfolioItem'),
      import('../models/photoProject'),
    ]);

  const work = (async () => {
    await dbConnect();
    const [videos, photos] = await Promise.all([
      PortfolioItem.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(FEATURED_LIMIT)
        .select('title category thumbnail youtubeId createdAt')
        .lean(),
      PhotoProject.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(FEATURED_LIMIT)
        .select('title slug thumbnail createdAt')
        .lean(),
    ]);
    const iso = (d) => (d instanceof Date ? d.toISOString() : null);
    return [
      ...videos.map((v) => ({
        _id: String(v._id),
        title: v.title ?? '',
        category: v.category ?? '',
        thumbnail: v.thumbnail ?? null,
        youtubeId: v.youtubeId ?? null,
        slug: null,
        type: 'video',
        createdAt: iso(v.createdAt),
      })),
      ...photos.map((p) => ({
        _id: String(p._id),
        title: p.title ?? '',
        category: 'Photography',
        thumbnail: p.thumbnail ?? null,
        youtubeId: null,
        slug: p.slug ?? null,
        type: 'photoProject',
        createdAt: iso(p.createdAt),
      })),
    ].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  })();

  // Keep a handler on this branch: if the timeout wins the race, a later DB rejection
  // must not become an unhandledRejection (Node >= 15 exits the process on those).
  work.catch(() => {});

  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error('featured-work: timeout')), timeoutMs());
  });

  try {
    // Throws on failure → unstable_cache never caches an empty/failed result.
    return await Promise.race([work, timeout]);
  } finally {
    clearTimeout(t);
  }
}

// Same shape as /api/featured-work (type 'video' | 'photoProject'), fully JSON-serializable
// (string _id, ISO createdAt or null) so it can cross into the client PortfolioSection.
export const getFeaturedWork = unstable_cache(fetchFeatured, ['featured-work'], {
  revalidate: 300,
  tags: ['featured-work'],
});
