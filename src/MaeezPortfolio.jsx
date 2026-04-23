import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const NAV_LINKS = ["about", "skills", "projects", "experience", "education", "contact"];
const ROLE_TITLES = ["Full Stack Developer", "MERN Developer", ".NET Developer", "MCA Student", "Freelancer"];
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "maeezscript@gmail.com";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_CONFIGURED = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const SKILLS = {
  "MERN Stack": ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript ES6+", "JWT Auth", "RESTful APIs", "RBAC"],
  ".NET Stack": ["ASP.NET Core MVC", "Web API", "Kendo UI", "PostgreSQL", "C#"],
  "Frontend": ["HTML5", "CSS3", "SASS", "Responsive Design"],
  "Cloud & Tools": ["Cloudinary", "Vercel", "Render", "Git", "GitHub", "Postman", "VS Code"],
  "Database": ["MongoDB Atlas", "PostgreSQL", "SQL"],
};

const PROJECTS = [
  {
    title: "Fancy Perfume",
    subtitle: "Full-Stack E-Commerce Platform",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary", "JWT"],
    desc: "Complete e-commerce platform with product catalog, shopping cart, JWT auth, role-based admin dashboard, and Cloudinary image management.",
    live: "https://fancyperfume.vercel.app",
    github: "https://github.com/maeezp26/fancyperfume",
    commits: "38+",
    tag: "Featured",
  },
  {
    title: "QuranConnect",
    subtitle: "Online Quran Classes Platform - Canadian Client",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Stripe", "Nodemailer", "JWT"],
    desc: "Production-ready platform for a Canadian client enabling online Quran classes via Zoom. Features student registration with language preference (Urdu/English), smart time-slot booking, teacher dashboard, WhatsApp notifications, 7-day free trial, and Stripe payment integration.",
    live: "https://quran-connect-pearl.vercel.app",
    github: "https://github.com/maeezp26/QuranConnect",
    commits: null,
    tag: "Client Project",
  },
  {
    title: "Naustry Modesty",
    subtitle: "Premium Hijab Collection - E-Commerce Store",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary"],
    desc: "Elegant e-commerce platform for a premium modest fashion brand featuring a curated hijab collection, product catalog, and a clean, brand-focused shopping experience.",
    live: "https://naustry-modesty.vercel.app",
    github: "https://github.com/maeezp26/NaustryModesty",
    commits: null,
    tag: "E-Commerce",
  },
];

const EXPERIENCE = [
  {
    role: "Full Stack Intern",
    company: "Casepoint Pvt. Ltd.",
    location: "Surat",
    period: "Jan 2026 - Present",
    current: true,
    stack: ["ASP.NET Core MVC", "Web API", "Kendo UI", "PostgreSQL", "C#"],
    points: [
      "Developing enterprise-grade MVC apps with structured layouts and modular views",
      "Designing and integrating REST Web API endpoints for internal business applications",
      "Implementing interactive Kendo UI grids for complex data-driven workflows",
      "Writing and optimizing PostgreSQL queries for production modules",
    ],
  },
  {
    role: "Frontend Development Intern",
    company: "QSpiders",
    location: "Ahmedabad",
    period: "Jan 2024 - Jun 2024",
    current: false,
    stack: ["HTML5", "CSS3", "JavaScript", "React.js", "RESTful APIs"],
    points: [
      "Developed 10+ responsive, cross-browser-compatible web pages",
      "Built reusable React.js component library to reduce code duplication",
      "Integrated RESTful APIs for real-time data exchange",
      "Participated in Agile sprints, code reviews, and sprint planning",
    ],
  },
];

const EDUCATION = [
  {
    degree: "Master of Computer Applications (MCA)",
    institute: "Gujarat Technological University",
    period: "Aug 2024 - 2026",
    detail: "3rd Semester - Expected Graduation: 2026",
    current: true,
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institute: "Veer Narmad South Gujarat University",
    period: "Oct 2021 - Apr 2024",
    detail: "CGPA: 7.96 / 10",
    current: false,
  },
];

const ACCENT = "#00f5c8";
const ACCENT2 = "#7b5ea7";

function buildMailtoLink({ name, email, message }) {
  const params = new URLSearchParams({
    subject: `Portfolio contact from ${name}`,
    body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submissionState, setSubmissionState] = useState({ type: "idle", message: "" });
  const [isSending, setIsSending] = useState(false);
  const roleRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    let timeout;

    function tick() {
      const current = ROLE_TITLES[roleRef.current];

      if (!deletingRef.current) {
        setTyped(current.slice(0, charRef.current + 1));
        charRef.current++;
        if (charRef.current === current.length) {
          deletingRef.current = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
      } else {
        setTyped(current.slice(0, charRef.current - 1));
        charRef.current--;
        if (charRef.current === 0) {
          deletingRef.current = false;
          roleRef.current = (roleRef.current + 1) % ROLE_TITLES.length;
        }
      }

      timeout = setTimeout(tick, deletingRef.current ? 55 : 85);
    }

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(id => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(section => obs.observe(section));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setSubmissionState({
        type: "error",
        message: "Please fill in your name, email, and message before sending.",
      });
      return;
    }

    if (!EMAILJS_CONFIGURED) {
      setSubmissionState({
        type: "info",
        message: "EmailJS is not configured yet, so your email app will open with the message pre-filled.",
      });
      window.location.href = buildMailtoLink({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      });
      return;
    }

    setIsSending(true);
    setSubmissionState({ type: "idle", message: "" });

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
         user_name: trimmedName,
        user_email: trimmedEmail,
        message: trimmedMessage,
        to_name: "Maeez Pathan",
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setFormData({ name: "", email: "", message: "" });
      setSubmissionState({
        type: "success",
        message: `Message sent successfully to ${CONTACT_EMAIL}. I'll get back to you soon.`,
      });
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setSubmissionState({
        type: "error",
        message: "I couldn't send the message right now. Please use the email link below.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Space Mono', 'Courier New', monospace", background: "#050a0e", color: "#e0e6ef", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050a0e; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}44; border-radius: 2px; }
        .nav-link { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #6b7f99; cursor: pointer; padding: 6px 0; border: 0; background: transparent; border-bottom: 1px solid transparent; transition: color 0.2s, border-color 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: flex-start; }
        .nav-link:hover, .nav-link.active { color: ${ACCENT}; border-bottom-color: ${ACCENT}; }
        .nav-link:focus-visible, .menu-btn:focus-visible, .btn-primary:focus-visible, .btn-ghost:focus-visible { outline: 1px solid ${ACCENT}; outline-offset: 4px; }
        .menu-btn { display: none; background: none; border: none; color: ${ACCENT}; cursor: pointer; font-size: 20px; padding: 6px; }
        .mobile-nav-panel { display: none; }
        .section { padding: 90px 0 60px; max-width: 900px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
        .section-label { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 3px; color: ${ACCENT}; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-family: 'Outfit', sans-serif; font-size: clamp(28px, 5vw, 42px); font-weight: 700; color: #ffffff; margin-bottom: 48px; line-height: 1.1; }
        .skill-chip { display: inline-block; font-family: 'Space Mono', monospace; font-size: 11px; padding: 4px 10px; border: 1px solid ${ACCENT}33; border-radius: 3px; color: ${ACCENT}bb; margin: 3px; letter-spacing: 0.5px; transition: border-color 0.2s, color 0.2s; }
        .skill-chip:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
        .project-card { background: #0a1520; border: 1px solid #1a2535; border-radius: 8px; padding: 28px; margin-bottom: 20px; transition: border-color 0.3s, transform 0.2s; position: relative; overflow: hidden; }
        .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, ${ACCENT}00, ${ACCENT}, ${ACCENT2}, ${ACCENT2}00); opacity: 0; transition: opacity 0.3s; }
        .project-card:hover { border-color: ${ACCENT}44; transform: translateY(-2px); }
        .project-card:hover::before { opacity: 1; }
        .tag { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1.5px; padding: 3px 8px; border-radius: 2px; background: ${ACCENT}18; color: ${ACCENT}; border: 1px solid ${ACCENT}33; }
        .exp-card { border-left: 2px solid #1a2535; padding-left: 24px; margin-bottom: 40px; position: relative; transition: border-color 0.3s; }
        .exp-card:hover { border-left-color: ${ACCENT}66; }
        .exp-dot { width: 10px; height: 10px; border-radius: 50%; position: absolute; left: -6px; top: 4px; }
        .btn-primary { font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; background: transparent; border: 1px solid ${ACCENT}; color: ${ACCENT}; padding: 12px 28px; cursor: pointer; transition: background 0.2s, color 0.2s, opacity 0.2s; border-radius: 3px; }
        .btn-primary:hover { background: ${ACCENT}; color: #050a0e; }
        .btn-primary:disabled { opacity: 0.7; cursor: wait; }
        .btn-ghost { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1.5px; background: transparent; border: 1px solid #1a2535; color: #6b7f99; padding: 8px 16px; cursor: pointer; transition: border-color 0.2s, color 0.2s; border-radius: 3px; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { border-color: ${ACCENT}66; color: ${ACCENT}; }
        .input-field { width: 100%; background: #0a1520; border: 1px solid #1a2535; color: #e0e6ef; padding: 12px 16px; font-family: 'Space Mono', monospace; font-size: 13px; border-radius: 4px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: ${ACCENT}66; }
        .input-field::placeholder { color: #3a4a5a; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .contact-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        .contact-form { display: flex; flex-direction: column; gap: 14px; }
        .form-status { border-radius: 8px; padding: 16px 18px; border: 1px solid transparent; margin-bottom: 8px; }
        .form-status p { font-family: 'Outfit', sans-serif; font-size: 14px; line-height: 1.6; }
        .form-status.success { background: ${ACCENT}0a; border-color: ${ACCENT}33; }
        .form-status.success p { color: #c9d4e8; }
        .form-status.error { background: #ff5a5a0f; border-color: #ff5a5a33; }
        .form-status.error p { color: #ffd6d6; }
        .form-status.info { background: #5a8cff12; border-color: #5a8cff33; }
        .form-status.info p { color: #d7e2ff; }
        @media (max-width: 800px) { .contact-layout { grid-template-columns: 1fr; gap: 32px; } }
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
          .nav-desktop { display: none !important; }
          .menu-btn { display: inline-flex !important; align-items: center; justify-content: center; }
          .mobile-nav-panel { display: block !important; }
          .mobile-nav-panel .nav-link { width: 100%; text-align: left; }
        }
        .glow { text-shadow: 0 0 30px ${ACCENT}66; }
        .cursor { display: inline-block; width: 2px; height: 1.1em; background: ${ACCENT}; vertical-align: middle; animation: blink 1s step-end infinite; margin-left: 2px; }
        @keyframes blink { 50% { opacity: 0; } }
        .fade-in { animation: fadeUp 0.7s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .grid-dots { background-image: radial-gradient(circle, #1a2535 1px, transparent 1px); background-size: 28px 28px; }
        .social-link { display: inline-flex; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1.5px; color: #6b7f99; text-decoration: none; transition: color 0.2s; }
        .social-link:hover { color: ${ACCENT}; }
        .progress-bar { height: 2px; background: #0a1520; border-radius: 1px; overflow: hidden; margin-top: 6px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, ${ACCENT}, ${ACCENT2}); border-radius: 1px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#050a0eee", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a2535" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <img src="/logo-full.svg" alt="maeezscript" style={{ height: 30 }} />
          <div className="nav-desktop" style={{ display: "flex", gap: 28 }}>
            {NAV_LINKS.map(id => (
              <button key={id} type="button" className={`nav-link${activeSection === id ? " active" : ""}`} onClick={() => scrollTo(id)}>
                {id}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-label="Toggle navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            ☰
          </button>
        </div>
        {menuOpen && (
          <div id="mobile-navigation" className="mobile-nav-panel">
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#07111a", border: "1px solid #1a2535", borderRadius: 12, padding: 12 }}>
                {NAV_LINKS.map(id => (
                  <button key={id} type="button" className={`nav-link${activeSection === id ? " active" : ""}`} onClick={() => scrollTo(id)}>
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }} className="grid-dots">
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: 400, height: 400, background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 300, height: 300, background: `radial-gradient(circle, ${ACCENT2}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px", width: "100%" }}>
          <div className="fade-in">
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, color: ACCENT, marginBottom: 16 }}>
              &gt; hello_world.init()
            </p>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(40px, 9vw, 82px)", fontWeight: 700, lineHeight: 1.0, color: "#ffffff", marginBottom: 8 }}>
              Maeez<br />
              <span style={{ color: "transparent", WebkitTextStroke: `1px ${ACCENT}55` }}>Pathan</span>
            </h1>
            <div style={{ height: 48, display: "flex", alignItems: "center", margin: "20px 0 28px" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 500, color: ACCENT }} className="glow">
                {typed}<span className="cursor" />
              </span>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#6b7f99", maxWidth: 560, marginBottom: 36 }}>
              MCA final-semester student at GTU, interning at <span style={{ color: "#c9d4e8" }}>Casepoint Pvt. Ltd.</span> building enterprise .NET apps.
              Skilled in MERN stack - building real-world apps and doing freelance work locally in Surat.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 40 }}>
              <button className="btn-primary" onClick={() => scrollTo("projects")}>View Projects →</button>
              <button className="btn-ghost" onClick={() => scrollTo("contact")}>Get in Touch</button>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <a href="https://github.com/maeezp26" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                github.com/maeezp26
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="social-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4 }}>
          <span style={{ fontFamily: "Space Mono", fontSize: 10, letterSpacing: 2, color: "#6b7f99" }}>scroll</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${ACCENT}, transparent)` }} />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <p className="section-label">02. Arsenal</p>
        <h2 className="section-title">Technical Skills</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {Object.entries(SKILLS).map(([cat, items]) => (
            <div
              key={cat}
              style={{ background: "#0a1520", border: "1px solid #1a2535", borderRadius: 8, padding: 24, transition: "border-color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${ACCENT}44`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a2535"}
            >
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: ACCENT, marginBottom: 14 }}>{cat.toUpperCase()}</p>
              <div>{items.map(skill => <span key={skill} className="skill-chip">{skill}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <p className="section-label">03. Work</p>
        <h2 className="section-title">Projects</h2>
        {PROJECTS.map((project, index) => (
          <div key={index} className="project-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600, color: "#ffffff" }}>{project.title}</h3>
                  <span className="tag">{project.tag}</span>
                  {project.commits && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3a4a5a" }}>{project.commits} commits</span>}
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#6b7f99" }}>{project.subtitle}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-ghost">Live ↗</a>}
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub</a>
              </div>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.7, color: "#8a9ab5", marginBottom: 16 }}>{project.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.tech.map(tech => <span key={tech} className="skill-chip">{tech}</span>)}
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <p className="section-label">04. Journey</p>
        <h2 className="section-title">Experience</h2>
        {EXPERIENCE.map((entry, index) => (
          <div key={index} className="exp-card">
            <div className="exp-dot" style={{ background: entry.current ? ACCENT : "#1a2535", boxShadow: entry.current ? `0 0 8px ${ACCENT}88` : "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, color: "#ffffff" }}>{entry.role}</h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: ACCENT, letterSpacing: 1 }}>{entry.company} · {entry.location}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3a4a5a", letterSpacing: 1 }}>{entry.period}</span>
                {entry.current && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: ACCENT, background: `${ACCENT}18`, border: `1px solid ${ACCENT}33`, padding: "2px 8px", borderRadius: 2 }}>● current</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "10px 0 14px" }}>
              {entry.stack.map(skill => <span key={skill} className="skill-chip">{skill}</span>)}
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {entry.points.map((point, pointIndex) => (
                <li key={pointIndex} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#6b7f99", lineHeight: 1.7, marginBottom: 4, paddingLeft: 16, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: ACCENT }}>›</span>{point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section id="education" className="section">
        <p className="section-label">05. Learning</p>
        <h2 className="section-title">Education</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {EDUCATION.map((education, index) => (
            <div key={index} style={{ background: "#0a1520", border: `1px solid ${education.current ? `${ACCENT}44` : "#1a2535"}`, borderRadius: 8, padding: 28, position: "relative", overflow: "hidden" }}>
              {education.current && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})` }} />}
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: education.current ? ACCENT : "#3a4a5a", marginBottom: 12 }}>{education.period}</p>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: "#ffffff", marginBottom: 8, lineHeight: 1.3 }}>{education.degree}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#6b7f99", marginBottom: 8 }}>{education.institute}</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: education.current ? ACCENT : "#3a4a5a" }}>{education.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <p className="section-label">06. Connect</p>
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-layout">
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#6b7f99", lineHeight: 1.8, marginBottom: 28 }}>
              I'm open to full-stack developer roles, freelance projects, and collaborations. Currently based in Surat, Gujarat. Let's build something great.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <a href={`mailto:${CONTACT_EMAIL}`} className="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                {CONTACT_EMAIL}
              </a>
              <a href="tel:+919081634004" className="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 0116.5 2.18 2 2 0 0118.92 4v3a2 2 0 01-1.41 1.68A16 16 0 0115.04 10a16 16 0 002 3.5 16 16 0 003.5 2 2 0 011.46 1.42z"/></svg>
                +91 90816 34004
              </a>
              <a href="https://github.com/maeezp26" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                github.com/maeezp26
              </a>
              <span className="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                Surat, Gujarat, India
              </span>
            </div>
          </div>
          <div>
            {submissionState.type !== "idle" && (
              <div className={`form-status ${submissionState.type}`} role="status" aria-live="polite">
                <p>{submissionState.message}</p>
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="grid-2">
                <label className="sr-only" htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  name="name"
                  className="input-field"
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <label className="sr-only" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  className="input-field"
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <label className="sr-only" htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                className="input-field"
                placeholder="Your message..."
                rows={5}
                required
                style={{ resize: "vertical" }}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
              <button className="btn-primary" type="submit" disabled={isSending} style={{ alignSelf: "flex-start", opacity: isSending ? 0.8 : 1, cursor: isSending ? "wait" : "pointer" }}>
                {isSending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a2535", padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3a4a5a", letterSpacing: 1 }}>
          Designed & Built by <span style={{ color: ACCENT }}>Maeez Pathan</span> · 2025
        </p>
      </footer>
    </div>
  );
}
