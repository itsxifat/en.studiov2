"use client";
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    // Add state to track if the device is hover-capable (not touch-first)
    const [isHoverDevice, setIsHoverDevice] = useState(false);

    // This effect runs once on the client to check the device type
    useEffect(() => {
        // Use matchMedia to check if the primary input can hover.
        // This is more reliable than checking for 'ontouchstart'
        const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        setIsHoverDevice(hasHover);
    }, []);

    // This effect runs the cursor logic, but only if it's a hover device
    useEffect(() => {
        // If it's not a hover device (e.g., mobile, tablet), do nothing
        if (!isHoverDevice) return;

        // If it is a hover device, set up the cursor
        gsap.set(followerRef.current, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

        const moveCursor = (e) => {
            gsap.to(cursorRef.current, { duration: 0.1, x: e.clientX, y: e.clientY });
            gsap.to(followerRef.current, { duration: 0.8, x: e.clientX, y: e.clientY, ease: "power3.out" });
        };

        window.addEventListener('mousemove', moveCursor);
        document.documentElement.classList.add('no-cursor');

        // Cleanup function
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.documentElement.classList.remove('no-cursor');
        };
    }, [isHoverDevice]); // This effect depends on the device check

    // If it's not a hover device, render nothing
    if (!isHoverDevice) {
        return null;
    }

    // If it IS a hover device, render the cursor elements
    return (
        <>
            <div ref={followerRef} className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-neutral-500 z-9999 pointer-events-none opacity-0 md:opacity-100"></div>
            <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-9999 pointer-events-none opacity-0 md:opacity-100"></div>
        </>
    );
};

export default CustomCursor;