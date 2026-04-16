import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MdNorthEast } from "react-icons/md";

const navLinks = [
  { label: "Benefits", path: "/#benefits", sectionId: "benefits" },
  { label: "How It Works", path: "/#features", sectionId: "features" },
  { label: "Contact", path: "/contact", sectionId: "contact" },
];

function Navbar({
  onHeightChange,
  activeSection,
  ctaLabel = "Book a Demo",
  ctaPath = "/contact",
  logoText = "TerraFedLogo",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

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
    if (path === "/contact") {
      if (location.pathname === "/contact") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/contact");
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
      return;
    }

    if (path.startsWith("/#")) {
      const id = path.slice(2);

      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return;
    }

    navigate(path);
  }

  function handleCtaClick() {
    handlePathClick(ctaPath);
  }

  const currentSection =
    location.pathname === "/contact" ? "contact" : activeSection;
  const hideCta = location.pathname === "/contact";

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
      <div
        onClick={handleLogoClick}
        style={{
          color: "black",
          fontSize: 30,
          fontWeight: "500",
          lineHeight: "36px",
          cursor: "pointer",
        }}
      >
        {logoText}
      </div>

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

          return (
            <div
              key={label}
              onClick={() => handlePathClick(path)}
              style={{
                position: "relative",
                color: isActive ? "#0FD12F" : "black",
                fontSize: 14,
                fontWeight: "700",
                lineHeight: "19.6px",
                cursor: "pointer",
                paddingBottom: 4,
                transition: "color 0.25s ease",
              }}
            >
              {label}
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
                initial={{ width: 0 }}
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          );
        })}
      </div>

      <div
        onClick={hideCta ? undefined : handleCtaClick}
        aria-hidden={hideCta}
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
          cursor: hideCta ? "default" : "pointer",
          visibility: hideCta ? "hidden" : "visible",
          pointerEvents: hideCta ? "none" : "auto",
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
        <MdNorthEast style={{ color: "white", fontSize: 12 }} />
      </div>
    </div>
  );
}

export default Navbar;
