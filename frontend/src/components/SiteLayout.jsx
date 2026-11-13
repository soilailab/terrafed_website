import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "./Footer/Footer";

const sections = [
  ["applications", "Applications"],
  ["how", "How it Works"],
  ["story", "Our Story"],
  ["evidence", "Research"],
];

const legacyHashes = {
  "#product": "#how",
  "#features": "#how",
  "#demos": "#applications",
};

const titles = {
  home: "TerraFed | Your Data Stays Yours. AI Works for You.",
  pilot: "Discuss a Pilot | TerraFed",
  missing: "Page Unavailable | TerraFed",
};

function SiteHeader({ locationKey }) {
  const { pathname } = useLocation();

  const [openForLocation, setOpenForLocation] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const menuOpen = openForLocation === locationKey;

  useEffect(() => {
    if (pathname !== "/") return;

    let frameId = null;

    const updateActiveSection = () => {
      const headerHeight =
        document.querySelector(".site-header")?.offsetHeight ?? 76;

      const cutoff = headerHeight + 40;

      const targets = [...sections.map(([id]) => id), "contact"]
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        );

      let active = null;

      for (const section of targets) {
        if (section.getBoundingClientRect().top <= cutoff) {
          active = section.id;
        }
      }

      setActiveSection(active === "contact" ? null : active);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  const closeMenu = () => setOpenForLocation(null);

  return (
    <header className="site-header" id="top">
      <div className="wrap site-nav">
        <Link
          to="/"
          className="site-brand"
          aria-label="TerraFed home"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="TerraFed home"
            style={{
              width: "auto",
              height: "45px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Link>

        <button
          type="button"
          className="mobile-toggle"
          aria-controls="site-nav-links"
          aria-expanded={menuOpen}
          onClick={() => setOpenForLocation(menuOpen ? null : locationKey)}
        >
          Menu <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>

        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          id="site-nav-links"
          aria-label="Main navigation"
        >
          {sections.map(([id, label]) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={
                pathname === "/" && activeSection === id ? "active-section" : ""
              }
              aria-current={
                pathname === "/" && activeSection === id
                  ? "location"
                  : undefined
              }
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}

          <NavLink
            className="button button-coral"
            to="/discuss-a-pilot"
            onClick={closeMenu}
          >
            Discuss a pilot <span aria-hidden="true">↗</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function SiteLayout() {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, "").toLowerCase();

    const page =
      normalizedPath === ""
        ? "home"
        : normalizedPath === "/discuss-a-pilot"
          ? "pilot"
          : "missing";

    document.title = titles[page];

    const targetHash = legacyHashes[hash] ?? hash;
    const targetId = targetHash.replace(/^#/, "");
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      if (target.matches("[tabindex], a, button, input, select, textarea")) {
        target.focus({ preventScroll: true });
      }

      target.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    } else {
      if (previousPath.current !== pathname) {
        document.getElementById("main")?.focus({ preventScroll: true });
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    previousPath.current = pathname;
  }, [pathname, hash, key]);

  return (
    <div className="terrafed-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteHeader locationKey={key} />

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
