import footerSoilLab from "../../assets/footer_soillab.png";

function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        padding: "30px 0 20px",
        borderTop: "1px solid #E9E9E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
        }}
      >
        <span style={{ color: "#6F6F6F", fontSize: 12, whiteSpace: "nowrap" }}>
          Developed by
        </span>
        <img
          src={footerSoilLab}
          alt="Soil AI Lab"
          style={{ display: "block", height: 20, width: "auto", maxWidth: 170, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 12,
          marginLeft: "auto",
          fontSize: 12,
        }}
      >
        <span style={{ color: "#0FD12F" }}>TerraFed 2026</span>
        <span style={{ color: "#6F6F6F" }} aria-hidden="true">|</span>
        <a
          href="https://innovate.research.ufl.edu/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0FD12F", textDecoration: "none" }}
        >
          UF Innovate
        </a>
        <span style={{ color: "#6F6F6F" }} aria-hidden="true">|</span>
        <span style={{ color: "#111111" }}>All Rights Reserved</span>
      </div>
    </footer>
  );
}

export default Footer;
