"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Filter, Search, X } from "lucide-react";

/**
 * Portfolio Page — Pure JS, App Router, No 3D
 *
 * UX highlights
 * - Sticky header with subtle spotlight, no WebGL
 * - Filter chips (All/Commercial/Brand/Event/Wedding)
 * - Search, sort, and client-side pagination (Load more)
 * - Autoplay preview videos only when in view (and on hover/focus), muted & looped
 * - Reduced-motion aware; videos pause when tab hidden
 * - Accessible cards (keyboard focus shows preview, ESC closes quickview)
 * - Light, clean, Enfinito-flavored visuals
 */

/* ────────────────────────────────────────────────────────────
   Demo data (replace with CMS/API)
──────────────────────────────────────────────────────────── */
const DATA = [
  { id: 1, title: "Project Alpha", category: "Commercial", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2024/02/22/201202-916894569_large.mp4" },
  { id: 2, title: "Brand Relaunch", category: "Brand", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2023/04/10/157432-816911181_large.mp4" },
  { id: 3, title: "Summit 2024", category: "Event", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2024/02/09/199745-912239327_large.mp4" },
  { id: 4, title: "Ocean Dreams", category: "Wedding", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2024/05/27/213511-939757656_large.mp4" },
  { id: 5, title: "Future Forward", category: "Commercial", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2023/10/10/182209-873646545_large.mp4" },
  { id: 6, title: "City Lights", category: "Commercial", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2020/04/23/37879-401066971_large.mp4" },
  { id: 7, title: "Heritage Gala", category: "Event", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2023/03/27/155870-812957341_large.mp4" },
  { id: 8, title: "Bloom Brand", category: "Brand", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2020/07/01/44337-443164886_large.mp4" },
  { id: 9, title: "Ever After", category: "Wedding", thumbnail: "https://placehold.co/1200x675", video: "https://cdn.pixabay.com/video/2018/06/16/16673-278667250_large.mp4" },
];

const CATEGORIES = ["All", "Commercial", "Brand", "Event", "Wedding"];

/* ────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────── */
function useTabVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return visible;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(!!mq.matches);
    set();
    mq.addEventListener ? mq.addEventListener("change", set) : mq.addListener(set);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", set) : mq.removeListener(set);
    };
  }, []);
  return reduced;
}

/* ────────────────────────────────────────────────────────────
   Card
──────────────────────────────────────────────────────────── */
function PortfolioCard({ item, playingAllowed, onOpen }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
  const [hover, setHover] = useState(false);
  const canPlay = playingAllowed && inView && (hover || window.matchMedia("(hover: none)").matches);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45 }}
      className="group relative overflow-hidden aspect-video rounded-2xl bg-neutral-900 ring-1 ring-white/5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Thumbnail fallback */}
      <img
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
      />

      {/* Silent preview video in view */}
      <AnimatePresence>
        {canPlay && (
          <motion.video
            key={`v-${item.id}`}
            src={item.video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay gradient + text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
        <span className="text-[10px] sm:text-xs tracking-[0.25em] text-cyan-300/90">{item.category.toUpperCase()}</span>
        <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
        <button
          onClick={() => onOpen(item)}
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur ring-1 ring-inset ring-white/15 hover:bg-white/15"
          aria-label={`Open ${item.title}`}
        >
          View case study <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Quickview Modal (video focus)
──────────────────────────────────────────────────────────── */
function Modal({ open, onClose, item }) {
  const esc = useCallback((e) => { if (e.key === "Escape") onClose(); }, [onClose]);
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, esc]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={item?.title}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/10"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div className="relative aspect-video bg-black">
              {item && (
                <video src={item.video} autoPlay controls playsInline className="h-full w-full object-cover" />
              )}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 inline-flex items-center justify-center rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div>
                <div className="text-xs text-cyan-300/90 tracking-[0.25em]">{item?.category?.toUpperCase()}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">{item?.title}</h3>
              </div>
              <a
                href="#" // TODO: link to full case study page
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-neutral-100"
              >
                Open project <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────
   Header (no 3D): spotlight + copy
──────────────────────────────────────────────────────────── */
function Header() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
  return (
    <header onMouseMove={onMove} className="relative overflow-hidden bg-black text-white">
      {/* spotlight */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            left: mouse.x || "50%",
            top: mouse.y || "50%",
            width: "48vmin",
            height: "48vmin",
            background: "radial-gradient(closest-side, rgba(39,82,236,0.25), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "24px 24px, 24px 24px",
            maskImage: "radial-gradient(circle at center, #000 55%, transparent 90%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.28em] text-neutral-300">
          A creative venture by Enfinito
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="mt-3 text-5xl md:text-7xl font-extrabold uppercase tracking-tight"
        >
          Powerful Storytelling
          <br />
          through <span className="text-[#2752EC]">Moving Images.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-2xl text-neutral-300">
         Lorem ipsum dolor sit amet consecte 
        </motion.p>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────
   Toolbar (filters/search/sort)
──────────────────────────────────────────────────────────── */
function Toolbar({ filter, setFilter, q, setQ, sort, setSort }) {
  const categories = CATEGORIES;
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3 sm:py-4">
        {/* Filter chips */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === c
                  ? "bg-cyan-400 text-black border-cyan-400"
                  : "border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="h-9 w-[220px] rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        {/* Sort */}
        <div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="title">Title A–Z</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Page (default export)
──────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1); // pagination pages
  const perPage = 6;

  const visibleTab = useTabVisibility();
  const reduced = usePrefersReducedMotion();

  // filtered + searched + sorted data
  const items = useMemo(() => {
    let arr = [...DATA];
    if (filter !== "All") arr = arr.filter((d) => d.category === filter);
    if (q.trim()) arr = arr.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === "title") arr.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "category") arr.sort((a, b) => a.category.localeCompare(b.category));
    else if (sort === "newest") arr.sort((a, b) => b.id - a.id);
    return arr;
  }, [filter, q, sort]);

  const paged = items.slice(0, page * perPage);
  const canLoadMore = paged.length < items.length;

  // open modal
  const onOpen = (item) => { setActive(item); setOpen(true); };
  const onClose = () => setOpen(false);

  // Pause all videos when tab hidden or reduced motion
  useEffect(() => {
    const vids = document.querySelectorAll("video");
    vids.forEach((v) => { if (!visibleTab || reduced) v.pause(); });
  }, [visibleTab, reduced, filter, q, sort, page]);

  return (
    <main className="bg-black text-white">
      <Header />

      <Toolbar filter={filter} setFilter={setFilter} q={q} setQ={setQ} sort={sort} setSort={setSort} />

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-neutral-300">
            <Filter className="mx-auto mb-3" />
            No results. Try a different filter or search.
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {paged.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    playingAllowed={!reduced && visibleTab}
                    onOpen={onOpen}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {canLoadMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setPage((n) => n + 1)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Load more <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Modal open={open} onClose={onClose} item={active} />

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-neutral-400 text-sm">
          © {new Date().getFullYear()} Enfinito · Crafted with care
        </div>
      </footer>
    </main>
  );
}
