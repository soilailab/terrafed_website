import { useEffect, useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Fullscreen quad material.
// The vertex shader writes directly to clip space, so camera transforms are irrelevant.
const SoilRevealMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0.5, 0.5),
  },
  /* vertex */
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  /* fragment */
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    // Hash lattice point to a pseudo-random 2D unit gradient direction
    vec2 gradDir(vec2 p) {
      float h = fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      float a = h * 6.28318;
      return vec2(cos(a), sin(a));
    }

    // Gradient noise (Perlin-style), output range [0, 1].
    // Quintic interpolation (C2 continuous) eliminates the blocky rectangular
    // artefacts produced by classic value noise with cubic smoothstep.
    float gn(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      float a = dot(gradDir(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
      float b = dot(gradDir(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
      float c = dot(gradDir(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
      float d = dot(gradDir(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
    }

    // Soil organic matter colour ramp: dark â†’ rich brown
    // SOM colour ramp: dark soil -> rich brown. Smooth blend, no hard branches.
    // SOC colour ramp: mirrors satellite-derived soil organic carbon maps.
    // Low SOC → saturated red-orange; mid → bright yellow; high → deep green.
    // Five stops match the RdYlGn spectral convention used by FAO / ISRIC maps.
    vec3 somPalette(float t) {
      vec3 c1 = vec3(0.84, 0.10, 0.11); // very low     – vivid red
      vec3 c2 = vec3(0.98, 0.53, 0.18); // low          – burnt orange
      vec3 c3 = vec3(0.99, 0.88, 0.22); // mid          – bright yellow
      vec3 c4 = vec3(0.42, 0.76, 0.32); // high         – lime green
      vec3 c5 = vec3(0.10, 0.42, 0.22); // very high    – deep forest green
      vec3 c6 = vec3(0.06, 0.28, 0.62); // extreme high – deep blue
      vec3 col = mix(c1, c2, smoothstep(0.00, 0.20, t));
      col = mix(col, c3, smoothstep(0.20, 0.40, t));
      col = mix(col, c4, smoothstep(0.40, 0.60, t));
      col = mix(col, c5, smoothstep(0.60, 0.80, t));
      col = mix(col, c6, smoothstep(0.80, 1.00, t));
      return col;
    }

    void main() {
      vec2 uv = vUv;
      vec2 centered = uv - 0.5;
      centered.x *= uResolution.x / uResolution.y;

      // Layered terrain noise — gradient noise gives smooth organic forms
      float coarse  = gn(uv * 6.0);
      float medium  = gn(uv * 18.0 + uTime * 0.06);
      float fine    = gn(uv * 50.0);
      // Blended gradient noise clusters around 0.5; remap [0.25, 0.75] → [0, 1]
      // so all six palette stops (including blue) appear with roughly equal frequency.
      float terrain = smoothstep(0.25, 0.75, coarse * 0.6 + medium * 0.3 + fine * 0.1);

      // Site-grid overlay — two-level cadastral grid (major + minor parcels)
      // Major grid: 32 large parcels across the canvas
      vec2  gridUv   = uv * 32.0;
      vec2  cell     = fract(gridUv);
      vec2  pw       = 32.0 / uResolution * 1.5;
      float majorLine = clamp(
        (1.0 - smoothstep(0.0, pw.x, cell.x)) + (1.0 - smoothstep(0.0, pw.y, cell.y)),
        0.0, 1.0
      );

      // Minor grid: 5× subdivision inside each major cell — thin hairlines
      vec2  subUv    = fract(gridUv * 5.0);
      vec2  spw      = 32.0 * 5.0 / uResolution * 1.2;
      float minorLine = clamp(
        (1.0 - smoothstep(0.0, spw.x, subUv.x)) + (1.0 - smoothstep(0.0, spw.y, subUv.y)),
        0.0, 1.0
      ) * 0.35; // minor lines are fainter

      float gridLine = clamp(majorLine + minorLine, 0.0, 1.0);

      // Per-parcel colour variation driven by both grid levels
      float parcels  = smoothstep(0.25, 0.85, gn(floor(gridUv) * 0.17))
                     + 0.15 * gn(floor(gridUv * 5.0) * 0.07);

      // Base B&W satellite map — lifted shadows (0.08 → 0.36) for a lighter, less inky look
      vec3 bwColor  = vec3(mix(0.36, 0.96, terrain * 0.8 + parcels * 0.2));

      // SOM colour map
      vec3 somColor = somPalette(terrain) * (0.9 + 0.35 * parcels);

      // Scroll-driven diagonal reveal
      float reveal      = smoothstep(0.0, 1.0, uProgress);
      float sweep       = smoothstep(-0.3, 1.3, uv.x + uv.y + (uProgress * 1.15 - 0.575));
      float organicMask = smoothstep(0.20, 0.80, terrain + medium * 0.15);
      float mixAmount   = reveal * sweep * organicMask;

      vec3 color = mix(bwColor, somColor, mixAmount);

      // Boost saturation and richness as the reveal completes
      color = mix(color, somColor, 0.18 * reveal);

      // Subtle vegetation / moisture tints at full reveal
      color = mix(color, vec3(0.98, 0.25, 0.10), 0.12 * reveal * fine);
      color = mix(color, vec3(0.15, 0.45, 0.20), 0.16 * reveal * medium);

      // Subtle contour overlay
      float contourField = terrain * 12.0 + medium * 0.8 + fine * 0.25;
      float contourLine = 1.0 - smoothstep(0.0, 0.08, abs(fract(contourField) - 0.5));
      contourLine *= 0.08 * (0.25 + 0.75 * reveal);
      color = mix(color, vec3(0.98, 0.96, 0.90), contourLine);

      // Grid lines
      color = mix(color, vec3(0.0), gridLine * 0.22);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

extend({ SoilRevealMaterial });

// Accepts progressRef (scroll position) and invalidateRef (so parent can trigger frames)
export default function SoilHeroScene({ progressRef, mouseRef, invalidateRef }) {
  const materialRef = useRef();
  const { invalidate } = useThree();

  // Give the parent (SoilHero) access to R3F's invalidate function so that
  // scroll events fired outside the R3F tree can request new frames.
  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  // Keep the uTime noise animation alive at ~12 fps even when the user is not
  // scrolling. The medium-noise layer (uv * 18.0 + uTime * 0.02) is very subtle
  // so 12 fps is imperceptible. Without this, the scene would be completely frozen
  // between scroll events in frameloop="demand" mode.
  useEffect(() => {
    const id = window.setInterval(invalidate, 16);
    return () => window.clearInterval(id);
  }, [invalidate]);

  // Read state.size directly from the frame callback — always current, no stale closure risk
  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uProgress = progressRef.current;
    materialRef.current.uResolution.set(state.size.width, state.size.height);
    materialRef.current.uMouse.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh>
      {/* 2Ã—2 plane fills NDC space exactly with the clip-space vertex shader */}
      <planeGeometry args={[2, 2]} />
      <soilRevealMaterial ref={materialRef} />
    </mesh>
  );
}
