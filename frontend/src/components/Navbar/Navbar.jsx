import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MdNorthEast } from "react-icons/md";
import logoPng from "../../assets/logo.png";

const navLinks = [
  { label: "Product", path: "/#product", sectionId: "product" },
  { label: "Workflow", path: "/#features", sectionId: "features" },
  { label: "Evidence", path: "/#evidence", sectionId: "evidence" },
  { label: "Partners", path: "/#partners", sectionId: "partners" },
  { label: "Contact", path: "/#contact", sectionId: "contact" },
];

function Navbar({
  onHeightChange,
  activeSection,
  ctaLabel = "Join the Waitlist",
  ctaPath = "/#contact",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [hoveredSection, setHoveredSection] = useState(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateHeight = () => {
      onHeightChange?.(nav.offsetHeight);
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(nav);

    return () => ro.disconnect();
  }, [onHeightChange]);

  function handleLogoClick() {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/");
  }

  function handlePathClick(path) {
    if (path.startsWith("/#")) {
      const id = path.slice(2);

      if (location.pathname === "/") {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        document.getElementById(id)?.scrollIntoView({
          behavior: reduceMotion ? "instant" : "smooth",
          block: "start",
        });
      } else {
        // Home handles the hash after navigation, so no timing-based timeout is needed.
        navigate(path);
      }
      return;
    }

    navigate(path);
  }

  function handleCtaClick() {
    handlePathClick(ctaPath);
  }

  const currentSection = activeSection;

  return (
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
      {/* TerraFed Logo */}
      <div
        onClick={handleLogoClick}
        role="link"
        tabIndex={0}
        aria-label="TerraFed - Return to homepage"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleLogoClick();
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <img
          src={logoPng}
          alt="TerraFed"
          style={{
            height: 36,
            width: "auto",
            maxWidth: 220,
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Navigation Links */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 20,
          paddingBottom: 20,
          background: "rgba(255,255,255,0.40)",
          overflow: "hidden",
          borderRadius: 100,
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          display: "flex",
          alignItems: "center",
          gap: 27,
        }}
      >
        {navLinks.map(({ label, path, sectionId }) => {
          const isActive = currentSection === sectionId;
          const isHighlighted = isActive || hoveredSection === sectionId;

          return (
            <button
              key={label}
              type="button"
              className={
                sectionId === "evidence" || sectionId === "partners"
                  ? "hidden xl:inline-block"
                  : undefined
              }
              onClick={() => handlePathClick(path)}
              onMouseEnter={() => setHoveredSection(sectionId)}
              onMouseLeave={() => setHoveredSection(null)}
              onFocus={() => setHoveredSection(sectionId)}
              onBlur={() => setHoveredSection(null)}
              aria-current={isActive ? "location" : undefined}
              style={{
                position: "relative",
                color: isHighlighted ? "#0FD12F" : "black",
                fontSize: 14,
                fontFamily: "inherit",
                fontWeight: "700",
                lineHeight: "19.6px",
                cursor: "pointer",
                padding: 0,
                paddingBottom: 4,
                border: "none",
                background: "transparent",
                transition: "color 0.25s ease",
              }}
            >
              {label}

              <motion.span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 2,
                  borderRadius: 2,
                  background: "#0FD12F",
                  display: "block",
                  transformOrigin: "left center",
                  pointerEvents: "none",
                }}
                initial={false}
                animate={{ scaleX: isHighlighted ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          );
        })}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleCtaClick}
        style={{
          paddingLeft: 22,
          paddingRight: 22,
          paddingTop: 14,
          paddingBottom: 14,
          border: "none",
          fontFamily: "inherit",
          background: "#008CD8",
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
          {ctaLabel}
        </div>

        <MdNorthEast
          style={{
            color: "white",
            fontSize: 12,
          }}
        />
      </button>
    </div>
  );
}

export default Navbar;
