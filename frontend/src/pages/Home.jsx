import { Link } from "react-router-dom";
import SoilHeroCarousel from "../components/SoilHeroCarousel/SoilHeroCarousel";
import ApplicationWalkthrough from "../components/ApplicationWalkthrough";
import keepDataLocal from "../assets/pilot/how/keep-data-local.png";
import learnTogether from "../assets/pilot/how/learn-together.png";
import benefitLocally from "../assets/pilot/how/benefit-locally.png";
import agtech from "../assets/pilot/participants/agtech.png";
import advisory from "../assets/pilot/participants/advisory.png";
import research from "../assets/pilot/participants/research.png";
import publicSector from "../assets/pilot/participants/public.png";
import brazil from "../assets/pilot/research/brazil.svg";
import florida from "../assets/pilot/research/florida.svg";

const steps = [
  { image: keepDataLocal, width: 594, height: 549, alt: "Keep data local. Your measurements and operational data remain under your control." },
  { image: learnTogether, width: 593, height: 550, alt: "Learn together. Contribute to collaborative AI development without sharing raw data." },
  { image: benefitLocally, width: 594, height: 549, alt: "Benefit locally. Use satellite imagery and AI models for predictions adapted to local conditions." },
];

const participants = [
  { image: agtech, width: 438, height: 761, alt: "Agtech and soil sensing" },
  { image: advisory, width: 438, height: 761, alt: "Advisory and MRV services" },
  { image: research, width: 438, height: 761, alt: "Research and institutions" },
  { image: publicSector, width: 438, height: 732, alt: "Public sector and programs" },
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="kicker">The future of collaborative agriculture</p>
            <h1 id="hero-title">Your data stays yours.<br /><em>AI works for you.</em></h1>
            <p>TerraFed helps farmers and agricultural organizations benefit from AI that learns collaboratively <strong>while they retain control over sensitive local data.</strong></p>
            <div className="hero-actions">
              <Link className="button button-outline" to="/#how">See how it works <span aria-hidden="true">↗</span></Link>
              <Link className="button button-coral" to="/#contact">Join the TerraFed network <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <SoilHeroCarousel />
        </div>
      </section>

      <ApplicationWalkthrough />

      <section className="section how-section" id="how" tabIndex={-1} aria-labelledby="how-title">
        <div className="wrap">
          <p className="kicker">How TerraFed works</p>
          <h2 id="how-title">Better AI, without giving up your data.</h2>
          <p className="section-copy">What if AI could learn across farms, laboratories, and organizations without requiring everyone to pool their raw data? TerraFed brings AI learning to where the data lives.</p>
          <ul className="how-grid">
            {steps.map(({ image, width, height, alt }) => (
              <li key={image}><img src={image} width={width} height={height} alt={alt} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section story-section" id="story" tabIndex={-1} aria-labelledby="story-title">
        <div className="wrap">
          <p className="kicker">Born from research · Built for the field</p>
          <h2 id="story-title">Two researchers.<br /><em>One shared vision.</em></h2>
          <div className="story-copy">
            <p>At the University of Florida’s <strong>Soil Science AI Lab</strong>, researchers <strong>Anastasia Kritharoula</strong> and <strong>Giannis Gallios</strong> brought together two approaches, AI for soil mapping and federated learning.</p>
            <p>They shared a question. <strong>What if agricultural AI could learn across different farms without requiring farmers to give up their data?</strong></p>
            <p>Developed within the Soil Science AI Lab under the guidance of <strong>Dr. Nikolaos Tziolas</strong>, TerraFed is bringing this research closer to real agricultural applications, with support from <strong>UF Innovate</strong> and <strong>VentureWell</strong>.</p>
            <Link className="story-link" to="/#evidence">See the research <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="story-support">
            <span className="kicker">Supported by</span>
            <a className="support-wordmark" href="https://innovate.research.ufl.edu/" target="_blank" rel="noreferrer">UF Innovate</a>
            <a className="support-wordmark venturewell" href="https://venturewell.org/" target="_blank" rel="noreferrer">VentureWell</a>
          </div>
        </div>
      </section>

      <section className="section evidence-section" id="evidence" tabIndex={-1} aria-labelledby="evidence-title">
        <div className="wrap evidence-grid">
          <div>
            <p className="kicker">From research to real-world evidence</p>
            <h2 id="evidence-title">From Brazil to Florida and beyond.</h2>
            <p className="section-copy">TerraFed builds on collaborative soil-mapping research in Brazil. The next step is preparing Florida pilots to bring local measurements, Earth observation, and shared AI into practical workflows.</p>
            <a className="button button-light" href="https://doi.org/10.1016/j.jag.2025.105067" target="_blank" rel="noreferrer">
              Explore the research <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="proof-panel">
            <p className="kicker">At a glance</p>
            <div className="region-entry">
              <img src={brazil} alt="" width="110" height="82" loading="lazy" />
              <div>
                <h3>Brazil</h3>
                <p><strong>Real-world case study · 50 farms.</strong> Research tested collaborative soil mapping and locally adapted models across farms without pooling raw measurements.</p>
              </div>
            </div>
            <div className="region-entry">
              <img src={florida} alt="" width="110" height="97" loading="lazy" />
              <div>
                <h3>Florida</h3>
                <p><strong>Pilot applications in preparation.</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section partners-section" id="partners" tabIndex={-1} aria-labelledby="partners-title">
        <div className="wrap">
          <div className="section-heading">
            <p className="kicker">Who can participate</p>
            <h2 id="partners-title">A network for agricultural intelligence.</h2>
          </div>
          <ul className="participant-grid">
            {participants.map(({ image, width, height, alt }) => (
              <li key={image}><img src={image} width={width} height={height} alt={alt} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section contact-section" id="contact" tabIndex={-1} aria-labelledby="contact-title">
        <div className="wrap contact-grid">
          <div>
            <p className="kicker">Join the TerraFed network</p>
            <h2 id="contact-title">Your data has value. Let’s make it work for you.</h2>
            <p className="section-copy">Join TerraFed and help build agricultural AI through collaboration, while keeping sensitive data under your control.</p>
          </div>
          <Link className="button button-coral" to="/discuss-a-pilot">Discuss a pilot <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
