import { useEffect, useId, useState, useSyncExternalStore } from "react";
import logo from "../../assets/logoCarousel.png";
import "./SoilHeroCarousel.css";

// Timing is in milliseconds. Fade duration is passed to the scoped stylesheet.
const SLIDE_DURATION_MS = 3500;
const FADE_DURATION_MS = 800;
const slides = [
  {
    title: "Shared intelligence. Private data.",
    category: "Privacy-preserving federation",
    description:
      "Keep observations local. Contribute permitted model updates to shared learning.",
  },
  {
    title: "Select your field",
    category: "Your area of interest",
    description:
      "Define a field boundary to connect Earth observation with the land you manage.",
  },
  {
    title: "Multi-property soil predictions",
    category: "Spatial soil intelligence",
    description:
      "Explore aligned soil-property layers across the same field, one spatial estimate at a time.",
  },
  {
    title: "Adapt with local data",
    category: "Local model adaptation",
    description:
      "Use local soil measurements to fine-tune a shared global baseline for your context.",
  },
  {
    title: "Understand model uncertainty",
    category: "A clearer view of unknowns",
    description:
      "See where estimates are less certain and where additional observations may be valuable.",
  },
];

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}
function getServerMotion() {
  return true;
}

// All four field slides share these coordinates, crop geometry, trees and light.
const PLANE = "matrix(1 .46 -.85 .5 300 125)";
const FIELD = { x: 35, y: 36, width: 180, height: 180 };
const TREES = [
  [17, 20],
  [14, 38],
  [232, 34],
  [238, 52],
  [20, 230],
  [38, 232],
];
const project = (x, y) => [300 + x - 0.85 * y, 125 + 0.46 * x + 0.5 * y];
const samples = [
  [65, 65],
  [170, 70],
  [115, 126],
  [65, 183],
  [183, 177],
];
const UNCERTAINTY_ZONES = [
  [65, 65, 28],
  [168, 70, 12],
  [115, 126, 46],
  [65, 183, 83],
  [183, 177, 67],
];
const selection = "35,36 215,36 215,216 35,216 35,36";
const palettes = {
  clay: ["#466D58", "#56816B", "#77A881", "#A7C69A", "#E1D993"],
  organic: ["#806F5A", "#B28D6C", "#DDB17B", "#E8CF98", "#F3E7C7"],
  local: ["#456D59", "#629A76", "#82B88A", "#B8CF9D", "#E4E3B9"],
  uncertainty: ["#729C89", "#A7C8A2", "#E0DFAF", "#E9C189", "#E4946C"],
};
// Smooth, deterministic example surfaces: no random noise or invented observations.
function estimate(x, y, variant) {
  if (variant === "uncertainty") {
    let weighted = 0;
    let weights = 0;
    UNCERTAINTY_ZONES.forEach(([zx, zy, value]) => {
      const weight = 1 / Math.max(1, ((x - zx) ** 2 + (y - zy) ** 2) ** 1.5);
      weighted += (value / 100) * weight;
      weights += weight;
    });
    return weighted / weights;
  }
  const shift =
    variant === "local"
      ? 0.7
      : variant === "organic"
        ? 1.7
        : variant === "uncertainty"
          ? 2.9
          : 0;
  return Math.max(
    0,
    Math.min(
      0.999,
      0.48 +
        0.22 * Math.sin(x * 0.025 + shift) * Math.cos(y * 0.019) +
        0.16 * Math.cos((x + y) * 0.031 + shift) +
        0.1 * Math.sin(y * 0.052),
    ),
  );
}
function surfaceColor(palette, value) {
  const position = value * (palette.length - 1);
  const left = Math.floor(position);
  const right = Math.min(left + 1, palette.length - 1);
  const fraction = position - left;
  const channel = (color, offset) =>
    parseInt(color.slice(offset, offset + 2), 16);
  return `rgb(${[1, 3, 5].map((offset) => Math.round(channel(palette[left], offset) * (1 - fraction) + channel(palette[right], offset) * fraction)).join(",")})`;
}
const cells = Object.fromEntries(
  Object.keys(palettes).map((variant) => [
    variant,
    Array.from({ length: 900 }, (_, i) => {
      const x = FIELD.x + (i % 30) * 6;
      const y = FIELD.y + Math.floor(i / 30) * 6;
      return {
        x,
        y,
        fill: surfaceColor(palettes[variant], estimate(x, y, variant)),
      };
    }),
  ]),
);

function Legend({ id, colors, x, y, label, width = 158 }) {
  return (
    <g className="tf-map-legend" transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={id}>
          {colors.map((c, i) => (
            <stop key={c} offset={`${i * 25}%`} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect
        x="-10"
        y="-20"
        width={width + 20}
        height="60"
        rx="10"
        fill="white"
        fillOpacity=".95"
        stroke="#E2EAD9"
      />
      <text y="-3" className="tf-svg-label">
        {label}
      </text>
      <rect y="7" width={width} height="6" rx="3" fill={`url(#${id})`} />
      <text y="29" className="tf-svg-small">
        Lower
      </text>
      <text x={width} y="29" textAnchor="end" className="tf-svg-small">
        Higher
      </text>
    </g>
  );
}

function SharedFarmlandScene({ id }) {
  const crops = [
    "#AFC8A1",
    "#D8D4A2",
    "#8EB593",
    "#C8D1A4",
    "#D7D09E",
    "#8EB49A",
    "#A9BE92",
    "#E0DAAE",
    "#A4C8A5",
    "#B4C69C",
    "#D5D4A4",
    "#8BAE8D",
  ];

  // The two visible ground faces share the exact projected corners of the
  // top plane. Extrusion happens straight down in screen coordinates so the
  // faces meet cleanly at the front corner instead of skewing outward.
  const leftCorner = project(0, 250);
  const frontCorner = project(250, 250);
  const rightCorner = project(250, 0);
  const groundDepth = 16;
  const groundFace = ([x1, y1], [x2, y2]) =>
    `M${x1} ${y1} L${x2} ${y2} L${x2} ${y2 + groundDepth} L${x1} ${y1 + groundDepth} Z`;

  return (
    <g className="tf-farmland">
      <defs>
        <pattern
          id={`${id}-rows`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 1H7" stroke="#355f46" strokeWidth="1" opacity=".25" />
          <path d="M0 4H7" stroke="#eff4cf" opacity=".22" />
        </pattern>
      </defs>
      <ellipse
        cx="317"
        cy="373"
        rx="215"
        ry="24"
        fill="#658F73"
        opacity=".07"
      />
      {/* Ground thickness: draw screen-vertical faces behind the top plane. */}
      <path d={groundFace(leftCorner, frontCorner)} fill="#B4B9A1" />
      <path d={groundFace(frontCorner, rightCorner)} fill="#9FA892" />
      <g transform={PLANE}>
        <rect width="250" height="250" fill="#E7E4C8" />
        {crops.map((fill, i) => (
          <g key={i}>
            <rect
              x={9 + (i % 4) * 60}
              y={10 + Math.floor(i / 4) * 78}
              width="54"
              height="70"
              rx="1.5"
              fill={fill}
            />
            <rect
              x={9 + (i % 4) * 60}
              y={10 + Math.floor(i / 4) * 78}
              width="54"
              height="70"
              fill={`url(#${id}-rows)`}
            />
          </g>
        ))}
        <path
          d="M5 84H245M5 162H245M66 4V245M126 4V245M186 4V245"
          stroke="#F6F1D8"
          strokeWidth="4"
        />
      </g>
      {TREES.map(([x, y], i) => {
        const [px, py] = project(x, y);
        return (
          <g key={i} transform={`translate(${px} ${py})`}>
            <ellipse
              cx="4"
              cy="2"
              rx="12"
              ry="5"
              fill="#426E51"
              opacity=".13"
            />
            <path d="M0 0V-16" stroke="#887F5D" strokeWidth="3" />
            <ellipse cy="-18" rx="10" ry="13" fill="#6E9B73" />
            <ellipse cx="-4" cy="-21" rx="6" ry="10" fill="#A5C69B" />
          </g>
        );
      })}
    </g>
  );
}

function Raster({
  variant = "clay",
  elevation = 0,
  className = "",
  opacity = 0.92,
}) {
  return (
    <g
      className={className}
      style={{ "--tf-lift": `${-elevation}px` }}
      transform={`translate(0 ${-elevation})`}
    >
      <g transform={PLANE}>
        <g opacity={opacity}>
          {cells[variant].map((cell, i) => (
            <rect key={i} {...cell} width="6.1" height="6.1" />
          ))}
        </g>
        <rect {...FIELD} fill="none" stroke="#FFF9EC" strokeWidth="1.2" />
        <path
          d="M95 36V216M155 36V216M35 96H215M35 156H215"
          stroke="white"
          strokeWidth=".7"
          opacity=".3"
        />
      </g>
    </g>
  );
}

function FieldSelectionSlide({ id }) {
  return (
    <>
      <SharedFarmlandScene id={id} />
      <g transform="translate(0 -22)" className="tf-boundary">
        <g transform={PLANE}>
          <rect {...FIELD} fill="#F39B6D" fillOpacity=".13" />
          <polyline
            points={selection}
            fill="none"
            stroke="#F39B6D"
            strokeWidth="3"
            className="tf-draw-boundary"
          />
        </g>
        {[
          [35, 36],
          [215, 36],
          [215, 216],
          [35, 216],
        ].map(([x, y], i) => {
          const [px, py] = project(x, y);
          return (
            <g
              key={i}
              className="tf-corner"
              style={{ "--tf-delay": `${i * 0.3}s` }}
            >
              <circle
                cx={px}
                cy={py}
                r="6"
                fill="white"
                stroke="#F39B6D"
                strokeWidth="2.5"
              />
            </g>
          );
        })}
      </g>
      <g transform="translate(64 70)" className="tf-map-tools">
        <rect width="40" height="119" rx="12" fill="white" stroke="#DCE5D8" />
        <path
          d="M12 20H28M20 12V28M12 59H28"
          fill="none"
          stroke="#516F5B"
          strokeWidth="2"
        />
        <path d="M8 39H32M8 78H32" stroke="#e1ebe7" />
        <rect
          x="12"
          y="91"
          width="16"
          height="15"
          rx="2"
          fill="#ECF3E7"
          stroke="#F39B6D"
          strokeDasharray="3 2"
        />
      </g>
      <g transform="translate(363 79)" className="tf-reveal tf-selection-label">
        <rect width="201" height="37" rx="18" fill="white" stroke="#DDE8D2" />
        <circle cx="20" cy="19" r="4" fill="#F39B6D" />
        <text x="33" y="24" className="tf-svg-label">
          Field boundary defined
        </text>
      </g>
      <path
        d="M376 118L366 154"
        stroke="#F39B6D"
        strokeDasharray="3 4"
        opacity=".5"
      />
    </>
  );
}

function PredictionLayersSlide({ id }) {
  return (
    <>
      <SharedFarmlandScene id={id} />
      <g opacity=".38" stroke="#8eaeb6" strokeDasharray="4 4">
        {[
          [35, 36],
          [215, 36],
          [215, 216],
          [35, 216],
        ].map(([x, y], i) => {
          const [px, py] = project(x, y);
          return <path key={i} d={`M${px} ${py}v-99`} />;
        })}
      </g>
      <Raster
        variant="clay"
        elevation={42}
        className="tf-layer tf-layer-first"
      />
      <Raster
        variant="organic"
        elevation={105}
        className="tf-layer tf-layer-second"
        opacity={0.9}
      />
      <Legend
        id={`${id}-som`}
        colors={palettes.organic}
        x={66}
        y={58}
        label="Soil Organic Matter"
        width={174}
      />
      <Legend
        id={`${id}-clay`}
        colors={palettes.clay}
        x={382}
        y={330}
        label="Clay Estimation"
        width={153}
      />
    </>
  );
}

function ModelChip({ x, label, active }) {
  return (
    <g
      transform={`translate(${x} 48)`}
      className={active ? "tf-local-chip" : ""}
    >
      <rect
        width={active ? 236 : 160}
        height="42"
        rx="12"
        fill={active ? "#eef8ee" : "white"}
        stroke={active ? "#91c89c" : "#d3e2e3"}
      />
      <g
        transform="translate(15 13)"
        stroke={active ? "#4A9161" : "#5c8292"}
        fill="none"
        strokeWidth="1.4"
      >
        <rect width="16" height="16" rx="3" />
        <path d="M4 4H12V12H4ZM-3 5H0M-3 11H0M16 5H19M16 11H19" />
      </g>
      <text x="42" y="26" className="tf-svg-label tf-model-name-full">
        {label}
      </text>
      <text x="42" y="28" className="tf-model-name-short">
        {active ? "Local" : "Global"}
      </text>
    </g>
  );
}

function FineTuningSlide({ id }) {
  const [px, py] = project(115, 126);
  return (
    <>
<SharedFarmlandScene id={id} />
      <Raster variant="clay" elevation={17} opacity={0.6} />
      <Raster
        variant="local"
        elevation={17}
        className="tf-adapted"
        opacity={0.83}
      />
      <ModelChip x={62} label="Global Model" />
      <path
        className="tf-model-flow"
        d="M237 69 H311"
        stroke="#315e48"
        fill="none"
        strokeWidth="2.15"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
      <path
        className="tf-flow-tip tf-model-tip"
        d="M310 64 L317 69 L310 74 Z"
        fill="#315e42"
      />
      <ModelChip x={324} label="Locally Fine-Tuned Model" active />
      <path
        className="tf-sample-flow"
        d={`M${px} ${py - 26} C${px + 40} ${py - 26} 440 170 440 130 V103`}
        stroke="#315e48"
        fill="none"
        strokeWidth="2.15"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
      <path
        className="tf-flow-tip tf-sample-tip"
        d="M435 103 L440 96 L445 103 Z"
        fill="#315e48"
      />
      {samples.map(([x, y], i) => {
        const [sx, sy] = project(x, y);
        return (
          <g
            key={i}
            className="tf-sample"
            style={{ "--tf-delay": `${0.7 + i * 0.22}s` }}
          >
            <ellipse
              cx={sx}
              cy={sy - 17}
              rx="10"
              ry="5"
              fill="white"
              fillOpacity=".8"
            />
            <path
              d={`M${sx} ${sy - 17}v-16`}
              stroke="#fa9069"
              strokeWidth="2"
            />
            <circle
              cx={sx}
              cy={sy - 36}
              r="6"
              fill="#FFF9EC"
              stroke="#fa9069"
              strokeWidth="2.5"
            />
          </g>
        );
      })}
      <g transform="translate(445 340)">
        <circle r="5" fill="white" stroke="#fa9069" strokeWidth="2" />
        <text x="13" y="5" className="tf-svg-label-legend">
          Local soil measurements
        </text>
      </g>
    </>
  );
}

function UncertaintySlide({ id }) {
  return (
    <>
      <SharedFarmlandScene id={id} />
      <Raster
        variant="uncertainty"
        elevation={35}
        className="tf-layer tf-layer-first"
      />
      <Legend
        id={`${id}-uncertainty`}
        colors={palettes.uncertainty}
        x={70}
        y={56}
        label="Relative uncertainty"
        width={177}
      />
      
      {UNCERTAINTY_ZONES.map(([x, y, value], i) => {
        const [px, py] = project(x, y);
        return (
          <g key={value} transform={`translate(${px} ${py - 35})`}>
            {i === 3 && (
              <ellipse
                rx="28"
                ry="15"
                fill="#e8ac6b"
                opacity=".3"
                className="tf-uncertainty-halo"
              />
            )}
            <g
              className="tf-percentage"
              style={{ "--tf-delay": `${0.5 + i * 0.25}s` }}
            >
              <rect
                x="-25"
                y="-14"
                width="50"
                height="26"
                rx="9"
                fill="white"
                stroke="#D7E4D2"
              />
              <text
                textAnchor="middle"
                y="4"
                className="tf-svg-label tf-percent-text"
              >
                {value}%
              </text>
            </g>
          </g>
        );
      })}
    </>
  );
}

function Lock({ x, y, delay }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="tf-lock" style={{ "--tf-delay": `${delay}s` }}>
        <rect
          x="-15"
          y="-15"
          width="30"
          height="30"
          rx="10"
          fill="white"
          stroke="#b2d7ca"
        />
        <path
          d="M-5-2V-5a5 5 0 0110 0v3"
          fill="none"
          stroke="#4A9161"
          strokeWidth="1.7"
        />
        <rect
          x="-7"
          y="-2"
          width="14"
          height="11"
          rx="2"
          fill="#e0f2e4"
          stroke="#4A9161"
          strokeWidth="1.5"
        />
        <circle cy="3" r="1.5" fill="#4A9161" />
      </g>
    </g>
  );
}

function FederationSlide({ id }) {
  const nodes = [
    [202, 225],
    [299, 168],
    [397, 211],
    [424, 320],
    [279, 330],
    [240, 250],
  ];
  return (
    <>
      <defs>
        <radialGradient id={`${id}-sphere`} cx="35%" cy="25%" r="80%">
          <stop stopColor="#FFF9EC" />
          <stop offset=".55" stopColor="#E7EFD9" />
          <stop offset="1" stopColor="#C5DAC2" />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#6BB77B" stopOpacity=".1" />
          <stop offset="1" stopColor="#6BB77B" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-globe`}>
          <circle cx="312" cy="258" r="132" />
        </clipPath>
      </defs>
      <ellipse
        cx="315"
        cy="395"
        rx="136"
        ry="12"
        fill="#477c7b"
        opacity=".08"
      />
      
      <circle
        cx="312"
        cy="258"
        r="132"
        fill={`url(#${id}-sphere)`}
        stroke="#BBD3B8"
      />
      <g clipPath={`url(#${id}-globe)`}>
        <g fill="none" stroke="#96BBA5" strokeWidth=".85" opacity=".36">
          {[44, 89, 130].map((r) => (
            <ellipse key={r} cx="312" cy="258" rx={r} ry="132" />
          ))}
          {[177, 217, 258, 299, 339].map((y, i) => (
            <ellipse
              key={y}
              cx="312"
              cy={y}
              rx="133"
              ry={14 + (2 - Math.abs(i - 2)) * 9}
            />
          ))}
        </g>
        <g
          fill="#88B48A"
          opacity=".69"
          stroke="#F8F4E8"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <path d="M184 206L203 179L231 164L254 164L266 179L286 181L294 200L280 214L271 232L248 238L242 256L229 254L223 235L201 230Z" />
          <path d="M249 255L270 252L293 274L300 296L286 319L282 340L264 359L256 341L257 316L244 292L240 272Z" />
          <path d="M303 157L323 153L331 166L320 182L300 182L293 170Z" />
          <path d="M322 209L330 193L349 183L369 190L386 175L416 187L449 213L443 236L421 242L412 261L394 266L381 245L365 241L358 224L340 227Z" />
          <path d="M324 231L346 225L365 242L370 267L352 302L338 308L329 285L314 268L310 245Z" />
          <path d="M394 316L414 309L435 321L429 339L407 344L389 334Z" />
        </g>
      </g>
      <g fill="none" stroke="#F39B6D" strokeWidth="1.7" strokeOpacity=".5">
        {nodes.map(([x, y], i) => (
          <path
            key={i}
            className="tf-connection"
            style={{ "--tf-delay": `${i * 0.19}s` }}
            d={`M${x} ${y}Q${i < 3 ? x - 45 : x + 60} ${105 + i * 3} 312 83`}
            pathLength="1"
          />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle
            r="14"
            fill="#F39B6D"
            opacity=".1"
            className="tf-node-halo"
            style={{ "--tf-delay": `${i * 0.4}s` }}
          />
          <path
            d="M0 2C-17-10-9-24 0-24S17-10 0 2Z"
            fill={i % 2 ? "#569C66" : "#F39B6D"}
            stroke="white"
            strokeWidth="2"
          />
          <circle cy="-15" r="3" fill="white" />
        </g>
      ))}
      <Lock x={205} y={135} delay={0.8} />
      <Lock x={370} y={155} delay={1.2} />
      <Lock x={295} y={265} delay={1.6} />
      <ellipse
        cx="312"
        cy="61"
        rx="137"
        ry="70"
        fill={`url(#${id}-halo)`}
        className="tf-brand-halo"
      />
      <rect
        x="204"
        y="29"
        width="216"
        height="58"
        rx="17"
        fill="white"
        stroke="#D8E6D4"
      />
      <image
        href={logo}
        x="220"
        y="41"
        maxWidth="100%"
        height="36"
        preserveAspectRatio="xMidYMid meet"
      />
      {/* Model updates legend */}
      <g transform="translate(450 350)">
        <circle
          r="4"
          fill="#F39B6D"
        />
        <text
          x="12"
          y="4"
          className="tf-svg-small tf-weights-legend"
        >
          <tspan x="12" dy="0">
            Model updates via
          </tspan>
          <tspan x="12" dy="16">
            Private Data
          </tspan>
        </text>
      </g>
    </>
  );
  
}

const graphics = [
  FederationSlide,
  FieldSelectionSlide,
  PredictionLayersSlide,
  FineTuningSlide,
  UncertaintySlide,
];

export default function SoilHeroCarousel() {
  const instanceId = useId().replace(/:/g, "");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    getServerMotion,
  );
  const stopped = paused || hidden || reducedMotion;

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (stopped) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      SLIDE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, stopped]);

  function onKeyDown(event) {
    // Keep native Space/Enter button behavior; arrow keys move through slides.
    const direction =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    setIndex(
      (current) => (current + direction + slides.length) % slides.length,
    );
  }

  return (
    <section
      className={`tf-hero-carousel${reducedMotion ? " tf-reduced-motion" : ""}`}
      aria-label="TerraFed illustrated workflow"
      aria-roledescription="carousel"
      style={{ "--tf-fade": `${FADE_DURATION_MS}ms` }}
      onKeyDown={onKeyDown}
    >
      <div
        className="tf-carousel-stage"
        aria-live={stopped ? "polite" : "off"}
        aria-atomic="true"
      >
        {slides.map((slide, i) => {
          const Graphic = graphics[i];
          return (
            <div
              key={slide.title}
              id={`${instanceId}-slide-${i}`}
              className={`tf-carousel-slide${index === i ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of 5: ${slide.title}`}
              aria-hidden={index !== i}
            >
              <div className="tf-graphic">
                <svg viewBox="0 0 640 430" aria-hidden="true" focusable="false">
                  <Graphic id={`${instanceId}-${i}`} />
                </svg>
              </div>
              <div className="tf-art-key">
                {i === 2 && (
                  <>
                    <span>
                      <i className="tf-swatch tf-swatch-organic" />
                      Soil organic matter
                    </span>
                    <span>
                      <i className="tf-swatch tf-swatch-clay" />
                      Clay
                    </span>
                  </>
                )}
                {i === 4 && (
                  <>
                    <span>Uncertainty</span>
                    <span className="tf-mobile-scale">
                      Lower <i /> Higher
                    </span>
                  </>
                )}
              </div>
              <div className="tf-carousel-copy">
                <div className="tf-carousel-category-row">
                  <p className="tf-carousel-category">{slide.category}</p>
                  
                </div>
                <h2>{slide.title}</h2>
                <p className="tf-carousel-description">{slide.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="tf-carousel-bottom">
        <div
          className="tf-carousel-dots"
          role="group"
          aria-label="Choose a workflow slide"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Show slide ${i + 1}: ${slide.title}`}
              aria-current={index === i ? "true" : undefined}
              aria-controls={`${instanceId}-slide-${i}`}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="tf-carousel-pause"
          aria-label={
            paused ? "Resume automatic slides" : "Pause automatic slides"
          }
          aria-pressed={paused}
          disabled={reducedMotion}
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reducedMotion ? (
            <svg viewBox="0 0 15 15" aria-hidden="true">
              <path d="M5 3L12 8L5 13Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3V13M11 3V13" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
          <span>{reducedMotion ? "Manual" : paused ? "" : ""}</span>
        </button>
      </div>
    </section>
  );
}
