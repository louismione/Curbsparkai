import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  MessageSquareText,
  Megaphone,
  ImagePlus,
  CalendarDays,
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
    shortLabel: "Review",
    desc: "Create polished replies to positive, negative, and neutral reviews in seconds.",
    placeholder: "Paste the customer review you received here...",
  },
  {
    id: "promo",
    icon: Megaphone,
    title: "Promo Campaign Generator",
    shortLabel: "Promo",
    desc: "Turn one offer into a flyer headline, email, SMS, Facebook post, and Google Business update.",
    placeholder: "Describe your offer, discount, service, city, and deadline...",
  },
  {
    id: "caption",
    icon: ImagePlus,
    title: "Social Caption Generator",
    shortLabel: "Caption",
    desc: "Turn photos, projects, and before/after work into ready-to-post captions and hashtags.",
    placeholder: "Describe the photo, project, result, or before/after transformation...",
  },
  {
    id: "ideas",
    icon: CalendarDays,
    title: "Monthly Marketing Calendar",
    shortLabel: "Calendar",
    desc: "Create a simple 30-day plan with posts, promos, review prompts, and local trust content.",
    placeholder: "Describe this month's goals, seasonal services, slow days, offers, events, or holidays...",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    sub: "Try it out",
    features: ["5 generations per month", "Review replies", "Promo copy", "Social captions", "Monthly calendar"],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$19",
    sub: "per month",
    features: ["100 generations per month", "All 4 copy tools", "Browser brand memory", "Copy-ready outputs", "Monthly calendars"],
    cta: "Start Starter",
  },
  {
    name: "Pro",
    price: "$49",
    sub: "per month",
    features: ["Unlimited generations", "Promo bundles", "Review recovery responses", "Brand memory", "Monthly calendars"],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Business",
    price: "$99",
    sub: "per month",
    features: ["Unlimited generations", "Multiple business locations", "Team-ready usage", "Campaign bundles", "Monthly marketing calendars"],
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
    a: "Yes. You can save a simple brand profile on your device with your business type, location, tone, main services, and wording to avoid.",
  },
  {
    q: "Is brand memory saved to an account?",
    a: "Not yet. The current version saves brand memory in your browser on the device you use. Cloud accounts and team profiles can come later.",
  },
];

const toneOptions = ["Friendly", "Professional", "Warm", "Confident"];
const industries = ["HVAC", "Dental", "Salon", "Med spa", "Roofing", "Restaurant", "Auto repair", "Fitness"];
const FREE_GENERATION_LIMIT = 5;
const usageStorageKey = `curbspark-free-generations-${new Date().toISOString().slice(0, 7)}`;
const profileStorageKey = "curbspark-brand-profile";
const reviewSituations = ["Positive review", "Negative review", "Neutral review", "Angry customer", "Late service complaint"];
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
  "Monthly calendar",
  "Angry review reply",
];

const outcomeExamples = [
  {
    label: "Rough idea",
    title: "AC tune-up promo",
    before: "20% off tune-ups this week",
    after: "Spring heat is coming. Book your AC tune-up this week and save 20%. Limited appointments available for Austin homeowners.",
  },
  {
    label: "Customer review",
    title: "Professional reply",
    before: "They fixed it fast but arrived late.",
    after: "Thank you for trusting our team. We are glad the repair was handled quickly, and we appreciate your patience with the arrival time.",
  },
  {
    label: "Photo caption",
    title: "Before/after post",
    before: "Kitchen backsplash finished",
    after: "Fresh tile, cleaner lines, and a brighter kitchen. Another finished project ready for the weekend.",
  },
];

const upgradeReasons = [
  "Create a simple 30-day marketing calendar for the whole month",
  "Keep your business voice, services, city, and audience consistent",
  "Turn one offer into multiple channels without rewriting it yourself",
  "Save common replies and promos instead of starting over every time",
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

function getSavedUsage() {
  if (typeof window === "undefined") {
    return 0;
  }

  return Number(window.localStorage.getItem(usageStorageKey) || 0);
}

function getSavedProfile() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(profileStorageKey) || "{}");
  } catch {
    return {};
  }
}

function buildGeneration({ activeTool, businessName, businessType, city, tone, mainServices, avoidWords, prompt }) {
  const cleanPrompt = prompt.trim() || "20% off spring AC tune-ups this week";
  const business = businessName.trim() || "your business";
  const category = businessType.trim() || "local business";
  const market = city.trim() || "your area";
  const services = mainServices.trim();
  const avoid = avoidWords.trim();
  const serviceLine = services ? `\nPrimary services to emphasize: ${services}` : "";
  const avoidLine = avoid ? `\nAvoid this wording or tone: ${avoid}` : "";

  if (activeTool === "review") {
    return `Public reply:\nHi, thank you for sharing this feedback with ${business}. We appreciate the chance to serve customers in ${market}, and we are glad you took the time to let us know about your experience. We will share this with our team and use it to keep improving.\n\nPrivate follow-up:\nThanks again for the feedback. If there is anything else we can do to make this right, please message us and our team will take care of it.\n\nBrand notes:\nUse this as a calm, ${tone.toLowerCase()} response that acknowledges the customer without sounding defensive.${serviceLine}${avoidLine}`;
  }

  if (activeTool === "caption") {
    return `Caption:\nAnother finished project from ${business}. We love helping ${market} customers get results they can feel good about.\n\n${cleanPrompt}\n\nCTA:\nReady for help from a ${tone.toLowerCase()} ${category}? Send us a message today.\n\nBrand notes:${serviceLine || "\nUse the main services customers ask about most."}${avoidLine}\n\nHashtags:\n#LocalBusiness #${market.replace(/\s+/g, "")} #SmallBusiness #CustomerCare`;
  }

  if (activeTool === "ideas") {
    return `30-day marketing calendar for ${business}\nGoal or theme:\n${cleanPrompt}${serviceLine}${avoidLine}\n\nRecommended cadence:\n- 2 Facebook or Instagram posts per week\n- 1 Google Business update per week\n- 1 review/reputation prompt per week\n- 1 offer reminder near the middle and end of the month\n\nWeek 1: Build trust\nDay 1 - Google Business: Introduce the main service or offer for the month.\nDay 3 - Social post: Share a common customer question about your ${category}.\nDay 5 - Review prompt: Ask recent customers what stood out about their experience.\nDay 7 - Local trust post: Mention the ${market} neighborhoods or customer types you help most.\n\nWeek 2: Educate and show proof\nDay 9 - Tip post: Share one seasonal or timely tip customers should know.\nDay 11 - Before/after or project post: Show a result, finished job, happy customer, or team moment.\nDay 13 - Google Business: Explain what makes your process simple or reliable.\nDay 14 - Soft offer: Remind customers about this month's offer or best service.\n\nWeek 3: Drive action\nDay 16 - Promo post: Turn the monthly theme into a clear limited-time offer.\nDay 18 - SMS or email: Send a short reminder to book, visit, or message the business.\nDay 20 - Review spotlight: Thank a recent customer and highlight one positive detail.\nDay 21 - FAQ post: Answer the question customers ask before buying.\n\nWeek 4: Finish strong\nDay 23 - Social post: Share a behind-the-scenes or team photo.\nDay 25 - Google Business: Post a last-call reminder for the monthly offer.\nDay 27 - Reputation prompt: Ask customers to mention what problem you helped solve.\nDay 30 - Recap post: Thank ${market} customers and preview what is coming next month.\n\n5 ready-to-use post hooks:\n- ${market} customers ask us this all the time...\n- Before you book a ${category}, here is one thing to know.\n- A quick reminder from ${business}: ${cleanPrompt}\n- We helped another local customer with this exact problem.\n- If this has been on your to-do list, this is your sign to handle it this week.\n\nBest channels this month:\n- Google Business for local search visibility\n- Facebook for community awareness\n- SMS or email for offer reminders\n- Instagram for photos, before/after work, and team trust`;
  }

  return `Flyer headline:\n${cleanPrompt}\n\nFacebook post:\n${business} is helping ${market} customers save time and feel confident with a simple limited-time offer. Book this week to claim it before appointments fill up.\n\nSMS:\n${business}: ${cleanPrompt}. Reply YES to book or message us today.\n\nEmail subject:\nA quick offer from ${business}\n\nGoogle Business update:\nLooking for a ${tone.toLowerCase()} ${category} in ${market}? ${business} is running a limited-time offer. Message us today to schedule.\n\nBrand notes:${serviceLine || "\nEmphasize the services customers ask about most."}${avoidLine}`;
}

function getDefaultPrompt(toolId) {
  if (toolId === "promo") {
    return "20% off spring AC tune-ups this week for homeowners in Austin.";
  }

  return "";
}

function App() {
  const savedProfile = getSavedProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("promo");
  const [businessName, setBusinessName] = useState(savedProfile.businessName || "CurbSpark AI");
  const [businessType, setBusinessType] = useState(savedProfile.businessType || "service business");
  const [city, setCity] = useState(savedProfile.city || "Austin");
  const [tone, setTone] = useState(savedProfile.tone || "Friendly");
  const [mainServices, setMainServices] = useState(savedProfile.mainServices || "");
  const [avoidWords, setAvoidWords] = useState(savedProfile.avoidWords || "");
  const [profileSaved, setProfileSaved] = useState(Boolean(savedProfile.businessName || savedProfile.mainServices || savedProfile.avoidWords));
  const [reviewSituation, setReviewSituation] = useState("Positive review");
  const [prompt, setPrompt] = useState(getDefaultPrompt("promo"));
  const [generationCount, setGenerationCount] = useState(getSavedUsage);
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const remainingGenerations = Math.max(FREE_GENERATION_LIMIT - generationCount, 0);
  const hasReachedFreeLimit = remainingGenerations === 0;

  function scrollToGenerator() {
    document.querySelector("#generator")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToPricing() {
    document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  function generateCopy() {
    if (hasReachedFreeLimit) {
      scrollToPricing();
      return;
    }

    const nextCount = generationCount + 1;
    const promptWithContext =
      activeTool === "review" ? `${reviewSituation}: ${prompt}` : prompt;
    const nextOutput = buildGeneration({ activeTool, businessName, businessType, city, tone, mainServices, avoidWords, prompt: promptWithContext });
    window.localStorage.setItem(usageStorageKey, String(nextCount));
    setGenerationCount(nextCount);
    setGeneratedOutput(nextOutput);
  }

  function saveProfile() {
    const profile = { businessName, businessType, city, tone, mainServices, avoidWords };
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    setProfileSaved(true);
  }

  function clearProfile() {
    window.localStorage.removeItem(profileStorageKey);
    setBusinessName("CurbSpark AI");
    setBusinessType("service business");
    setCity("Austin");
    setTone("Friendly");
    setMainServices("");
    setAvoidWords("");
    setProfileSaved(false);
    setGeneratedOutput("");
  }

  function selectTool(toolId) {
    setActiveTool(toolId);
    setPrompt(getDefaultPrompt(toolId));
    setGeneratedOutput("");
    setCopied(false);
  }

  async function copyOutput() {
    if (!generatedOutput) {
      return;
    }

    await navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function startPlan(plan = "Free") {
    if (plan === "Free") {
      scrollToGenerator();
      return;
    }

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
                Turn one rough idea, review, or photo note into ready-to-post marketing copy for Facebook, Google Business, email, and SMS. Built for busy local business owners who need useful content without complicated software.
              </p>
              <div className="hero-actions">
                <Button onClick={() => document.querySelector("#generator").scrollIntoView({ behavior: "smooth" })}>
                  Create free marketing copy <ArrowRight size={18} />
                </Button>
                <Button variant="secondary" onClick={scrollToPricing}>
                  View pricing
                </Button>
              </div>
              <div className="mini-metrics" aria-label="Product highlights">
                <span><strong>4</strong> focused tools</span>
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
                        onClick={() => selectTool(tool.id)}
                        type="button"
                      >
                        <Icon size={18} />
                        <span>{tool.shortLabel}</span>
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

                <div className="brand-memory">
                  <div className="brand-memory-head">
                    <div>
                      <strong>Brand memory</strong>
                      <span>{profileSaved ? "Saved on this device" : "Save once and reuse next visit"}</span>
                    </div>
                    <div className="brand-memory-actions">
                      <button onClick={saveProfile} type="button">Save profile</button>
                      <button onClick={clearProfile} type="button">Clear</button>
                    </div>
                  </div>
                  <div className="form-grid">
                    <label>
                      <span>Main services</span>
                      <input
                        value={mainServices}
                        onChange={(event) => setMainServices(event.target.value)}
                        placeholder="AC tune-ups, repairs, installs..."
                      />
                    </label>
                    <label>
                      <span>Words or tone to avoid</span>
                      <input
                        value={avoidWords}
                        onChange={(event) => setAvoidWords(event.target.value)}
                        placeholder="Avoid pushy, cheap, emojis..."
                      />
                    </label>
                  </div>
                </div>

                <label className="prompt-label">
                  <span>{activeToolData.title}</span>
                  {activeTool === "review" && (
                    <div className="segment-control" aria-label="Review situation">
                      {reviewSituations.map((situation) => (
                        <button
                          key={situation}
                          className={reviewSituation === situation ? "active" : ""}
                          onClick={() => setReviewSituation(situation)}
                          type="button"
                        >
                          {situation}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={activeToolData.placeholder}
                  />
                </label>

                <div className="generator-actions">
                  <div className="usage-meter">
                    <strong>{remainingGenerations}</strong> free generations left this month
                  </div>
                  <Button onClick={generateCopy} className="generate-button">
                    {hasReachedFreeLimit ? "Upgrade to keep going" : "Generate copy"}
                    <ArrowRight size={17} />
                  </Button>
                </div>

                {hasReachedFreeLimit && (
                  <div className="limit-notice">
                    You used your 5 free generations for this month. Choose a paid plan to keep creating copy.
                  </div>
                )}

                <div className="output-panel" aria-live="polite">
                  <div className="output-head">
                    <span><Wand2 size={17} /> Generated copy</span>
                    <button className="copy-button" onClick={copyOutput} type="button" disabled={!generatedOutput}>
                      <Copy size={16} /> {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre>{generatedOutput || "Your generated copy will appear here after you click Generate copy."}</pre>
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

        <section className="proof-section">
          <div className="proof-wrap">
            <div className="section-heading">
              <h2>From rough idea to usable marketing in one click</h2>
              <p>Owners do not need a blank document. They need a fast first draft they can copy, edit, and post.</p>
            </div>
            <div className="example-grid">
              {outcomeExamples.map((example) => (
                <Card className="example-card" key={example.title}>
                  <div className="example-label">{example.label}</div>
                  <h3>{example.title}</h3>
                  <div className="before-after">
                    <div>
                      <span>Before</span>
                      <p>{example.before}</p>
                    </div>
                    <div>
                      <span>After</span>
                      <p>{example.after}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="how-section">
          <div className="how-grid">
            {["Enter your business info", "Choose a tool", "Copy your content"].map((step, index) => (
              <div className="how-step" key={step}>
                <span>{index + 1}</span>
                <h2>{step}</h2>
                <p>
                  {index === 0 && "Add or save your business name, service area, services, and tone."}
                  {index === 1 && "Pick review replies, promos, social captions, or a monthly calendar."}
                  {index === 2 && "Use the output in email, texts, social posts, Google Business, or your monthly plan."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="tools" className="content-section">
          <div className="section-heading">
            <h2>Four focused tools for everyday local marketing</h2>
            <p>Create review replies, promo bundles, social captions, and monthly marketing calendars without starting from a blank page.</p>
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
              <h2>Why businesses keep paying for it</h2>
              <p>The free tool proves the value. Paid plans are for owners who want a steady flow of review replies, promos, captions, and monthly marketing calendars without writing from scratch.</p>
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

        <section className="upgrade-section">
          <div className="upgrade-wrap">
            <div>
              <div className="eyebrow dark">Why upgrade</div>
              <h2>The paid version is not more complicated. It just removes the monthly content bottleneck.</h2>
            </div>
            <div className="upgrade-list">
              {upgradeReasons.map((reason) => (
                <div key={reason}>
                  <CheckCircle2 size={19} />
                  <span>{reason}</span>
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
              <h2>Give your business a month of marketing direction in minutes.</h2>
              <p>Start free, create your first review reply, promo, or monthly calendar, and see how quickly your business can produce better everyday marketing copy.</p>
            </div>
            <div className="cta-buttons">
              <Button variant="light" onClick={() => startPlan("Free")}>Create free copy</Button>
              <Button variant="ghost" onClick={scrollToPricing}>View pricing</Button>
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
