import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  MessageSquareText,
  Megaphone,
  ImagePlus,
  Sparkles,
  Clock,
  ShieldCheck,
  Copy,
  Menu,
  X,
  Wand2,
  Send,
  Building2,
  Mail,
} from "lucide-react";
import "./styles.css";

const tools = [
  {
    id: "review",
    icon: MessageSquareText,
    title: "Review Reply Generator",
    desc: "Create polished replies to positive, negative, and neutral reviews in seconds.",
    placeholder: "Paste a customer review here...",
  },
  {
    id: "promo",
    icon: Megaphone,
    title: "Promo Campaign Generator",
    desc: "Turn one offer into a flyer headline, email, SMS, Facebook post, and Google Business update.",
    placeholder: "Describe your offer, discount, service, city, and deadline...",
  },
  {
    id: "caption",
    icon: ImagePlus,
    title: "Social Caption Generator",
    desc: "Turn photos, projects, and before/after work into ready-to-post captions and hashtags.",
    placeholder: "Describe the photo, project, result, or before/after transformation...",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    sub: "Try it out",
    features: ["5 generations per month", "Review replies", "Promo copy", "Social captions"],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$19",
    sub: "per month",
    features: ["100 generations per month", "Saved business profile", "Multiple tones", "Copy and paste outputs"],
    cta: "Start Starter",
  },
  {
    name: "Pro",
    price: "$49",
    sub: "per month",
    features: ["Unlimited generations", "Saved brand voice", "Promo bundles", "Review recovery responses", "Priority templates"],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Business",
    price: "$99",
    sub: "per month",
    features: ["Multiple locations", "Team access", "Campaign history", "Custom templates", "Monthly content ideas"],
    cta: "Start Business",
  },
];

const paymentLinks = {
  Free: "",
  Starter: "https://buy.stripe.com/4gMeVe7TM2BX43jeDiabK02",
  Pro: "https://buy.stripe.com/4gM4gA2zsb8t2Zf9iYabK03",
  Business: "https://buy.stripe.com/cNi4gAa1UdgB9nDdzeabK04",
};

const faqs = [
  {
    q: "Who is CurbSpark AI for?",
    a: "Local service businesses, clinics, salons, contractors, med spas, restaurants, auto shops, fitness studios, and any small business that needs simple marketing content fast.",
  },
  {
    q: "Do I need to connect social accounts?",
    a: "No. This first version is intentionally simple. Generate content, copy it, and post it wherever you want.",
  },
  {
    q: "Can it match my brand voice?",
    a: "Yes. The app includes business profile and tone fields now, and the production backend can save those per account.",
  },
];

const toneOptions = ["Friendly", "Professional", "Warm", "Confident"];
const industries = ["HVAC", "Dental", "Salon", "Med spa", "Roofing", "Restaurant", "Auto repair", "Fitness"];
const presetLabels = [
  "5-star reply",
  "Missed call text",
  "Weekend promo",
  "Google update",
  "Before/after caption",
  "Slow Tuesday offer",
  "Review recovery",
  "Grand opening",
  "Seasonal tune-up",
  "Referral push",
];

function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function buildGeneration({ activeTool, businessName, businessType, city, tone, prompt }) {
  const cleanPrompt = prompt.trim() || "20% off spring AC tune-ups this week";
  const business = businessName.trim() || "your business";
  const category = businessType.trim() || "local business";
  const market = city.trim() || "your area";

  if (activeTool === "review") {
    return `Hi, thank you for sharing this feedback with ${business}. We appreciate the chance to serve customers in ${market}, and we are glad you took the time to let us know about your experience. We will share this with our team and use it to keep improving.`;
  }

  if (activeTool === "caption") {
    return `Another finished project from ${business}. We love helping ${market} customers get results they can feel good about.\n\n${cleanPrompt}\n\nReady for help from a ${tone.toLowerCase()} ${category}? Send us a message today.\n\n#LocalBusiness #${market.replace(/\s+/g, "")} #SmallBusiness #CustomerCare`;
  }

    return `Headline: ${cleanPrompt}\n\nPost: ${business} is helping ${market} customers save time and feel confident with a simple limited-time offer. Book this week to claim it before appointments fill up.\n\nSMS: ${business}: ${cleanPrompt}. Reply YES to book or message us today.\n\nGoogle Business Update: Looking for a ${tone.toLowerCase()} ${category} in ${market}? ${business} is running a limited-time offer. Message us today to schedule.`;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("promo");
  const [businessName, setBusinessName] = useState("CurbSpark AI");
  const [businessType, setBusinessType] = useState("service business");
  const [city, setCity] = useState("Austin");
  const [tone, setTone] = useState("Friendly");
  const [prompt, setPrompt] = useState("20% off spring AC tune-ups this week for homeowners in Austin.");
  const [copied, setCopied] = useState(false);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const output = useMemo(
    () => buildGeneration({ activeTool, businessName, businessType, city, tone, prompt }),
    [activeTool, businessName, businessType, city, tone, prompt],
  );

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function startPlan(plan = "Free") {
    if (paymentLinks[plan]) {
      window.location.href = paymentLinks[plan];
      return;
    }

    const subject = encodeURIComponent(`CurbSpark AI ${plan} plan`);
    const body = encodeURIComponent(
      `Hi, I want to start the ${plan} plan for ${businessName || "my business"}.\n\nBusiness type: ${businessType}\nCity: ${city}`,
    );
    window.location.href = `mailto:hello@curbsparkai.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-wrap">
          <a href="#app" className="brand" aria-label="CurbSpark AI home">
            <span className="brand-mark">
              <Sparkles size={19} />
            </span>
            <span>CurbSpark AI</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#app">App</a>
            <a href="#how">How it works</a>
            <a href="#tools">Tools</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Button onClick={() => startPlan("Free")}>Create free copy</Button>
          </nav>

          <button className="icon-button mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#app" onClick={() => setMenuOpen(false)}>App</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#tools" onClick={() => setMenuOpen(false)}>Tools</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <Button onClick={() => startPlan("Free")}>Create free copy</Button>
          </div>
        )}
      </header>

      <main>
        <section id="app" className="hero-section">
          <div className="hero-grid">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="eyebrow">
                <Sparkles size={16} /> Simple AI marketing tools for local businesses
              </div>
              <h1>CurbSpark AI</h1>
              <p className="hero-copy">
                Create review replies, promotions, captions, and everyday marketing copy in seconds. Built for busy local business owners who need useful content without complicated software.
              </p>
              <div className="hero-actions">
                <Button onClick={() => document.querySelector("#generator").scrollIntoView({ behavior: "smooth" })}>
                  Create free marketing copy <ArrowRight size={18} />
                </Button>
                <Button variant="secondary" onClick={() => document.querySelector("#pricing").scrollIntoView({ behavior: "smooth" })}>
                  View pricing
                </Button>
              </div>
              <div className="mini-metrics" aria-label="Product highlights">
                <span><strong>3</strong> launch tools</span>
                <span><strong>30 sec</strong> to usable copy</span>
                <span><strong>0</strong> setup hassle</span>
              </div>
              <div className="trust-row">
                <span><CheckCircle2 size={17} /> No setup needed</span>
                <span><CheckCircle2 size={17} /> Free to try</span>
                <span><CheckCircle2 size={17} /> Copy-ready content</span>
              </div>
            </motion.div>

            <motion.div
              id="generator"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <Card className="generator-card">
                <div className="tool-tabs" role="tablist" aria-label="Generator tools">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        className={activeTool === tool.id ? "tool-tab active" : "tool-tab"}
                        onClick={() => setActiveTool(tool.id)}
                        type="button"
                      >
                        <Icon size={18} />
                        <span>{tool.title.replace(" Generator", "")}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="form-grid">
                  <label>
                    <span><Building2 size={15} /> Business name</span>
                    <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
                  </label>
                  <label>
                    <span>Business type</span>
                    <input value={businessType} onChange={(event) => setBusinessType(event.target.value)} />
                  </label>
                  <label>
                    <span>City or service area</span>
                    <input value={city} onChange={(event) => setCity(event.target.value)} />
                  </label>
                  <label>
                    <span>Tone</span>
                    <select value={tone} onChange={(event) => setTone(event.target.value)}>
                      {toneOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="prompt-label">
                  <span>{activeToolData.title}</span>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={activeToolData.placeholder}
                  />
                </label>

                <div className="output-panel" aria-live="polite">
                  <div className="output-head">
                    <span><Wand2 size={17} /> Generated copy</span>
                    <button className="copy-button" onClick={copyOutput} type="button">
                      <Copy size={16} /> {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre>{output}</pre>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="preset-section" aria-label="Marketing copy presets">
          <div className="preset-rail">
            {[...presetLabels, ...presetLabels].map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
        </section>

        <section id="how" className="how-section">
          <div className="how-grid">
            {["Enter your business info", "Choose a tool", "Copy your content"].map((step, index) => (
              <div className="how-step" key={step}>
                <span>{index + 1}</span>
                <h2>{step}</h2>
                <p>
                  {index === 0 && "Add your business name, service area, industry, and tone."}
                  {index === 1 && "Pick review replies, promotions, or social captions."}
                  {index === 2 && "Use the output in email, texts, social posts, or Google Business."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="tools" className="content-section">
          <div className="section-heading">
            <h2>Everything a busy local business needs to create simple marketing content</h2>
            <p>Start with three high-value tools. Add more later only after customers ask for them.</p>
          </div>
          <div className="industry-list" aria-label="Example industries">
            {industries.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
          <div className="tool-grid">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} className="feature-card">
                  <span className="feature-icon"><Icon size={24} /></span>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="value-section">
          <div className="value-grid">
            <div>
              <h2>Why businesses buy it</h2>
              <p>The value is immediate. They enter a review, offer, or photo description and get something they can use right away.</p>
            </div>
            <div className="reason-grid">
              {[
                [Clock, "Saves time", "Create usable copy in seconds instead of staring at a blank screen."],
                [Star, "Improves reputation", "Respond professionally to reviews and customer feedback."],
                [ShieldCheck, "Keeps it simple", "No complicated integrations or marketing jargon required."],
                [Sparkles, "Looks polished", "Make small businesses sound more professional everywhere they show up online."],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="reason-item">
                  <Icon />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="content-section">
          <div className="section-heading">
            <h2>Simple pricing for small businesses</h2>
            <p>Affordable enough to buy without a meeting. Useful enough to keep every month.</p>
            <div className="pricing-note">
              <CheckCircle2 size={17} /> Cancel anytime. No setup required.
            </div>
          </div>
          <div className="pricing-grid">
            {pricing.map((plan) => (
              <Card key={plan.name} className={plan.highlight ? "price-card highlighted" : "price-card"}>
                {plan.highlight && <div className="pill">Most popular</div>}
                <h3>{plan.name}</h3>
                <div className="price-line">
                  <span>{plan.price}</span>
                  <small>{plan.sub}</small>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 size={17} /> {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? "primary" : "secondary"} onClick={() => startPlan(plan.name)}>
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-inner">
            <div>
              <h2>Give your business a month of marketing ideas in minutes.</h2>
              <p>Start free, create your first review reply or promo, and see how quickly your business can produce better everyday marketing copy.</p>
            </div>
            <div className="cta-buttons">
              <Button variant="light" onClick={() => startPlan("Free")}>Create free copy</Button>
              <Button variant="ghost" onClick={() => document.querySelector("#pricing").scrollIntoView({ behavior: "smooth" })}>View pricing</Button>
            </div>
          </div>
        </section>

        <section id="faq" className="faq-section">
          <h2>Questions</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <Card key={faq.q} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>CurbSpark AI</strong>
          <span>Simple AI marketing tools for local businesses.</span>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@curbsparkai.com"><Mail size={15} /> Email</a>
          <a href="#app"><Send size={15} /> Try app</a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
