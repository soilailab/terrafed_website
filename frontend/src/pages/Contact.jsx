import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNorthEast } from "react-icons/md";

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    border: "1px #E9E9E9 solid",
    borderRadius: 8,
    fontSize: 15,
    color: "black",
    fontWeight: "400",
    lineHeight: "21px",
    outline: "none",
    background: "white",
    appearance: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  };

  const requiredMark = (
    <span style={{ color: "#0FD12F", marginLeft: 2 }}>*</span>
  );

  return (
    <div
      className="relative flex flex-col items-center bg-white px-4 pb-5 md:px-10"
      style={{ minHeight: "100vh" }}
    >
      {/* Nav */}
      <div
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
          borderBottom: "1px #E9E9E9 solid",
        }}
      >
        <div
          onClick={() => navigate("/")}
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
        {/* Centered links */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 27,
          }}
        >
          {[
            { label: "Benefits", path: "/#benefits" },
            { label: "How It Works", path: "/#features" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <div
              key={label}
              onClick={() => {
                if (path.startsWith("/#")) {
                  navigate("/");
                  setTimeout(() => {
                    const id = path.slice(2);
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  navigate(path);
                }
              }}
              style={{
                color: label === "Contact" ? "#0FD12F" : "black",
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
      </div>

      {/* Main content */}
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          paddingTop: 80,
          paddingBottom: 120,
          flexDirection: "column",
          gap: 60,
          display: "flex",
        }}
      >
        {/* Header */}
        <div style={{ flexDirection: "column", gap: 20, display: "flex" }}>
          <div
            style={{
              color: "#0FD12F",
              fontSize: 14,
              fontWeight: "700",
              lineHeight: "19.6px",
            }}
          >
            Get in touch
          </div>
          <div
            style={{
              color: "black",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: "400",
              lineHeight: "1em",
            }}
          >
            Book a demo or ask us anything.
          </div>
          <div
            style={{
              color: "#6F6F6F",
              fontSize: 15,
              fontWeight: "400",
              lineHeight: "21px",
              maxWidth: 560,
            }}
          >
            Reach out to the TerraFed team to schedule a demo, discuss your use case, or learn more about our federated soil mapping platform.
          </div>
        </div>

        {submitted ? (
          /* Success state */
          <div
            style={{
              paddingTop: 60,
              paddingBottom: 60,
              paddingLeft: 40,
              paddingRight: 40,
              border: "1px #E9E9E9 solid",
              borderRadius: 16,
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              display: "flex",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36 }}>✓</div>
            <div style={{ color: "black", fontSize: 22, fontWeight: "400" }}>
              Message sent!
            </div>
            <div
              style={{
                color: "#6F6F6F",
                fontSize: 15,
                fontWeight: "400",
                lineHeight: "21px",
              }}
            >
              Thanks {form.name.split(" ")[0]}, we'll be in touch shortly.
            </div>
            <div
              onClick={() => navigate("/")}
              style={{
                marginTop: 12,
                paddingLeft: 22,
                paddingRight: 22,
                paddingTop: 14,
                paddingBottom: 14,
                background: "#0FD12F",
                borderRadius: 1000,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
                Back to Home
              </div>
            </div>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ flexDirection: "column", gap: 24, display: "flex" }}
          >
            {/* Name + Email row */}
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>
                  Full name {requiredMark}
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>
                  Email {requiredMark}
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Organization + Role row */}
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Organization</label>
                <input
                  name="organization"
                  type="text"
                  placeholder="AgriAdapt Ltd."
                  value={form.organization}
                  onChange={handleChange}
                  style={inputStyle}
                  autoComplete="organization"
                />
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={{ ...inputStyle, color: form.role ? "black" : "#9ca3af" }}
                >
                  <option value="" disabled>Select a role</option>
                  <option value="Agronomist">Agronomist</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Land Manager">Land Manager</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Policymaker">Policymaker</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>
                Message {requiredMark}
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your use case or what you'd like to demo..."
                value={form.message}
                onChange={handleChange}
                rows={6}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 120,
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: 13,
                  fontWeight: "400",
                  marginTop: -8,
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                style={{
                  paddingLeft: 28,
                  paddingRight: 28,
                  paddingTop: 14,
                  paddingBottom: 14,
                  background: "#0FD12F",
                  borderRadius: 1000,
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
                  Send Message
                </span>
                <MdNorthEast style={{ color: "white", fontSize: 14 }} />
              </button>
            </div>
          </form>
        )}
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
            { label: "Benefits", path: "/#benefits" },
            { label: "How It Works", path: "/#features" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <div
              key={label}
              onClick={() => {
                if (path.startsWith("/#")) {
                  navigate("/");
                  setTimeout(() => {
                    const id = path.slice(2);
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  navigate(path);
                }
              }}
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
    </div>
  );
}

export default Contact;
