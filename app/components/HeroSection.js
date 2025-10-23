"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link"; // Import Link for navigation

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
    // Check if refs are current before starting animations
    const currentRim = rimRef.current;
    const currentBtn = btnRef.current;
    if (!currentRim || !currentBtn) return;

    const rimTl = gsap.timeline({ repeat: -1, yoyo: true });
    rimTl.to(currentRim, {
      opacity: 1,
      duration: 2,
      ease: "sine.inOut"
    });

    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(currentBtn, {
      y: -3,
      duration: 2.5,
      ease: "sine.inOut"
    });

    return () => {
      rimTl.kill();
      floatTl.kill();
    };
  }, []); // Empty dependency array as refs don't change

  // Hover animation
  useEffect(() => {
    const currentBtn = btnRef.current; // Store ref value
    const currentRim = rimRef.current;
    const currentLabel = labelRef.current;

    if (!currentBtn || !currentRim || !currentLabel) return;

    const handleMouseEnter = () => {
      gsap.to(currentBtn, { // Use stored value
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(2)"
      });
      gsap.to(currentRim, { // Use stored value
        opacity: 1,
        scale: 1.08,
        duration: 0.3,
        ease: "power2.out"
      });
       gsap.to(currentLabel, { // Use stored value
        letterSpacing: "0.15em",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (isLaunching) return;
      gsap.to(currentBtn, { // Use stored value
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
       gsap.to(currentRim, { // Use stored value
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
       });
       gsap.to(currentLabel, { // Use stored value
        letterSpacing: "0.1em",
        duration: 0.3,
        ease: "power2.out"
       });
    };

    currentBtn.addEventListener('mouseenter', handleMouseEnter); // Use stored value
    currentBtn.addEventListener('mouseleave', handleMouseLeave); // Use stored value

    // Cleanup uses the stored value
    return () => {
      if (currentBtn) {
        currentBtn.removeEventListener('mouseenter', handleMouseEnter);
        currentBtn.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isLaunching]); // isLaunching is the dependency

  // Click animation
  const handleClick = useCallback((e) => { // Accept event 'e'
    if (isLaunching) {
        e.preventDefault(); // Prevent navigation if already launching
        return;
    }
    setIsLaunching(true);

    const tl = gsap.timeline({
      // Removed onComplete to let Link handle navigation
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

    // Button returns (allow slight delay for navigation)
    tl.to(btnRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
    }, "+=0.1"); // Add delay

    // Reset label (optional, happens after nav)
    tl.set(labelRef.current, {
        opacity: 1,
        y: 0
    });

  }, [isLaunching]);

  return (
    // Apply props directly to Link, remove legacyBehavior and passHref
    <Link
      href="/portfolio"
      ref={btnRef} // Apply ref directly to Link
      role="button" // Keep role for accessibility
      tabIndex={0} // Keep tabIndex
      onClick={handleClick} // Apply onClick directly to Link
      onKeyDown={(e) => { // Apply onKeyDown directly to Link
        if (e.key === 'Enter' || e.key === ' ') {
          // No need to call handleClick manually if Link handles navigation
          // Allow default behavior for Enter/Space on links
        }
      }}
      className={[ // Move ALL styling classes here
        "relative inline-flex items-center justify-center select-none",
        "w-[220px] h-[52px] rounded-[0.95rem]",
        "uppercase font-semibold tracking-wide text-white text-sm",
        "ring-1 ring-white/10 bg-black/60 backdrop-blur",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(34,211,238,0.28)]",
        "cursor-pointer transition-all overflow-hidden",
        "no-underline", // Add this to prevent default link underline
        "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black" // Add focus styles
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-label={label}
    >
      {/* Ripple effects - Keep these */}
      {[0, 1, 2].map(i => (
         <span
            key={i}
            ref={el => rippleRefs.current[i] = el}
            className="absolute inset-0 rounded-[0.95rem] border-2 border-cyan-400/30 pointer-events-none"
            style={{ opacity: 0 }}
         />
      ))}

      {/* Rim span - Keep this */}
      <span
        ref={rimRef}
        aria-hidden
        className="absolute inset-0 rounded-[0.95rem] p-[2px] bg-[conic-gradient(at_50%_-20%,#67e8f9,rgba(255,255,255,0.7),#22d3ee,#67e8f9)] opacity-90 blur-[0.7px] -z-10"
      />
      {/* Inner span with label - Keep this */}
      <span ref={innerRef} className="absolute inset-[2px] rounded-[0.8rem] overflow-hidden bg-black/70 flex items-center justify-center">
          <span className="relative z-10 tracking-wider" ref={labelRef}>{label}</span>
      </span>
    </Link>
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
    const currentBtn = btnRef.current;
    if (!currentBtn) return;
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(currentBtn, {
      y: -2,
      duration: 1.2,
      ease: "sine.inOut"
    })
    .to(currentBtn, {
      y: 0,
      duration: 1.2,
      ease: "sine.inOut"
    });
    return () => tl.kill();
  }, []);

  // Shimmer loop
  useEffect(() => {
    const currentShimmer = shimmerRef.current;
    if (!currentShimmer) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tl.to(currentShimmer, {
      opacity: 0.8,
      x: "120%",
      duration: 1.5,
      ease: "power2.inOut"
    })
    .set(currentShimmer, { x: "-120%", opacity: 0 });
    return () => tl.kill();
  }, []);

  // Hover animation
  useEffect(() => {
    const currentBtn = btnRef.current; // Store ref value
    const currentIcon = iconRef.current;

    if (!currentBtn || !currentIcon) return;

    const handleMouseEnter = () => {
      gsap.to(currentBtn, { // Use stored value
        scale: 1.05,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.5)",
        duration: 0.3,
        ease: "back.out(1.7)"
      });
      gsap.to(currentIcon, { // Use stored value
        x: 3,
        y: -3,
        rotation: -15,
        duration: 0.4,
        ease: "back.out(2)"
      });
    };

    const handleMouseLeave = () => {
      if (isFlying) return;
      gsap.to(currentBtn, { // Use stored value
        scale: 1,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35)",
        duration: 0.3,
        ease: "power2.inOut"
      });
       gsap.to(currentIcon, { // Use stored value
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)"
       });
    };

    currentBtn.addEventListener('mouseenter', handleMouseEnter); // Use stored value
    currentBtn.addEventListener('mouseleave', handleMouseLeave); // Use stored value

    return () => { // Cleanup uses stored value
      if (currentBtn) {
        currentBtn.removeEventListener('mouseenter', handleMouseEnter);
        currentBtn.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isFlying]); // isFlying is the dependency

  // Click animation - paper plane launch
   const handleClick = useCallback((e) => { // Accept event 'e'
     if (isFlying) {
         e.preventDefault(); // Prevent navigation if already flying
         return;
     }
     setIsFlying(true);

     const tl = gsap.timeline({
         // Removed onComplete, Link handles navigation
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

     // Button returns (allow slight delay for navigation)
     tl.to(btnRef.current, {
         scale: 1,
         duration: 0.3,
         ease: "back.out(1.7)"
     }, "+=0.1"); // Add delay

     // Reset icon (optional, happens after nav)
     tl.set(iconRef.current, {
         x: 0,
         y: 0,
         rotation: 0,
         scale: 1,
         opacity: 1
     });
   }, [isFlying]);


  return (
    // Apply props directly to Link, remove legacyBehavior and passHref
    <Link
        href="/quote"
        ref={btnRef} // Apply ref directly to Link
        onClick={handleClick} // Apply onClick directly to Link
        className={[ // Move ALL styling classes here
            "relative inline-flex items-center justify-center",
            "h-[48px] px-5 rounded-xl",
            "font-semibold tracking-wide text-sm",
            "bg-[rgba(255,255,255,0.06)]",
            "ring-1 ring-inset ring-white/12",
            "text-white hover:text-white", // Keep hover styles
            "backdrop-blur-md transition-all duration-300",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.35)]",
            "overflow-hidden",
            "cursor-pointer", // Ensure cursor pointer
            "no-underline", // Add this
            "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black" // Add focus styles
        ].join(" ")}
        style={{ WebkitTapHighlightColor: "transparent" }}
        aria-label={label}
        onKeyDown={(e) => { // Apply onKeyDown directly to Link
          if (e.key === 'Enter' || e.key === ' ') {
            // Allow default behavior for links
          }
        }}
        role="button" // Keep role
        tabIndex={0} // Keep tabIndex
    >
        {/* Ripple effects - Keep these */}
        {[0, 1, 2].map(i => (
             <span
                key={i}
                ref={el => rippleRefs.current[i] = el}
                className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 pointer-events-none"
                style={{ opacity: 0 }}
             />
        ))}

        {/* Gradient rim - Keep this */}
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

        {/* Shimmer - Keep this */}
        <span
            ref={shimmerRef}
            aria-hidden
            className="absolute inset-0 -skew-x-12 opacity-0 pointer-events-none"
            style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                transform: "translateX(-120%) skewX(-12deg)"
            }}
        />

        {/* Icon + text span - Keep this */}
        <span className="relative z-10 flex items-center gap-2">
            <svg ref={iconRef} width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                <path d="M21.5 3.5L2.5 11.5l7 2 2 7 10-17z" fill="currentColor" />
            </svg>
            {label}
        </span>
    </Link>
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