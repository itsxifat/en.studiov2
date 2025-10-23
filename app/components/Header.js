"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const headerRef = useRef(null);
  const glassRef = useRef(null);
  const brandRef = useRef(null);
  const navRef = useRef(null);
  const underlineRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const onLeave = () =>
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.35, ease: "power3.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

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
    const onLeave = () =>
      gsap.to(underline, { opacity: 0, duration: 0.2, ease: "power2.out" });

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

  const backdropRef = useRef(null);
  const sheetRef = useRef(null);
  const listRef = useRef(null);

  const openMenu = () => {
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
        .fromTo(
          listRef.current?.children || [],
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.32, stagger: 0.06 },
          0.12
        );
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
    <header
      ref={headerRef}
      className="fixed -top-1 left-0 w-full z-[500] text-white"
      aria-label="Main navigation"
    >
      <div
        ref={glassRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 h-10 md:h-15 flex items-center rounded-2xl relative transition-[height] duration-200"
        style={{ background: "transparent" }}
      >
        {/* Brand */}
        <Link
          ref={brandRef}
          href="/"
          className="select-none active:opacity-90 relative z-10 block"
          aria-label="Go to home"
        >
          <Image src="/logo.png" alt="En.Studio Logo" width={120} height={40} />
        </Link>

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
              className="relative py-2 text-white/90 hover:text-white transition-colors"
            >
              <span className="relative z-10">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile menu icon */}
        <button
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          className="ml-auto md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-transform active:scale-95 relative z-10"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 right-0 top-[3px] h-[2px] bg-white/90 transition-transform duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-[9px] h-[2px] bg-white/90 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-[15px] h-[2px] bg-white/90 transition-transform duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[600]" role="dialog" aria-modal="true">
          <div ref={backdropRef} className="absolute inset-0 bg-black/50" onClick={closeMenu} />
          <div
            ref={sheetRef}
            className="absolute left-1/2 top-6 w-[92vw] max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-white/6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.06), 0 1px 0 rgba(255,255,255,0.05)",
              background:
                "linear-gradient(180deg, rgba(12,18,28,0.85), rgba(12,18,28,0.78))",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold tracking-wide">Menu</span>
              <button
                onClick={closeMenu}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                aria-label="Close menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-white/90"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul ref={listRef} className="mt-2 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={closeMenu}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <span className="uppercase tracking-[0.14em] text-[12px] text-white/90">
                      {l.label}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="opacity-80 group-hover:translate-x-0.5 transition-transform"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href="#contact"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-semibold text-sm"
              >
                Get a Quote
              </a>
              <a
                href="#work"
                onClick={closeMenu}
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
