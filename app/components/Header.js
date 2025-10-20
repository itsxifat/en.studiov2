"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/* FX helpers */
function ensurePageTransitionLayer() {
  let layer = document.getElementById("nav-page-transition");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.id = "nav-page-transition";
  Object.assign(layer.style, {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 80000,
    opacity: 0,
    background:
      "linear-gradient(110deg, rgba(83,164,219,0.12), rgba(34,211,238,0.08), rgba(83,164,219,0.12))",
    mixBlendMode: "screen",
  });
  document.body.appendChild(layer);
  return layer;
}

function spawnRippleStack(x, y) {
  const make = (size, col, blur = 0, dur = 0.75) => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: "14px",
      height: "14px",
      borderRadius: "9999px",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 79999,
      background: col,
      filter: `blur(${blur}px)`,
      opacity: 0.9,
      mixBlendMode: "screen",
    });
    document.body.appendChild(el);
    gsap.to(el, {
      width: size,
      height: size,
      opacity: 0,
      duration: dur,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  };
  make("480px", "rgba(83,164,219,0.50)", 0, 0.72);
  make("540px", "rgba(34,211,238,0.42)", 2, 0.8);
  make("600px", "rgba(183,148,244,0.32)", 4, 0.88);
}

function spawnSparks(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    const ang = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 54 + Math.random() * 72;
    const size = 2 + Math.random() * 3;
    Object.assign(s.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "9999px",
      background: i % 2 ? "rgba(83,164,219,0.9)" : "rgba(34,211,238,0.9)",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 79998,
      boxShadow: "0 0 10px rgba(83,164,219,0.7)",
    });
    document.body.appendChild(s);
    gsap
      .timeline({ onComplete: () => s.remove() })
      .to(s, {
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
        opacity: 1,
        duration: 0.34,
        ease: "power3.out",
      })
      .to(s, { opacity: 0, y: "+=10", duration: 0.34, ease: "power2.in" });
  }
}

function sweepPageFlash() {
  const layer = ensurePageTransitionLayer();
  gsap
    .timeline()
    .to(layer, { opacity: 0.8, duration: 0.14, ease: "power2.out" })
    .to(layer, { opacity: 0, duration: 0.28, ease: "power2.in" });
}

function chromaticPulse(el) {
  const halo = document.createElement("div");
  Object.assign(halo.style, {
    position: "absolute",
    inset: "-6px",
    borderRadius: "16px",
    pointerEvents: "none",
    zIndex: 4,
    opacity: 0,
    background:
      "conic-gradient(from 0deg, rgba(83,164,219,0.35), rgba(34,211,238,0.25), rgba(183,148,244,0.25), rgba(83,164,219,0.35))",
    filter: "blur(8px)",
  });
  el.appendChild(halo);
  gsap
    .timeline({ onComplete: () => halo.remove() })
    .to(halo, { opacity: 1, duration: 0.08, ease: "power2.out" })
    .to(halo, { rotation: 120, duration: 0.45, ease: "power2.out" }, 0)
    .to(halo, { opacity: 0, duration: 0.28, ease: "power2.in" }, 0.22);
}

/* COMPONENT */
const Header = () => {
  const headerRef = useRef(null);
  const glassRef = useRef(null);
  const brandRef = useRef(null);
  const navRef = useRef(null);
  const underlineRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* mount + scroll */
  useEffect(() => {
    setLoaded(true);
    const hdr = headerRef.current;
    const glass = glassRef.current;

    gsap.set(hdr, { y: -20, opacity: 0 });
    gsap.to(hdr, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });

    const onScroll = () => {
      const y = window.scrollY || 0;
      const t = Math.min(y / 120, 1);
      const h = window.innerWidth >= 768 ? 96 - 8 * t : 80 - 8 * t;
      if (glass) glass.style.height = `${h}px`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* brand micro-tilt */
  useEffect(() => {
    const el = brandRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      gsap.to(el, {
        rotationX: dy * -6,
        rotationY: dx * 6,
        transformPerspective: 600,
        transformOrigin: "center",
        duration: 0.22,
        ease: "power3.out",
      });
    };
    const onLeave = () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.35, ease: "power3.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* underline follower (1px) */
  useEffect(() => {
    const nav = navRef.current;
    const underline = underlineRef.current;
    if (!nav || !underline) return;

    const links = Array.from(nav.querySelectorAll("a"));
    const moveUnderline = (el) => {
      const r = el.getBoundingClientRect();
      const parent = nav.getBoundingClientRect();
      const x = r.left - parent.left;
      gsap.to(underline, {
        x,
        width: r.width,
        opacity: 1,
        duration: 0.28,
        ease: "power3.out",
      });
    };
    const onEnter = (e) => moveUnderline(e.currentTarget);
    const onLeave = () => gsap.to(underline, { opacity: 0, duration: 0.2, ease: "power2.out" });

    links.forEach((a) => {
      a.addEventListener("mouseenter", onEnter);
      a.addEventListener("mouseleave", onLeave);
      a.addEventListener("focus", onEnter);
      a.addEventListener("blur", onLeave);
    });
    return () => {
      links.forEach((a) => {
        a.removeEventListener("mouseenter", onEnter);
        a.removeEventListener("mouseleave", onLeave);
        a.removeEventListener("focus", onEnter);
        a.removeEventListener("blur", onLeave);
      });
    };
  }, [loaded]);

  /* tilt effect */
  const tiltGlassToward = (x, y) => {
    const g = glassRef.current;
    if (!g) return;
    const r = g.getBoundingClientRect();
    const dx = (x - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (y - (r.top + r.height / 2)) / (r.height / 2);
    gsap.to(g, {
      rotationX: dy * -3,
      rotationY: dx * 3,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => gsap.to(g, { rotationX: 0, rotationY: 0, duration: 0.45, ease: "elastic.out(1,0.4)" }),
    });
  };

  /* click interactions */
  const onInteractiveClick = useCallback((e) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(22);
    const { clientX: x, clientY: y } = e;
    const el = e.currentTarget;

    gsap
      .timeline()
      .to(el, { y: 1, scale: 0.98, duration: 0.08, ease: "power2.in" }, 0)
      .to(el, { y: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }, 0.08);
    chromaticPulse(el);

    spawnRippleStack(x, y);
    spawnSparks(x, y, 14);
    sweepPageFlash();
    tiltGlassToward(x, y);
  }, []);

  /* mobile menu */
  const backdropRef = useRef(null);
  const sheetRef = useRef(null);
  const listRef = useRef(null);

  const openMenu = (e) => {
    onInteractiveClick(e);
    setMenuOpen(true);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(
          sheetRef.current,
          { yPercent: -6, opacity: 0, scale: 0.98 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.36 },
          0.05
        )
        .fromTo(listRef.current?.children || [], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, stagger: 0.06 }, 0.12);
    });
  };

  const closeMenu = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setMenuOpen(false);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      },
    });
    tl.to(listRef.current?.children || [], { y: 8, opacity: 0, duration: 0.18, stagger: -0.05 })
      .to(sheetRef.current, { yPercent: -6, opacity: 0, scale: 0.98, duration: 0.26 }, 0)
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, 0);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <header ref={headerRef} className="fixed -top-1 left-0 w-full z-[500] text-white" aria-label="Main navigation">
      {/* header container - pure transparent */}
      <div
        ref={glassRef}
        className="
          mx-auto max-w-7xl px-4 sm:px-6
          h-10 md:h-15
          flex items-center
          rounded-2xl
          relative
          transition-[height] duration-200
        "
        style={{
          background: "transparent",
        }}
      >
        {/* Brand */}
        <a
          ref={brandRef}
          href="/"
          onClick={onInteractiveClick}
          className="select-none active:opacity-90 relative z-10 block"
          aria-label="Go to home"
        >
          <img 
            src="/logo.png" 
            alt="En.Studio Logo" 
            className="h-8 sm:h-10 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav
          ref={navRef}
          className="ml-auto hidden md:flex items-center gap-8 uppercase text-xs tracking-[0.18em] relative z-10"
        >
          <span
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-px bg-white/70 rounded-full"
            style={{ width: 0, opacity: 0, transform: "translateX(0px)" }}
          />
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={onInteractiveClick}
              className="relative py-2 text-white/90 hover:text-white transition-colors"
            >
              <span className="relative z-10">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile menu icon */}
        <button
          onClick={(e) => (menuOpen ? closeMenu() : openMenu(e))}
          className="ml-auto md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg
                     bg-white/5 hover:bg-white/10 border border-white/10 transition-transform active:scale-95 relative z-10"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <div className="relative w-5 h-5">
            <span className={`absolute left-0 right-0 top-[3px] h-[2px] bg-white/90 transition-transform duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 right-0 top-[9px] h-[2px] bg-white/90 transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 right-0 top-[15px] h-[2px] bg-white/90 transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU MODAL */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[600]" role="dialog" aria-modal="true">
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/50"
            onClick={closeMenu}
          />
          <div
            ref={sheetRef}
            className="
              absolute left-1/2 top-6 w-[92vw] max-w-sm -translate-x-1/2
              rounded-2xl border border-white/10
              bg-white/6
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              p-5
            "
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 1px 0 rgba(255,255,255,0.05)",
              background: "linear-gradient(180deg, rgba(12,18,28,0.85), rgba(12,18,28,0.78))",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold tracking-wide">Menu</span>
              <button
                onClick={closeMenu}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M18 6l-12 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <ul ref={listRef} className="mt-2 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      onInteractiveClick(e);
                      closeMenu();
                    }}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <span className="uppercase tracking-[0.14em] text-[12px] text-white/90">{l.label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-80 group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href="#contact"
                onClick={(e) => {
                  onInteractiveClick(e);
                  closeMenu();
                }}
                className="rounded-xl px-4 py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-semibold text-sm"
              >
                Get a Quote
              </a>
              <a
                href="#work"
                onClick={(e) => {
                  onInteractiveClick(e);
                  closeMenu();
                }}
                className="rounded-xl px-4 py-3 text-center bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-sm"
              >
                View Work
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;