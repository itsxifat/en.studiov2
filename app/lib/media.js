// Pure helpers that validate DB-sourced strings before they reach an <img src> or <a href>.
// No imports — safe on the server, in route handlers and in plain node tests.

// Per-collection cap shared by getFeaturedWork (server) and /api/featured-work (client fallback)
// so both paths render the same set.
export const FEATURED_LIMIT = 12;

const YT = /^[A-Za-z0-9_-]{11}$/;
// What /portfolio/photography/[slug] actually serves; the href is encodeURIComponent-ed.
const SLUG = /^[a-z0-9][a-z0-9._-]{0,118}$/;
const MAX_URL = 512;
// Cloudinary delivery path: /<cloud_name>/image/upload/<transformations?>/<version?>/<public_id>
const CLOUDINARY_PATH = /^\/([A-Za-z0-9_-]+)\/image\/upload\/(.+)$/;
const HERO_TRANSFORM = "f_auto,q_auto,c_fill,g_auto,b_black,w_160,h_100";

export const isYoutubeId = (id) => typeof id === "string" && YT.test(id);

export const isSlug = (sl) => typeof sl === "string" && SLUG.test(sl);

// Parse-then-match: the WHATWG parser collapses "..", "%2e%2e" and backslashes before we
// look at the pathname, so dot-segment tricks cannot reach another delivery type.
function parseCloudinaryImage(u) {
  if (typeof u !== "string" || u.length > MAX_URL || /\s/.test(u)) return null;
  let url;
  try {
    url = new URL(u);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return null;
  if (url.search || url.hash || url.username || url.password) return null;
  const m = CLOUDINARY_PATH.exec(url.pathname);
  if (!m) return null;
  const segments = m[2].split("/").filter(Boolean);
  if (segments.length === 0) return null;
  return { cloud: m[1], segments };
}

export const isCloudinaryImage = (u) => parseCloudinaryImage(u) !== null;

// 160x100 fill (2x of the 80x50 well). The hero transform is inserted as the LAST
// transformation component — just before the v<digits> version segment when present,
// otherwise after any comma-bearing transformation segments — so an existing admin crop
// cannot re-scale the result. The URL is rebuilt from the parsed path, never the raw string.
export function cloudinaryThumb(u) {
  const parsed = parseCloudinaryImage(u);
  if (!parsed) return null;
  const segs = [...parsed.segments];
  let at = segs.findIndex((s) => /^v\d+$/.test(s));
  if (at < 0) {
    at = 0;
    while (at < segs.length - 1 && segs[at].includes(",")) at++;
  }
  segs.splice(at, 0, HERO_TRANSFORM);
  return `https://res.cloudinary.com/${parsed.cloud}/image/upload/${segs.join("/")}`;
}

// Precedence: valid youtubeId → mqdefault.jpg (always exists, 320x180);
// else a valid Cloudinary image URL with the hero transform; else null (item dropped).
export function thumbSrc(item) {
  if (isYoutubeId(item?.youtubeId)) {
    return `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`;
  }
  return cloudinaryThumb(item?.thumbnail);
}

export function itemHref(item) {
  if (item?.type === "video") return "/portfolio";
  if (item?.type === "photoProject" && isSlug(item.slug)) {
    return `/portfolio/photography/${encodeURIComponent(item.slug)}`;
  }
  return null;
}

// Returns [{ id, n, title, href, src, origin }], input order preserved, capped at `max`.
export function toHeroItems(items, max = 5) {
  const out = [];
  for (const item of Array.isArray(items) ? items : []) {
    const src = thumbSrc(item);
    const href = itemHref(item);
    if (!src || !href) continue;
    const n = String(out.length + 1).padStart(2, "0");
    const title =
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim().slice(0, 120)
        : `Project ${n}`;
    out.push({ id: String(item._id ?? n), n, title, href, src, origin: new URL(src).origin });
    if (out.length >= max) break;
  }
  return out;
}
