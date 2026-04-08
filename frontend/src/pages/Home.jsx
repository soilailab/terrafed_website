import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAutoGraph,
  MdPublic,
  MdTranslate,
  MdBarChart,
  MdCheck,
  MdClose,
  MdNorthEast,
} from "react-icons/md";
import SoilHero from "../components/SoilHero";
import SatBanner from "../assets/satbanner.png";





const screenModules = import.meta.glob("../assets/examplescreens/screen*.png", {
  eager: true,
  import: "default",
});
const screens = Object.keys(screenModules)
  .sort()
  .map((k) => screenModules[k]);

function Home() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  const featureItems = [
    {
      num: "01 | Custom Area Selection",
      text: "Choose any field or parcel boundary for analysis — no more manual cropping or irrelevant surrounding pixels.",
      img: screens[0],
    },
    {
      num: "02 | Satellite Imagery Processing",
      text: "Processed Sentinel-2 data is transformed into clear soil organic matter maps, revealing spatial patterns and hotspots across your land, all downloaded locally and ready to share in minutes.",
      img: screens[1],
    },
    {
      num: "03 | TerraFed Algorithms",
      text: "Our global model trained on a summary of users' data, combined with local parcel-level variation, delivers accurate SOM estimates without exposing raw satellite data or proprietary algorithms.",
      img: screens[2],
    },
    {
      num: "04 | SOM Layers",
      text: "Toggle between different SOM visualizations, including raw estimates, confidence intervals, and change detection maps to understand soil health dynamics.",
      img: screens[3],
    },
    {
      num: "05 | Documented & Ready to Share",
      text: "All processed outputs are accompanied by clear documentation of methods and assumptions, making it easy to share insights with farmers, consultants, and policymakers without needing to expose raw data or complex algorithms.",
      img: screens[4],
    },
  ];


  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => {
      setNavHeight(nav.offsetHeight);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = ["benefits", "features", "contact"];
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          } else {
            setActiveSection((prev) => (prev === id ? null : prev));
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return (
    <div className="relative flex flex-col items-center bg-white px-4 pb-5 md:px-10">
      {/* -- Top Navigation -- */}
      <div
        id="site-nav"
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "white",
          width: "100%",
          maxWidth: 1500,
          paddingTop: 20,
          paddingBottom: 12,
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            color: "black",
            fontSize: 30,
            fontWeight: "500",
            lineHeight: "36px",
            cursor: "pointer",
          }}
        >
          TerraFedLogo
        </div>
        <div
          style={{
            paddingLeft: 22,
            paddingRight: 22,
            paddingTop: 14,
            paddingBottom: 14,
            background: "#2A7AB3",
            borderRadius: 1000,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            display: "flex",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "700",
              lineHeight: "19.6px",
            }}
          >
            Learn More
          </div>
          <MdNorthEast style={{ color: "white", fontSize: 12 }} />
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ width: "100%", maxWidth: 1500 }}>
        <SoilHero navHeight={navHeight} />
      </div>
      <div style={{ paddingBottom: 60 }} />

      {/* Main */}
      <div
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
        }}
      >
        {/* Benefits Section */}
        <div
          id="benefits"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingTop: 80,
            paddingBottom: 120,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              paddingTop: 80,
              paddingBottom: 60,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 50,
              display: "flex",
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                textAlign: "center",
                gap: 50,
                display: "flex",
              }}
            >
              <div
                style={{
                  color: "#0FD12F",
                  fontSize: 30,
                  fontWeight: "400",
                  lineHeight: "16.8px",
                }}
              >
                Why TerraFed?
              </div>
              <div
                style={{
                  alignSelf: "stretch",
                  color: "black",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: "400",
                  lineHeight: "1em",
                }}
              >
                Field level insights, privacy-governed by design.
              </div>
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#6F6F6F",
                  fontSize: 15,
                  fontWeight: "400",
                  lineHeight: "21px",
                }}
              >
                TerraFed tackles the biggest obstacle for providing accurate
                soil analytics to growers and land managers: data privacy. The
                app's design is developed to be easy-to-use, handling processing
                and machine-learning infrastructure in an automated environment,
                delivering field maps with SOC estimates without exposing raw
                satellite data or proprietary algorithms. This approach allows
                users to gain critical insights into soil health while ensuring
                that sensitive data remains secure and private.
              </div>
            </div>
            <div
              style={{
                alignSelf: "stretch",
                paddingTop: 100,
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
                  icon: <MdAutoGraph size={24} />,
                  title: "Amplify Field Insights",
                  desc: "Move from raw spectral bands to soil organic matter maps with automated analysis built for agronomists and land managers.",
                },
                {
                  icon: <MdPublic size={24} />,
                  title: "Monitor at Scale",
                  desc: "Track soil health across multiple parcels and regions consistently and without manual fieldwork bottlenecks.",
                },
                {
                  icon: <MdTranslate size={24} />,
                  title: "Accessible to Every Stakeholder",
                  desc: "Translate complex remote sensing outputs into clear visuals that farmers, consultants, and policymakers can act on.",
                },
                {
                  icon: <MdBarChart size={24} />,
                  title: "Visualize Change Over Time",
                  desc: "Generate time-series SOM maps that illustrate seasonal and long-term trends across your monitored landscapes.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: "1 1 0",
                    minWidth: 265,
                    paddingTop: 40,
                    paddingBottom: 40,
                    paddingRight: 20,
                    borderTop: "1px #E9E9E9 solid",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 24,
                    display: "inline-flex",
                  }}
                >
                  {item.icon}
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
            paddingBottom: 120,
            paddingTop: 80,
            borderTop: "1px #E9E9E9 solid",
            flexDirection: "column",
            alignItems: "center",
            gap: 60,
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          {/* --- section header --- */}
          <div
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              display: "flex",
              textAlign: "center",
              marginTop: -20,
            }}
          >
            <div
              style={{
                color: "black",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: "400",
                lineHeight: "1em",
              }}
            >
              Read Your Land
            </div>
            <div
              style={{
                color: "#6F6F6F",
                fontSize: 15,
                fontWeight: "400",
                lineHeight: "21px",
                maxWidth: 640,
              }}
            >
              TerraFed processes Sentinel-2 imagery into clear SOM gradient maps
              — revealing what your soil is doing across every parcel.
            </div>
          </div>
          {/* --- Two-column panel --- */}
          <div
            style={{
              alignSelf: "stretch",
              justifyContent: "flex-start",
              alignItems: "stretch",
              gap: 20,
              display: "inline-flex",
              flexWrap: "wrap",
              marginTop: -20,
            }}
          >
            <div
              style={{
                flex: "0 0 450px",
                paddingTop: 30,
                paddingBottom: 80,
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
                        role="button"
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
                            style={{ display: "block", color: isOpen ? "#0FD12F" : "#6F6F6F" }}
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
                          style={{ color: isOpen ? "#0FD12F" : "#6F6F6F", flexShrink: 0 }}
                        >
                          {/* Horizontal bar — always visible */}
                          <line
                            x1="5" y1="12"
                            x2="19" y2="12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          {/* Vertical bar — rotates 90° to disappear when open */}
                          <motion.line
                            x1="12" y1="5"
                            x2="12" y2="19"
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
            <div
              style={{
                flex: "1 1 500px",
                height: 560,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 30,
                  objectFit: "contain",
                  paddingLeft: 10,
                }}
                src={featureItems[activeFeature].img}
                alt={featureItems[activeFeature].text}
              />
            </div>
          </div>
        </div>

        {/* Sent2 Display */}
        <div
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingTop: 80,
            paddingBottom: 80,
            borderTop: "1px #E9E9E9 solid",
            flexDirection: "column",
            gap: 80,
            display: "flex",
          }}
        >
          <img
            style={{
              alignSelf: "center",
              width: "80%",
              height: "80%",
              borderRadius: 30,
              objectFit: "cover",
            }}
            src={SatBanner}
            alt="Soil map overview"
          />

          {/* Three-step process panel */}
          <div
            style={{
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 20,
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                num: "01",
                title: "Connect Your Area",
                desc: "Define your parcel boundaries and we pull the latest cloud-free Sentinel-2 scenes automatically.",
              },
              {
                num: "02",
                title: "Process & Classify",
                desc: "Our pipeline applies validated spectral indices to produce calibrated SOM estimates per field.",
              },
              {
                num: "03",
                title: "Deliver Actionable Maps",
                desc: "Receive export-ready reports and interactive maps your whole team can interpret and act on.",
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  flex: "1 1 0",
                  minWidth: 240,
                  paddingTop: 60,
                  paddingBottom: 40,
                  paddingRight: 30,
                  borderTop: "1px #E9E9E9 solid",
                  flexDirection: "column",
                  gap: 80,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    color: "#929292",
                    fontSize: 120,
                    fontWeight: "400",
                    lineHeight: "120px",
                  }}
                >
                  {item.num}
                </div>
                <div
                  style={{ flexDirection: "column", gap: 20, display: "flex" }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: 22,
                      fontWeight: "400",
                      lineHeight: "28px",
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
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width Image */}
        <div
          style={{
            alignSelf: "stretch",
            paddingBottom: 40,
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            display: "flex",
          }}
        >
        </div>

        {/* Contact / CTA */}
        <div
          id="contact"
          style={{
            width: "100%",
            maxWidth: 1500,
            paddingLeft: "clamp(20px, 20vw, 300px)",
            paddingRight: "clamp(20px, 20vw, 300px)",
            paddingTop: 60,
            paddingBottom: 120,
            borderTop: "0.50px #E9E9E9 solid",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            display: "flex",
            scrollMarginTop: navHeight + 20,
          }}
        >
          <div
            style={{
              color: "black",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: "400",
              lineHeight: "1em",
              textAlign: "center",
            }}
          >
            Start mapping your soil
          </div>
          <div
            style={{
              color: "#6F6F6F",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: "21px",
              textAlign: "center",
            }}
          >
            Schedule a demo to see how TerraFed can help you understand and improve your soil health data.
          </div>
          <div
            style={{
              alignSelf: "stretch",
              paddingLeft: 22,
              paddingRight: 22,
              paddingTop: 14,
              paddingBottom: 14,
              background: "#0FD12F",
              borderRadius: 1000,
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              display: "inline-flex",
              cursor: "pointer",
            }}
          >
            <div style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
              Book a Demo
            </div>
            <MdNorthEast style={{ color: "white", fontSize: 12 }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          paddingTop: 40,
          paddingBottom: 20,
          borderTop: "1px #E9E9E9 solid",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 27 }}>
          {[
            { label: "Benefits", action: () => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "How It Works", action: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Contact", action: () => navigate("/contact") },
          ].map(({ label, action }) => (
            <div
              key={label}
              onClick={action}
              style={{
                color: "black",
                fontSize: 14,
                fontWeight: "700",
                lineHeight: "19.6px",
                cursor: "pointer",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#0FD12F", fontSize: 12, fontWeight: "400" }}>
            TerraFed 2026
          </div>
          <div style={{ color: "#6F6F6F", fontSize: 12 }}>|</div>
          <div style={{ color: "#0FD12F", fontSize: 12, fontWeight: "400" }}>
            <a
              href="https://innovate.research.ufl.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              UF Innovate
            </a>
          </div>
          <div style={{ color: "#6F6F6F", fontSize: 12 }}>|</div>
          <div style={{ color: "#111111", fontSize: 12, fontWeight: "400" }}>
            All Rights Reserved
          </div>
        </div>
      </div>

      {/* Floating Pill Nav */}
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 20,
          paddingBottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          top: 16,
          position: "fixed",
          background: "rgba(255,255,255,0.40)",
          overflow: "hidden",
          borderRadius: 100,
          backdropFilter: "blur(15px)",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 27,
          display: "inline-flex",
          zIndex: 50,
        }}
      >
        {[
          { label: "Benefits", id: "benefits" },
          { label: "How It Works", id: "features" },
          { label: "Contact", id: null, path: "/contact" },
        ].map(({ label, id, path }) => {
          const isActive = id ? activeSection === id : false;
          return (
            <motion.div
              key={label}
              onClick={() =>
                path ? navigate(path) : document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                position: "relative",
                color: isActive ? "#0FD12F" : "black",
                fontSize: 14,
                fontWeight: "700",
                lineHeight: "19.6px",
                cursor: "pointer",
                paddingBottom: 3,
                transition: "color 0.25s ease",
              }}
            >
              {label}
              {/* Animated underline */}
              <motion.span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 2,
                  borderRadius: 2,
                  background: "#0FD12F",
                  display: "block",
                }}
                initial={false}
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
