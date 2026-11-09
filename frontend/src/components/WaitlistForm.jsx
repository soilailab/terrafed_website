import { useId, useState } from "react";
import { MdNorthEast } from "react-icons/md";

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  role: "",
  message: "",
};

/**
 * Homepage waitlist form, extracted from the former Contact page.
 * Backend hook: pass an async onSubmit(formData) prop once the API is supplied.
 * Resolve only after the backend confirms success; reject to display an error.
 */
export default function WaitlistForm({ onSubmit }) {
  const id = useId().replace(/:/g, "");
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // No API is available yet. Do not send personal information to a generic
    // homepage POST or report success without a confirmed backend response.
    if (typeof onSubmit !== "function") {
      setError(
        "Waitlist registration is not available yet. Please check back soon.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim(),
        role: form.role,
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error && submitError.message
          ? submitError.message
          : "Unable to join the waitlist. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "1px #E9E9E9 solid",
    borderRadius: 8,
    fontSize: 15,
    color: "black",
    fontWeight: 400,
    lineHeight: "21px",
    outlineOffset: 2,
    background: "white",
    appearance: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#111",
    marginBottom: 6,
  };

  const requiredMark = (
    <span style={{ color: "#00B029", marginLeft: 2 }}>*</span>
  );

  if (submitted) {
    return (
      <div
        role="status"
        style={{
          padding: "48px 28px",
          border: "1px #E9E9E9 solid",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        <span aria-hidden="true" style={{ color: "#00B029", fontSize: 36 }}>
          ✓
        </span>
        <strong style={{ color: "#0C2431", fontSize: 22, fontWeight: 600 }}>
          Thanks for your interest!
        </strong>
        <strong
          style={{
            color: "#0C2431",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          You're on the TerraFed waitlist!
        </strong>

        <p
          style={{
            margin: 0,
            color: "#435B66",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Thanks {form.name.trim().split(/\s+/)[0]}! We've received your
          interest in TerraFed. Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form
      name="waitlist"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Join the TerraFed waitlist"
      aria-describedby={error ? `${id}-error` : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px" }}>
          <label htmlFor={`${id}-name`} style={labelStyle}>
            Full name {requiredMark}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="name"
            required
          />
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <label htmlFor={`${id}-email`} style={labelStyle}>
            Email {requiredMark}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px" }}>
          <label htmlFor={`${id}-organization`} style={labelStyle}>
            Organization
          </label>
          <input
            id={`${id}-organization`}
            name="organization"
            type="text"
            placeholder="Organization or institution"
            value={form.organization}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="organization"
          />
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <label htmlFor={`${id}-role`} style={labelStyle}>
            Role
          </label>
          <select
            id={`${id}-role`}
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ ...inputStyle, color: form.role ? "black" : "#9ca3af" }}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="Agronomist">Agronomist</option>
            <option value="Researcher">Researcher</option>
            <option value="Land Manager">Land Manager</option>
            <option value="Consultant">Consultant</option>
            <option value="Policymaker">Policymaker</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} style={labelStyle}>
          Message {requiredMark}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          placeholder="Tell us about your organization or how you'd like to use TerraFed..."
          value={form.message}
          onChange={handleChange}
          rows={6}
          style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
          required
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{ color: "#dc2626", fontSize: 13, margin: "-8px 0 0" }}
        >
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "14px 28px",
            background: "#00B029",
            borderRadius: 1000,
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {isSubmitting ? "Submitting..." : "Join the Waitlist"}
          <MdNorthEast aria-hidden="true" size={14} />
        </button>
      </div>
    </form>
  );
}
