
import footerSoilLab from "../../assets/footer_soillab.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-credit">
          <span>Developed by</span>
          <a
            href="https://soilslab.ai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Soil AI Lab website"
          >
            <img
              src={footerSoilLab}
              alt="Soil AI Lab"
              width="216"
              height="53"
            />
          </a>
        </div>

        
        <div className="footer-links">
          <span>© {new Date().getFullYear()} TerraFed</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
