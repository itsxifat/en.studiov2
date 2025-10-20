"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const FLAG_QUOTE = "quote_plane_from_main";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function ensureOverlay(id="quote-overlay"){
  let canvas = document.getElementById(id);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = id;
    Object.assign(canvas.style, { position:"fixed", inset:0, zIndex:10005, pointerEvents:"none", background:"transparent" });
    document.body.appendChild(canvas);
  }
  return canvas;
}

function makePaperPlane() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.9, 3, 1, false),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.05 })
  );
  body.rotation.z = Math.PI;
  body.position.y = 0.2;

  const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 });
  const wingGeo = new THREE.PlaneGeometry(0.7, 0.35);
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.rotation.x = -Math.PI/2; leftWing.rotation.z = 0.15; leftWing.position.set(-0.18,0.05,0);
  const rightWing = new THREE.Mesh(wingGeo, wingMat.clone());
  rightWing.rotation.x = -Math.PI/2; rightWing.rotation.z = -0.15; rightWing.position.set(0.18,0.05,0);

  const tailGeo = new THREE.PlaneGeometry(0.25, 0.18);
  const tailL = new THREE.Mesh(tailGeo, wingMat.clone()); tailL.rotation.x = -Math.PI/2; tailL.rotation.z = 0.2; tailL.position.set(-0.12, 0.05, -0.3);
  const tailR = new THREE.Mesh(tailGeo, wingMat.clone()); tailR.rotation.x = -Math.PI/2; tailR.rotation.z = -0.2; tailR.position.set(0.12, 0.05, -0.3);

  group.add(body, leftWing, rightWing, tailL, tailR);
  group.userData = { body, leftWing, rightWing, tailL, tailR };
  return group;
}

async function runLandingUnfold(onDone) {
  const canvas = ensureOverlay();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 8);

  const amb = new THREE.AmbientLight(0xffffff, 1.0);
  const dir = new THREE.DirectionalLight(0xffffff, 1.2); dir.position.set(4,6,8);
  scene.add(amb, dir);

  const plane = makePaperPlane(); scene.add(plane);
  plane.position.set(0.6, 2.2, 0); plane.rotation.set(-0.1, -0.1, 0.25);

  // a simple "ground" white sheet (will grow & become the quote stage)
  const sheetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.0 });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7, 1, 1), sheetMat);
  sheet.rotation.x = -Math.PI/2;
  sheet.position.set(0, -0.05, -0.1);
  sheet.scale.set(0.001, 0.001, 0.001); // start hidden
  scene.add(sheet);

  const onResize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);

  let raf=0, t=0; const clock=new THREE.Clock();
  const render=()=>{ const dt=clamp(clock.getDelta(),0,0.05); t+=dt;
    const { leftWing, rightWing, tailL, tailR } = plane.userData;
    // gentle flutter while landing
    leftWing.rotation.z = 0.15 + Math.sin(t*5.0)*0.03;
    rightWing.rotation.z = -0.15 - Math.sin(t*5.1)*0.03;
    tailL.rotation.z = 0.2 + Math.sin(t*6.2)*0.02;
    tailR.rotation.z = -0.2 - Math.sin(t*6.0)*0.02;
    renderer.render(scene, camera); raf=requestAnimationFrame(render);
  };
  render();

  // LANDING → UNFOLD → SHEET EXPANDS
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      cancelAnimationFrame(raf);
      try { renderer.dispose(); canvas.remove(); } catch {}
      onDone?.();
    }
  });

  // cinematic descend + slight bank
  tl.to(plane.position, { x: 0, y: 0.15, z: 0, duration: 1.6, ease: "power3.in" }, 0)
    .to(plane.rotation, { x: 0.05, y: 0.05, z: 0.0, duration: 1.6 }, 0)
    .to(plane.position, { y: 0.0, duration: 0.5, ease: "sine.out" }) // gentle touch
    .to(plane.rotation, { x: 0, y: 0, z: 0, duration: 0.5, ease: "sine.out" }, "<");

  // unfold: rotate wings and tails flat, shrink body, reveal underlying sheet
  tl.to(plane.userData.leftWing.rotation,  { z: 0, duration: 0.5 }, ">")
    .to(plane.userData.rightWing.rotation, { z: 0, duration: 0.5 }, "<")
    .to(plane.userData.tailL.rotation,     { z: 0, duration: 0.45 }, "<+0.05")
    .to(plane.userData.tailR.rotation,     { z: 0, duration: 0.45 }, "<")
    .to(plane.userData.body.scale,         { x: 0.001, y: 1, z: 1, duration: 0.45, ease: "power1.inOut" }, "<")
    .to(sheet.scale,                       { x: 1, y: 1, z: 1, duration: 0.6, ease: "power2.out" }, "<+0.05")
    .to(plane.scale,                       { x: 0.001, y: 0.001, z: 0.001, duration: 0.4, ease: "power2.in" }, "<+0.1");

  // expand sheet to viewport-ish, then finish
  tl.to(sheet.scale, { x: 7, y: 1, z: 5, duration: 0.6, ease: "power3.out" }, ">-0.1");
}

export default function QuotePage() {
  const contentRef = useRef(null);

  useEffect(() => {
    const shouldAnim = typeof window !== "undefined" && sessionStorage.getItem(FLAG_QUOTE) === "1";

    if (!shouldAnim) {
      // direct hit → show content
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    // consume flag, run once
    sessionStorage.removeItem(FLAG_QUOTE);

    runLandingUnfold(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
      }
    });
  }, []);

  return (
    <main className="min-h-[100svh] bg-black text-white">
      <div ref={contentRef} className="opacity-0">
        {/* The “paper” becomes the stage; layout sits on top */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Request a Quote</h1>
          <p className="mt-4 text-neutral-300">
            Tell us about your project—timeline, goals, budget—and we’ll craft a custom proposal.
          </p>

          {/* your form / content here */}
          <form className="mt-8 space-y-4">
            <div>
              <label className="block text-sm mb-2">Name</label>
              <input className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input type="email" className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="block text-sm mb-2">Project Details</label>
              <textarea rows={5} className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-cyan-400" />
            </div>
            <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2">
              Submit
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
