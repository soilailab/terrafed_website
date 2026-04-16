import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import SoilHeroScene from "./SoilHeroScene";

gsap.registerPlugin(ScrollTrigger);

export default function SoilHero({ navHeight = 0 }) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  // Populated by SoilHeroScene after R3F mounts — lets scroll events trigger frames
  const invalidateRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: `top ${navHeight}px`,
      end: "+=180%",
      pin: true,
      scrub: 1, // 1-second lag for a smoother feel
      onUpdate: (self) => {
        progressRef.current = self.progress;
        // Request a new frame on every scroll tick — works with frameloop="demand"
        invalidateRef.current?.();
      },
    });

    // Refresh all ScrollTrigger measurements after fonts have loaded and the
    // browser has reflowed. Without this, if Inter loads after ScrollTrigger
    // has measured positions, the pin start point will be a few pixels off.
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      trigger.kill();
    };
  }, [navHeight]);

  return (
    <section
      ref={sectionRef}
      // No overflow-hidden here — it breaks GSAP's pin-spacer injection
      className="relative h-[85svh] w-full rounded-[2rem] bg-black"
    >
      {/* WebGL canvas — overflow-hidden clips canvas to the rounded section corners */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem]">
        {/*
          frameloop="demand": R3F only renders when invalidate() is called.
          SoilHeroScene wires up two call sites:
            1. scroll — via invalidateRef, called on every ScrollTrigger onUpdate
            2. animation — a 12 fps setInterval for background uTime noise movement
          GPU work drops to near-zero when the user is not scrolling.
        */}
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <SoilHeroScene progressRef={progressRef} invalidateRef={invalidateRef} />
        </Canvas>
      </div>

      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/50 rounded-[2rem]" />

      {/* Hero text — pointer-events-none so it doesn't block canvas interaction */}
      <div className="pointer-events-none relative z-20 flex h-full w-full items-center justify-center px-6">
        <div className="mx-auto max-w-5xl text-center text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/70">
            Welcome to
          </p>
          <h1 className="text-5xl font-semibold leading-none sm:text-7xl md:text-8xl">
            TerraFed
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Soil Intelligence Mapping powered by AI.
          </p>
        </div>
      </div>
    </section>
  );
}
