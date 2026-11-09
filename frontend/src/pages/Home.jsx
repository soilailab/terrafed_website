import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdMap,
  MdPinDrop,
  MdGradient,
  MdMyLocation,
  MdCheck,
  MdClose,
} from "react-icons/md";
import SoilHero from "../components/SoilHero";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import WaitlistForm from "../components/WaitlistForm";
import { mediaAssets } from "../data/mediaAssets";
const screenModules = import.meta.glob("../assets/examplescreens/screen*.png", {
  eager: true,
  import: "default",
});
const screens = Object.keys(screenModules)
  .sort()
  .map((k) => screenModules[k]);
// Shared vertical rhythm across the homepage's five content sections.
const SECTION_TOP_PADDING = "clamp(45px, 5vw, 65px)";
const SECTION_GAP = "clamp(40px, 5vw, 72px)";

function Home() {
  const { hash } = useLocation();
  const [navHeight, setNavHeight] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const featureItems = [
    {
      num: "01 | Define Your Area",
      text: "Draw a field, upload a boundary, or select an existing parcel. TerraFed keeps the analysis focused on the area that matters to the partner workflow.",
      img: screens[0],
      imageAlt: "Existing TerraFed dashboard showing a selected field boundary",
      imageCaption: "Existing dashboard view: area-of-interest selection.",
      mapDetails:
        "Field boundary shown. No soil-property prediction is displayed in this view.",
      status: "Demonstrated",
    },
    {
      num: "02 | Prepare Earth-Observation Inputs",
      text: "Review available Sentinel-2 observations and prepare a valid bare-soil or multi-date input while filtering clouds, vegetation, and unusable pixels.",
      img: screens[1],
      imageAlt:
        "Existing TerraFed dashboard showing satellite imagery for a selected area",
      imageCaption:
        "Existing dashboard imagery; automated quality filtering is not shown.",
      mapDetails:
        "Observation imagery shown. Cloud, vegetation and bare-soil filtering are not verified by this screenshot.",
      status: "Prototype",
    },
    {
      num: "03 | Generate a Baseline Soil Map",
      text: "Apply pre-trained model knowledge to generate a first-pass map for the selected soil property. Display the prediction together with model version, data coverage, and uncertainty.",
      img: screens[2],
      imageAlt:
        "Existing TerraFed dashboard showing a global-model soil-property prediction map",
      imageCaption:
        "Existing global-model prediction; uncertainty and model provenance are not pictured.",
      mapDetails:
        "Prediction layer shown. Model-version, coverage and uncertainty overlays are not verified in this view.",
      secondaryMediaSlot: mediaAssets.uncertaintyMap,
      status: "Prototype",
    },
    {
      num: "04 | Adapt with Local Evidence",
      text: "Add local soil measurements to evaluate and improve a partner-specific model. Compare baseline and adapted performance while sensitive observations remain under the partner's control.",
      img: null,
      mediaSlot: mediaAssets.localAdaptationComparison,
      imageCaption:
        "Local-adaptation comparison screenshot has not yet been supplied.",
      mapDetails:
        "No local performance comparison is shown. Only explicitly approved model information may contribute to a wider system.",
      status: "Planned",
    },
    {
      num: "05 | Plan the Next Samples and Export",
      text: "Set a sampling budget, prioritize locations using uncertainty and coverage, and export the map, recommended points, assumptions, and model provenance for the next monitoring cycle.",
      img: null,
      mediaSlot: mediaAssets.recommendedSamplingPlan,
      imageCaption:
        "Verified sampling recommendations and plan-export visuals are not yet available.",
      mapDetails:
        "No ranked sampling locations or numerical sampling results are shown.",
      status: "Planned",
    },
  ];
  // Support deep links (including the legacy /contact redirect) to in-page sections.
  useEffect(() => {
    if (!hash) return;
    const targetId = decodeURIComponent(hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  function scrollToSection(id) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    const sectionIds = [
      "product",
      "features",
      "evidence",
      "partners",
      "contact",
    ];
    let animationFrame = null;

    // One active section at a time. The section whose top has most recently
    // passed the activation line stays active across the whitespace between sections.
    const updateActiveSection = () => {
      animationFrame = null;
      const activationLine =
        navHeight + Math.min(120, window.innerHeight * 0.18);
      let nextSection = null;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextSection = id;
        }
      }

      // The last section can be shorter than the viewport.
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 6
      ) {
        nextSection = "contact";
      }

      setActiveSection((previous) =>
        previous === nextSection ? previous : nextSection,
      );
    };

    const scheduleUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [navHeight]);
  // Submit waitlist interest to the Flask contact endpoint. An unset base URL
  // uses the same-origin /api route (appropriate behind a production proxy).

async function submitWaitlist(formData) {
  const endpoint =
    import.meta.env.VITE_WAITLIST_API_URL ||
    "https://geoserver-portal.soilslab.ai/fedfarms-accounts-api/api/access-requests";

  const reason = [
    formData.message?.trim() ||
      "I would like to join the TerraFed waitlist.",
    formData.role ? `Role: ${formData.role}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const payload = {
    full_name: formData.name.trim(),
    email: formData.email.trim(),
    organization: formData.organization.trim(),
    reason,
  };

  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Unable to connect to the waitlist service. Please try again later."
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.detail ||
      "Unable to join the waitlist. Please try again."
    );
  }

  return result;
}


  return (
    <div className="relative flex flex-col items-center bg-white px-4 pb-5 md:px-10">
      <Navbar onHeightChange={setNavHeight} activeSection={activeSection} />
      {/* Hero Header */}
      <div style={{ width: "100%", maxWidth: 1500 }}>
        <SoilHero
          onExploreWorkflow={() => scrollToSection("features")}
          onJoinWaitlist={() => scrollToSection("contact")}
        />
      </div>
      <div style={{ paddingBottom: 24 }} />
      {/* Main */}
      <div
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
          rowGap: SECTION_GAP,
        }}
      >
        {/* Product Section */}
        <div
          id="product"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingTop: SECTION_TOP_PADDING,
            paddingBottom: "clamp(50px, 6vw, 86px)",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              paddingTop: 0,
              paddingBottom: 22,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 32,
              display: "flex",
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                textAlign: "left",
                gap: 20,
                display: "flex",
              }}
            >
              <div
                style={{
                  color: "#08753B",
                  fontSize: 15,
                  fontWeight: "700",
                  letterSpacing: "0.07em",
                  lineHeight: "1.4",
                }}
              >
                Why TerraFed?
              </div>
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#0C2431",
                  maxWidth: 1000,
                  fontSize: "clamp(32px, 4.6vw, 60px)",
                  fontWeight: "400",
                  lineHeight: "1em",
                }}
              >
                Field level insights, privacy-governed by design.
              </div>
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#435B66",
                  maxWidth: "100ch",
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: "400",
                  lineHeight: "1.7",
                }}
              >
                Organizations need locally relevant soil models, but valuable
                observations are often distributed across customers, programs,
                and operating regions. TerraFed provides a privacy-governed
                framework for starting from shared model knowledge, adapting
                with local evidence, and improving predictions without requiring
                every partner to pool raw observations. The result is a clearer
                path from a first estimate to a continuously improving local
                model.
              </div>
              <p
                style={{
                  maxWidth: "110ch",
                  color: "#435B66",
                  fontSize: 14,
                  lineHeight: 1.6,
                  textAlign: "left",
                }}
              >
                Sensitive local soil observations, operational data, customer
                data, and partner workflows remain governed by their data
                holders. Only explicitly approved model information may
                contribute to shared knowledge. Public Sentinel-2 imagery is not
                treated as private data.
              </p>
            </div>
            <div
              style={{
                alignSelf: "stretch",
                paddingTop: 26,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 20,
                display: "inline-flex",
                flexWrap: "wrap",
                alignContent: "flex-start",
              }}
            >
              {[
                {
                  icon: <MdMap size={24} />,
                  title: "Start with shared model knowledge",
                  status: "Demonstrated",
                  desc: "Generate a defensible first estimate from Earth observation and pre-trained knowledge before extensive local sampling.",
                },
                {
                  icon: <MdPinDrop size={24} />,
                  title: "Adapt to local evidence",
                  status: "Planned",
                  desc: "Use local soil measurements to evaluate and improve a partner-specific model while retaining governance over sensitive observations.",
                },
                {
                  icon: <MdGradient size={24} />,
                  title: "Make uncertainty visible",
                  status: "Planned",
                  desc: "Show where predictions are more reliable, where they are less certain, and where additional evidence is needed.",
                },
                {
                  icon: <MdMyLocation size={24} />,
                  title: "Spend sampling budgets strategically",
                  status: "Planned",
                  desc: "Prioritize new observations using model uncertainty, spatial coverage, and environmental diversity.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: "1 1 0",
                    minWidth: 265,
                    paddingTop: 30,
                    paddingBottom: 30,
                    paddingRight: 20,
                    borderTop: "1px #E9E9E9 solid",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 24,
                    display: "inline-flex",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "stretch",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "#008CD8",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      style={{
                        marginLeft: "auto",
                        flexShrink: 0,
                        borderRadius: 999,
                        padding: "4px 10px",
                        filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))",
                        background:
                          item.status === "Demonstrated"
                            ? "#E7F7ED"
                            : "#FFF2D7",
                        color:
                          item.status === "Demonstrated"
                            ? "#13613C"
                            : "#65420E",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div
                    style={{
                      alignSelf: "stretch",
                      flexDirection: "column",
                      gap: 20,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        color: "#6F6F6F",
                        fontSize: 15,
                        fontWeight: "400",
                        lineHeight: "21px",
                        textAlign: "left",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* App Features Section */}
        <div
          id="features"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingBottom: "clamp(55px, 6vw, 90px)",
            paddingTop: SECTION_TOP_PADDING,
            borderTop: "1px #E9E9E9 solid",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "clamp(30px, 4vw, 52px)",
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          {/* --- section header --- */}
          <div
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 18,
              display: "flex",
              textAlign: "left",
              marginTop: 0,
              maxWidth: "150ch",
            }}
          >
            <div
              style={{
                color: "#0C2431",
                fontSize: "clamp(32px, 4.6vw, 60px)",
                fontWeight: "400",
                lineHeight: "1em",
              }}
            >
              From First Estimate to Better Local Evidence
            </div>
            <div
              style={{
                color: "#435B66",
                fontSize: 16,
                fontWeight: "400",
                lineHeight: "1.65",
                maxWidth: "150ch",
              }}
            >
              TerraFed connects Earth observation, local measurements,
              uncertainty, and sampling decisions in one improvement cycle.
            </div>
          </div>
          {/* --- Two-column panel --- */}
          <div
            className="terrafed-workflow-panel"
            style={{
              alignSelf: "stretch",
              justifyContent: "flex-start",
              alignItems: "stretch",
              gap: 24,
              display: "flex",
              flexWrap: "wrap",
              marginTop: 0,
            }}
          >
            <div
              className="terrafed-workflow-accordion"
              style={{
                flex: "1 1 350px",
                maxWidth: "min(100%, 450px)",
                minWidth: 0,
                paddingTop: 12,
                paddingBottom: 24,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 40,
                display: "inline-flex",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                {featureItems.map((item, i) => {
                  const isOpen = i === activeFeature;
                  return (
                    <motion.div
                      key={item.num}
                      style={{ alignSelf: "stretch", position: "relative" }}
                      initial="initial"
                      whileHover="hover"
                    >
                      {/* Accordion header */}
                      <div
                        onClick={() => setActiveFeature(i)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveFeature(i);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F86B7]"
                        aria-expanded={isOpen}
                        aria-controls={`feature-panel-${i}`}
                        style={{
                          boxSizing: "border-box",
                          width: "100%",
                          paddingTop: 10,
                          paddingBottom: isOpen ? 16 : 40,
                          paddingRight: 10,
                          borderTop: `1px ${isOpen ? "#0FD12F" : "#E9E9E9"} solid`,
                          justifyContent: "space-between",
                          alignItems: "center",
                          display: "flex",
                          cursor: "pointer",
                          transition: "padding-bottom 0.35s ease",
                        }}
                      >
                        {/* Label with ghost-text hover slide */}
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            fontSize: 18,
                            fontWeight: "700",
                            lineHeight: "25px",
                          }}
                        >
                          {/* Visible label */}
                          <motion.span
                            style={{
                              display: "block",
                              color: isOpen ? "#0FD12F" : "#6F6F6F",
                            }}
                            variants={{
                              initial: { y: 0 },
                              hover: { y: "-100%" },
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            {item.num}
                          </motion.span>
                          {/* Ghost label slides up from below */}
                          <motion.span
                            aria-hidden="true"
                            style={{
                              display: "block",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              color: isOpen ? "#0FD12F" : "#6F6F6F",
                            }}
                            variants={{
                              initial: { y: "100%" },
                              hover: { y: 0 },
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            {item.num}
                          </motion.span>
                        </div>
                        {/* ExpandIcon — + morphs to − on open */}
                        <motion.svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          style={{
                            color: isOpen ? "#0FD12F" : "#6F6F6F",
                            flexShrink: 0,
                          }}
                        >
                          {/* Horizontal bar — always visible */}
                          <line
                            x1="5"
                            y1="12"
                            x2="19"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          {/* Vertical bar — rotates 90° to disappear when open */}
                          <motion.line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            initial={false}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{ originX: "50%", originY: "50%" }}
                          />
                        </motion.svg>
                      </div>
                      {/* Expanded body — true height: auto animation */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`feature-panel-${i}`}
                            role="region"
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                paddingBottom: 20,
                                paddingRight: 20,
                                color: "black",
                                fontSize: 15,
                                fontWeight: "400",
                                lineHeight: "21px",
                              }}
                            >
                              {item.text}
                              {item.status && (
                                <div
                                  style={{
                                    marginTop: 14,
                                    display: "inline-flex",
                                    padding: "5px 10px",
                                    borderRadius: 999,
                                    background:
                                      item.status === "Demonstrated"
                                        ? "#E7F7ED"
                                        : "#FFF2D7",
                                    border:
                                      item.status === "Demonstrated"
                                        ? "1px solid #BDE5C7"
                                        : "1px solid #F3A73B",
                                    color:
                                      item.status === "Demonstrated"
                                        ? "#13613C"
                                        : "#65420E",
                                    fontSize: 12,
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.status}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Hover underline sweep (from repo) */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: 1,
                          overflow: "hidden",
                          pointerEvents: "none",
                        }}
                      >
                        <motion.div
                          style={{ height: "100%", background: "#0FD12F" }}
                          variants={{
                            initial: { width: 0 },
                            hover: { width: "100%" },
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* <div
                style={{
                  paddingLeft: 22,
                  paddingRight: 22,
                  paddingTop: 14,
                  paddingBottom: 14,
                  background: "#DFECC6",
                  borderRadius: 1000,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    color: "black",
                    fontSize: 14,
                    fontWeight: "700",
                    lineHeight: "19.6px",
                  }}
                >
                  Discover More
                </div>
              </div> */}
            </div>
            <figure
              className="terrafed-workflow-media"
              style={{
                flex: "1.4 1 480px",
                minWidth: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "flex-start",
                gap: 12,
              }}
            >
              {featureItems[activeFeature].img ? (
                <img
                  src={featureItems[activeFeature].img}
                  alt={featureItems[activeFeature].imageAlt}
                  loading="lazy"
                  decoding="async"
                  width="2848"
                  height="1494"
                  style={{
                    width: "100%",
                    maxHeight: 510,
                    height: "auto",
                    borderRadius: 18,
                    objectFit: "contain",
                    background: "#F5F8F7",
                  }}
                />
              ) : (
                <div
                  role="img"
                  aria-label={featureItems[activeFeature].mediaSlot.alt}
                  className="terrafed-media-placeholder"
                  data-media-slot={
                    featureItems[activeFeature].mediaSlot.filename
                  }
                >
                  <span className="terrafed-media-status">Planned</span>
                  <strong style={{ fontSize: "clamp(17px, 2vw, 23px)" }}>
                    {featureItems[activeFeature].num.slice(5)}
                  </strong>
                  <span
                    style={{ fontSize: 14, maxWidth: "42ch", lineHeight: 1.65 }}
                  >
                    Verified interface capture pending. No scientific output or
                    sampling recommendations are simulated.
                  </span>
                </div>
              )}
            </figure>
          </div>
        </div>
        {/* Research evidence */}
        <section
          id="evidence"
          aria-labelledby="evidence-heading"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingTop: SECTION_TOP_PADDING,
            paddingBottom: "clamp(60px, 6vw, 90px)",
            borderTop: "1px #E9E9E9 solid",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 34,
            scrollMarginTop: navHeight + 20,
          }}
        >
          <div
            style={{
              color: "#08753B",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Evidence
          </div>
          <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] lg:gap-12">
            {/* Left: heading, paragraph, research link */}
            <div
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 24,
              }}
            >
              <h2
                id="evidence-heading"
                style={{
                  maxWidth: 860,
                  margin: 0,
                  color: "#0C2431",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  textAlign: "left",
                }}
              >
                Research-backed. Built for real-word application.
              </h2>
              <p
                style={{
                  maxWidth: 800,
                  margin: 0,
                  color: "#435B66",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.65,
                  textAlign: "left",
                }}
              >
                TerraFed builds on a scientific foundation supported by a
                research case study spanning 50 farms in Brazil. The study
                demonstrated the potential of locally adapted soil models while
                exploring approaches that reduce the need to centralize
                sensitive observations.
                <br />
                These findings provide a foundation for TerraFed's development
                as a practical platform that combines Earth observation, local
                soil measurements, and adaptive modeling to deliver more
                relevant, uncertainty-aware soil intelligence.
              </p>
              <motion.a
                href="https://doi.org/10.1016/j.jag.2025.105067"
                target="_blank"
                rel="noopener noreferrer"
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileFocus="hover"
                variants={{
                  rest: { color: "#008CD8" },
                  hover: { color: "#00B029" },
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  gap: 6,
                  width: "fit-content",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  paddingBottom: 5,
                }}
              >
                Read the peer-reviewed research (DOI)
                <span aria-hidden="true">↗</span>
                <motion.span
                  aria-hidden="true"
                  variants={{
                    rest: {
                      scaleX: 0,
                      backgroundColor: "#008CD8",
                    },
                    hover: {
                      scaleX: 1,
                      backgroundColor: "#00B029",
                    },
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 1.5,
                    transformOrigin: "left center",
                    pointerEvents: "none",
                  }}
                />
              </motion.a>
            </div>
            {/* Right: three stacked highlights */}
            <div
              aria-label="TerraFed research and pilot milestones"
              style={{
                display: "flex",
                marginTop: 20,
                flexDirection: "column",
                gap: 60,
                width: "100%",
                minWidth: 0,
              }}
            >
              {[
                "Research tested across 50 farms in Brazil",
                "Florida pilots in preparation",
                "Supported by VentureWell",
              ].map((proof) => (
                <div
                  key={proof}
                  style={{
                    width: "100%",
                    padding: "22px 26px",
                    background: "#FFFFFF",
                    border: "1px solid #E3ECE8",
                    borderLeft: "3px solid #13C65B",
                    borderRadius: 12,
                    boxShadow: "0 4px 18px rgba(12, 36, 49, 0.5)",
                    color: "#0C2431",
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.55,
                    letterSpacing: "-0.01em",
                    textAlign: "left",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                >
                  {proof}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Organizational partners */}
        <section
          id="partners"
          aria-labelledby="partners-heading"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingTop: SECTION_TOP_PADDING,
            paddingBottom: "clamp(65px, 6vw, 95px)",
            borderTop: "1px #E9E9E9 solid",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 30,
            scrollMarginTop: navHeight + 20,
          }}
        >
          <div
            style={{
              color: "#08753B",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Partners
          </div>
          <h2
            id="partners-heading"
            style={{
              maxWidth: 1000,
              margin: 0,
              color: "#0C2431",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.08,
              textAlign: "left",
            }}
          >
            Built for organizations that already serve agriculture.
          </h2>
          <p
            style={{
              maxWidth: 800,
              margin: 0,
              color: "#435B66",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.65,
              textAlign: "left",
            }}
          >
            TerraFed is designed to serve as a shared soil-intelligence backbone
            or a partner-specific integration. Agricultural organizations can
            bring locally relevant soil intelligence into their existing
            workflows, with farmers benefiting through the services those
            organizations already provide.
          </p>
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 18,
            }}
          >
            {[
              {
                title: "Agtech and soil-sensing companies",
                description:
                  "Integrate local calibration, uncertainty, and model maintenance into existing customer workflows.",
              },
              {
                title: "Advisory and MRV service providers",
                description:
                  "Support repeatable mapping and monitoring workflows with transparent uncertainty and provenance.",
              },
              {
                title: "Research and public institutions",
                description:
                  "Build locally adapted models across programs without requiring every partner to pool raw observations.",
              },
            ].map((partner) => (
              <div
                key={partner.title}
                style={{
                  flex: "1 1 265px",
                  minWidth: 0,
                  padding: "32px 26px 36px",
                  border: "1px solid #E4ECE7",
                  borderRadius: 18,
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    background: "#13C65B",
                  }}
                  aria-hidden="true"
                />
                <h3
                  style={{
                    margin: 0,
                    color: "#111111",
                    fontSize: 21,
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {partner.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#6F6F6F",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* Waitlist section: the former contact form now lives on the homepage. */}
        <section
          id="contact"
          aria-labelledby="waitlist-heading"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingLeft: "clamp(16px, 10vw, 190px)",
            paddingRight: "clamp(16px, 10vw, 190px)",
            paddingTop: SECTION_TOP_PADDING,
            paddingBottom: "clamp(60px, 7vw, 95px)",
            borderTop: "0.50px #E9E9E9 solid",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          <h2
            id="waitlist-heading"
            style={{
              margin: 0,
              color: "black",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: "400",
              lineHeight: "1.1em",
              textAlign: "center",
            }}
          >
            Be part of what's next for soil intelligence.
          </h2>
          <p
            style={{
              margin: 0,
              color: "#6F6F6F",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: "21px",
              textAlign: "center",
              maxWidth: 760,
            }}
          >
            We are preparing partner-led pilots that connect local soil
            measurements, Earth observation, uncertainty, and model improvement
            in one repeatable workflow.
          </p>
          <div style={{ width: "100%", maxWidth: 760 }}>
            <WaitlistForm onSubmit={submitWaitlist} />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
export default Home;
