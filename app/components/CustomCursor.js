"use client";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        gsap.set(followerRef.current, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

        const moveCursor = (e) => {
            gsap.to(cursorRef.current, { duration: 0.1, x: e.clientX, y: e.clientY });
            gsap.to(followerRef.current, { duration: 0.8, x: e.clientX, y: e.clientY, ease: "power3.out" });
        };

        window.addEventListener('mousemove', moveCursor);
        document.documentElement.classList.add('no-cursor');

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.documentElement.classList.remove('no-cursor');
        };
    }, []);

    return (
        <>
            <div ref={followerRef} className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-neutral-500 z-[9999] pointer-events-none"></div>
            <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[9999] pointer-events-none"></div>
        </>
    );
};

export default CustomCursor;
