import { useRef, useState } from "react";

const accessRequestUrl =
  import.meta.env.VITE_WAITLIST_API_URL ||
  "https://geoserver-portal.soilslab.ai/fedfarms-accounts-api/api/access-requests";

const roles = [
  "Farmer or grower",
  "Agtech or soil sensing",
  "Advisory or MRV services",
  "Research or academic institution",
  "Public sector or program",
  "Investor",
  "Other",
];

async function submitPilotInquiry({ name, email, organization, message, role }) {
  const payload = {
    full_name: name,
    email,
    organization,
    reason: [message, role && `Role: ${role}`].filter(Boolean).join("\n\n"),
  };

  let response;
  try {
    response = await fetch(accessRequestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to connect to the inquiry service. Please try again later.");
  }

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const detail = [result?.message, result?.detail].find(
      (value) => typeof value === "string" && value.trim(),
    );
    throw new Error(detail || "Unable to send your pilot inquiry. Please try again.");
  }
}

function PilotForm() {
  const inFlight = useRef(false);
  const [status, setStatus] = useState(null);
  const pending = status?.kind === "pending";

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = fields.get("name").trim();
    const email = fields.get("email").trim();
    const organization = fields.get("organization").trim();
    const role = fields.get("role");
    const message = fields.get("message").trim();

    if (!name || !email || !message) {
      setStatus({ kind: "error", text: "Please complete the required fields." });
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "pending", text: "Submitting your pilot inquiry…" });
    try {
      await submitPilotInquiry({ name, email, organization, role, message });
      form.reset();
      setStatus({ kind: "success", text: "Thank you. The TerraFed team has received your pilot inquiry." });
    } catch (error) {
      setStatus({ kind: "error", text: error.message });
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="form-title" autoComplete="on">
      <fieldset className="form-grid" disabled={pending}>
        <div className="field">
          <label htmlFor="pilot-name">Full name <span className="required">*</span></label>
          <input id="pilot-name" name="name" autoComplete="name" placeholder="Jane Smith" maxLength={120} required />
        </div>
        <div className="field">
          <label htmlFor="pilot-email">Email <span className="required">*</span></label>
          <input id="pilot-email" name="email" type="email" autoComplete="email" placeholder="jane@example.com" maxLength={254} required />
        </div>
        <div className="field">
          <label htmlFor="pilot-organization">Organization</label>
          <input id="pilot-organization" name="organization" autoComplete="organization" placeholder="Organization or institution" maxLength={180} />
        </div>
        <div className="field">
          <label htmlFor="pilot-role">Role</label>
          <select id="pilot-role" name="role">
            <option value="">Select your role (optional)</option>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
        </div>
        <div className="field field-wide">
          <label htmlFor="pilot-message">Message <span className="required">*</span></label>
          <textarea id="pilot-message" name="message" maxLength={4000} placeholder="Tell us about your organization or how you’d like to use TerraFed…" required />
        </div>
      </fieldset>
      <div className="submit-row">
        <button className="button button-coral" type="submit" disabled={pending}>
          {pending ? "Sending…" : <>Send pilot inquiry <span aria-hidden="true">↗</span></>}
        </button>
        <p>Your details are submitted to TerraFed’s access-request service for review.</p>
      </div>
      <p role="status" className={status ? `form-status ${status.kind}` : undefined}>{status?.text}</p>
    </form>
  );
}

export default function Pilot() {
  return (
    <>
      <section className="wrap pilot-intro" aria-labelledby="pilot-title">
        <p className="kicker">Let’s build together</p>
        <h1 id="pilot-title">Let’s explore a<br /><em>TerraFed pilot.</em></h1>
        <p className="section-copy">Help build agricultural AI through collaboration. Benefit from shared intelligence while keeping your farm’s sensitive data under your control.</p>
      </section>
      <div className="wrap pilot-layout">
        <section className="form-panel" aria-labelledby="form-title">
          <div className="form-header">
            <h2 id="form-title">Start a conversation.</h2>
            <p><span className="required">*</span> Required</p>
          </div>
          <PilotForm />
        </section>
        <aside className="pilot-aside" aria-labelledby="pilot-aside-title">
          <h2 id="pilot-aside-title">Where collaboration begins.</h2>
          <p>We work across agricultural data ecosystems, from field-scale mapping to privacy-governed model development.</p>
          <ol>
            <li><strong>Bring your use case</strong><p>Tell us which fields, data, or monitoring needs matter to you.</p></li>
            <li><strong>Explore a pilot</strong><p>Discuss how TerraFed could fit your organization.</p></li>
            <li><strong>Build with local control</strong><p>Keep data governance central to the conversation.</p></li>
          </ol>
        </aside>
      </div>
    </>
  );
}
