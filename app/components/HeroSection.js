"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

/* ────────────────────────────────────────────────────────────────────────────
   LAUNCHPAD BUTTON
──────────────────────────────────────────────────────────────────────────── */
const LaunchpadButton = ({ label = "Visit Portfolio" }) => {
  const btnRef = useRef(null);
  const rimRef = useRef(null);
  const innerRef = useRef(null);
  const labelRef = useRef(null);
  const rippleRefs = useRef([]);
  const [isLaunching, setIsLaunching] = useState(false);

  // Idle animations
  useEffect(() => {
    if (!rimRef.current || !innerRef.current) return;
    
    // Subtle rim glow pulse
    const rimTl = gsap.timeline({ repeat: -1, yoyo: true });
    rimTl.to(rimRef.current, {
      opacity: 1,
      duration: 2,
      ease: "sine.inOut"
    });

    // Gentle floating
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(btnRef.current, {
      y: -3,
      duration: 2.5,
      ease: "sine.inOut"
    });

    return () => {
      rimTl.kill();
      floatTl.kill();
    };
  }, []);

  // Hover animation
  useEffect(() => {
    if (!btnRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(btnRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(2)"
      });
      gsap.to(rimRef.current, {
        opacity: 1,
        scale: 1.08,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(labelRef.current, {
        letterSpacing: "0.15em",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (isLaunching) return;
      gsap.to(btnRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(rimRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(labelRef.current, {
        letterSpacing: "0.1em",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    btnRef.current.addEventListener('mouseenter', handleMouseEnter);
    btnRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (btnRef.current) {
        btnRef.current.removeEventListener('mouseenter', handleMouseEnter);
        btnRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isLaunching]);

  // Click animation
  const handleClick = useCallback(() => {
    if (isLaunching) return;
    setIsLaunching(true);

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = '/portfolio';
      }
    });

    // Create ripples
    rippleRefs.current.forEach((ripple, i) => {
      if (!ripple) return;
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 0.6 },
        { 
          scale: 2 + i * 0.5, 
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out"
        }
      );
    });

    // Button press
    tl.to(btnRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in"
    });

    // Label fades
    tl.to(labelRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.05");

    // Button returns
    tl.to(btnRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    }, "-=0.2");

    // Reset label
    tl.set(labelRef.current, {
      opacity: 1,
      y: 0
    });

  }, [isLaunching]);

  return (
    <div
      ref={btnRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={[
        "relative inline-flex items-center justify-center select-none",
        "w-[220px] h-[52px] rounded-[0.95rem]",
        "uppercase font-semibold tracking-wide text-white text-sm",
        "ring-1 ring-white/10 bg-black/60 backdrop-blur",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(34,211,238,0.28)]",
        "cursor-pointer transition-all overflow-hidden",
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-label={label}
    >
      {/* Ripple effects */}
      {[0, 1, 2].map(i => (
        <span
          key={i}
          ref={el => rippleRefs.current[i] = el}
          className="absolute inset-0 rounded-[0.95rem] border-2 border-cyan-400/30 pointer-events-none"
          style={{ opacity: 0 }}
        />
      ))}

      <span
        ref={rimRef}
        aria-hidden
        className="absolute inset-0 rounded-[0.95rem] p-[2px] bg-[conic-gradient(at_50%_-20%,#67e8f9,rgba(255,255,255,0.7),#22d3ee,#67e8f9)] opacity-90 blur-[0.7px] -z-10"
      />
      <span ref={innerRef} className="absolute inset-[2px] rounded-[0.8rem] overflow-hidden bg-black/70 flex items-center justify-center">
        <span className="relative z-10 tracking-wider" ref={labelRef}>{label}</span>
      </span>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   GET QUOTE BUTTON
──────────────────────────────────────────────────────────────────────────── */
const GetQuoteButton = ({ label = "Get a Quote" }) => {
  const btnRef = useRef(null);
  const iconRef = useRef(null);
  const shimmerRef = useRef(null);
  const rippleRefs = useRef([]);
  const [isFlying, setIsFlying] = useState(false);

  // Idle float animation
  useEffect(() => {
    if (!btnRef.current) return;
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(btnRef.current, { 
      y: -2, 
      duration: 1.2, 
      ease: "sine.inOut" 
    })
    .to(btnRef.current, { 
      y: 0, 
      duration: 1.2, 
      ease: "sine.inOut" 
    });
    return () => tl.kill();
  }, []);

  // Shimmer loop
  useEffect(() => {
    if (!shimmerRef.current) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tl.to(shimmerRef.current, {
      opacity: 0.8,
      x: "120%",
      duration: 1.5,
      ease: "power2.inOut"
    })
    .set(shimmerRef.current, { x: "-120%", opacity: 0 });
    return () => tl.kill();
  }, []);

  // Hover animation
  useEffect(() => {
    if (!btnRef.current || !iconRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(btnRef.current, {
        scale: 1.05,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.5)",
        duration: 0.3,
        ease: "back.out(1.7)"
      });
      gsap.to(iconRef.current, {
        x: 3,
        y: -3,
        rotation: -15,
        duration: 0.4,
        ease: "back.out(2)"
      });
    };

    const handleMouseLeave = () => {
      if (isFlying) return;
      gsap.to(btnRef.current, {
        scale: 1,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35)",
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(iconRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)"
      });
    };

    btnRef.current.addEventListener('mouseenter', handleMouseEnter);
    btnRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (btnRef.current) {
        btnRef.current.removeEventListener('mouseenter', handleMouseEnter);
        btnRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isFlying]);

  // Click animation - paper plane launch
  const handleClick = useCallback(() => {
    if (isFlying) return;
    setIsFlying(true);

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = '/quote';
      }
    });

    // Create ripples
    rippleRefs.current.forEach((ripple, i) => {
      if (!ripple) return;
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 0.6 },
        { 
          scale: 2 + i * 0.5, 
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out"
        }
      );
    });

    // Button press
    tl.to(btnRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in"
    });

    // Icon launches
    tl.to(iconRef.current, {
      x: 300,
      y: -200,
      rotation: 45,
      scale: 1.5,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.05");

    // Button returns
    tl.to(btnRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    }, "-=1");

    // Reset icon
    tl.set(iconRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1
    });

  }, [isFlying]);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={[
        "relative inline-flex items-center justify-center",
        "h-[48px] px-5 rounded-xl",
        "font-semibold tracking-wide text-sm",
        "bg-[rgba(255,255,255,0.06)]",
        "ring-1 ring-inset ring-white/12",
        "text-white hover:text-white",
        "backdrop-blur-md transition-all duration-300",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.35)]",
        "overflow-hidden",
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-label={label}
    >
      {/* Ripple effects */}
      {[0, 1, 2].map(i => (
        <span
          key={i}
          ref={el => rippleRefs.current[i] = el}
          className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 pointer-events-none"
          style={{ opacity: 0 }}
        />
      ))}

      {/* Gradient rim */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          padding: 1,
          background: "linear-gradient(120deg, rgba(255,255,255,0.35), rgba(103,232,249,0.35) 40%, rgba(255,255,255,0.35) 80%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Shimmer */}
      <span
        ref={shimmerRef}
        aria-hidden
        className="absolute inset-0 -skew-x-12 opacity-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
          transform: "translateX(-120%) skewX(-12deg)"
        }}
      />

      {/* Icon + text */}
      <span className="relative z-10 flex items-center gap-2">
        <svg ref={iconRef} width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
          <path d="M21.5 3.5L2.5 11.5l7 2 2 7 10-17z" fill="currentColor" />
        </svg>
        {label}
      </span>
    </button>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   HERO SECTION
──────────────────────────────────────────────────────────────────────────── */
const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(103, 232, 249, 0.02) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)
        `,
        backgroundColor: '#000'
      }} />

      {/* Content */}
      <div className="relative z-30 p-8 max-w-5xl mx-auto flex flex-col md:gap-11 items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-md mt-8 md:text-lg text-neutral-300 max-w-2xl mx-auto uppercase tracking-widest"
        >
          A creative venture by Enfinito.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-none my-4 uppercase"
        >
          <span>Powerful Storytelling</span>
          <br />   <span className="text-[#53A4DB]">Stunning Visuals.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <LaunchpadButton />
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <GetQuoteButton />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;