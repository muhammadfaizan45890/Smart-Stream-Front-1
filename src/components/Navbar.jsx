/* ════════════════════════════════════════════════════════════════════
   FEATHERED EXPERTS — Introduction page
   Single-file React component (React + Tailwind CSS + framer-motion).
   No store, no cart — this page only introduces the brand and its
   facilities. Every call to action opens a WhatsApp chat.

   ── HOW TO USE ───────────────────────────────────────────────────
   1. Put this file and `feather-logo.png` in the same folder
      (e.g. `src/components/`) and render it:
         import FeatheredExperts from "./FeatheredExperts";
         <FeatheredExperts />
   2. Install the dependencies (same family as the SmartStream build):
         npm i react-router-dom lucide-react react-icons framer-motion
   3. Make sure the `feather-logo.png` file sits next to this file —
      the import at the top (`./feather-logo.png`) points at it.

   ── TAILWIND `3xl:` BREAKPOINT — REQUIRED SETUP ──────────────────
   This file uses `3xl:` utilities (e.g. `3xl:max-w-6xl`, `3xl:text-lg`)
   for the 1920px+ HD/4K enlargements. `3xl` is NOT a default Tailwind
   breakpoint, so those classes are silently ignored unless you define it:

   • Tailwind v3 — in `tailwind.config.js`, inside `theme.extend`:
         screens: {
           '3xl': '1920px',
         },
   • Tailwind v4 — in the stylesheet that has `@import "tailwindcss"`:
         @theme {
           --breakpoint-3xl: 1920px;
         },

   The core 1920px / 2560px scaling does NOT depend on this — it lives
   in the embedded <style> block below (fluid container, fluid type and
   media queries) — so the page still works without the config; only the
   `3xl:` enlargements would not apply on very large screens.
   ════════════════════════════════════════════════════════════════════ */

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link, useInRouterContext } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bitcoin,
  Bot,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Globe,
  Headphones,
  Landmark,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  Moon,
  MousePointerClick,
  PackageCheck,
  PenLine,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import {
  SiGooglegemini,
  SiYoutube,
  SiCursor,
  SiElevenlabs,
  SiAnthropic,
} from "react-icons/si";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useSpring,
  useInView,
  animate,
  LayoutGroup,
} from "framer-motion";

/* ════════════════════════════════════════════════════════════
   LOGO IMPORT — white feather on black.
   Keep `feather-logo.png` next to this file.
   ════════════════════════════════════════════════════════════ */
import featherLogo from "./feather-logo.png";

/* ════════════════════════════════════════════════════════════
   CONFIGURATION & CONSTANTS
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  brandName: "FEATHERED EXPERTS",
  tagline: "Digital services, done by experts.",
  whatsappNumber: "923716837122",
  whatsappDisplay: "+92 371 6837122",
  supportEmail: "smartstreamsoftware@gmail.com",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
  channelUrl: "https://whatsapp.com/channel/0029VbE66le8fewoR2Y8ZF2y",
};

const THEME_KEY = "fe-theme";
const POPUP_KEY = "fe-channel-popup-dismissed";

/* Custom Midjourney SVG Icon */
const MidjourneyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.36 19.06H1.64a.45.45 0 0 1-.39-.68l.83-1.42a.45.45 0 0 1 .78 0l.56.95h17.16l.56-.95a.45.45 0 0 1 .78 0l.83 1.42a.45.45 0 0 1-.39.68Z" />
    <path d="M18.15 11.28 12 2.06 5.85 11.28a.45.45 0 0 0 .37.7h11.56a.45.45 0 0 0 .37-.7Zm-6.15-6.4 3.8 5.68H8.2L12 4.88Z" />
  </svg>
);

/* ── AI tools sold by Feathered Experts (same catalogue as SmartStream) ── */
const AI_TOOLS = [
  { id: "gemini-pro", name: "Gemini Advanced", icon: SiGooglegemini, hue: "#3b82f6" },
  { id: "youtube-premium", name: "YouTube Premium", icon: SiYoutube, hue: "#ef4444" },
  { id: "cursor-pro", name: "Cursor AI Pro", icon: SiCursor, hue: "#10b981" },
  { id: "midjourney", name: "Midjourney Basic", icon: MidjourneyIcon, hue: "#d946ef" },
  { id: "elevenlabs", name: "ElevenLabs Creator", icon: SiElevenlabs, hue: "#f59e0b" },
  { id: "claude-pro", name: "Claude Pro", icon: SiAnthropic, hue: "#f97316" },
];

const SERVICES = [
  {
    id: "ai-tools",
    name: "AI Tools, Premium Access",
    category: "AI Tools",
    icon: Bot,
    hue: "#8b5cf6",
    badge: "HOT",
    desc: "Premium subscriptions to the AI tools everyone is talking about — at the best market price, activated fast on WhatsApp.",
    features: ["Gemini Advanced (Pro)", "YouTube Premium", "Cursor AI Pro", "Midjourney Basic", "ElevenLabs Creator", "Claude Pro"],
    tools: AI_TOOLS,
    cta: "Ask for an AI tool",
  },
  {
    id: "blogs",
    name: "Blog Uploads & Publishing",
    category: "Content",
    icon: PenLine,
    hue: "#0ea5e9",
    badge: "",
    desc: "We write, format and publish blog posts for you — clean, readable and ready to rank, on your own site or ours.",
    features: ["Blog writing & uploads", "SEO-ready formatting", "Images & cover design", "Scheduled publishing"],
    tools: [],
    cta: "Get a blog published",
  },
  {
    id: "websites",
    name: "Website Creation",
    category: "Websites",
    icon: Globe,
    hue: "#10b981",
    badge: "POPULAR",
    desc: "Modern, fast, mobile-first websites built for your business — from a simple intro page to a full online store.",
    features: ["Modern responsive design", "Fast loading pages", "WhatsApp & contact built in", "Domain & hosting guidance"],
    tools: [],
    cta: "Get a website built",
  },
  {
    id: "meta-ads",
    name: "Meta Ads That Convert",
    category: "Marketing",
    icon: Megaphone,
    hue: "#f59e0b",
    badge: "NEW",
    desc: "Facebook and Instagram ads planned, designed and managed for you — targeted at the people most likely to buy.",
    features: ["Facebook & Instagram ads", "Audience targeting", "Ad creatives & copy", "Weekly performance reports"],
    tools: [],
    cta: "Run my Meta ads",
  },
  {
    id: "content-social",
    name: "Content & Social Support",
    category: "Content",
    icon: Share2,
    hue: "#ec4899",
    badge: "",
    desc: "Posts, captions, profiles and branding that keep your pages active — so your audience keeps growing while you work.",
    features: ["Social media posts", "Captions & hashtags", "Profile setup & branding", "Monthly content plans"],
    tools: [],
    cta: "Grow my socials",
  },
  {
    id: "more",
    name: "Different Facilities",
    category: "More",
    icon: Plus,
    hue: "#64748b",
    badge: "",
    desc: "Need something that isn't listed? Tell us what you have in mind — if it's digital, there's a good chance we can do it.",
    features: ["Custom requests welcome", "One chat for everything", "Fast quotes on WhatsApp", "Flexible pricing"],
    tools: [],
    cta: "Tell us what you need",
  },
];

const EXPLORER_CATEGORIES = ["All", "AI Tools", "Content", "Websites", "Marketing", "More"];

const STEPS = [
  { icon: MessageCircle, title: "Message on WhatsApp", desc: "Tap any button and tell us what you need — no forms, no waiting." },
  { icon: Send, title: "Discuss & plan", desc: "We talk through the details, timing and the best price for you." },
  { icon: CreditCard, title: "Pay your way", desc: "Bank transfer, Easypaisa, JazzCash or crypto — whatever suits you." },
  { icon: PackageCheck, title: "Get it done", desc: "Your tool, blog, website or ad is delivered — with support after." },
];

const FEATURES = [
  { icon: Zap, title: "Fast Delivery", desc: "Most orders are completed within minutes to hours after payment." },
  { icon: ShieldCheck, title: "Quality Checked", desc: "Every tool, post and page is checked before it reaches you." },
  { icon: CreditCard, title: "Local Payments", desc: "Pay via bank transfer, Easypaisa, JazzCash or crypto." },
  { icon: Headphones, title: "24/7 Support", desc: "Our team is on WhatsApp whenever you need help." },
];

const FAQS = [
  { q: "What is Feathered Experts?", a: "Feathered Experts is a digital services team. We sell premium AI tool subscriptions, publish blogs, build websites, run Meta ads and handle other digital work — all through one WhatsApp chat." },
  { q: "How do I order a service?", a: "Tap any WhatsApp button on this page and send us a message. Tell us what you need, we'll discuss the details and price, and then get started — no account or form needed." },
  { q: "Which payment methods do you accept?", a: "Local bank transfer, Easypaisa, JazzCash and crypto. We share the payment details on WhatsApp once you confirm your order." },
  { q: "How fast will my work be delivered?", a: "AI tool activations are usually done within minutes of payment. Blogs, websites and ad campaigns depend on the scope — we always agree a clear timeline with you first." },
  { q: "What if I need something that isn't listed?", a: "Message us anyway. The 'Different Facilities' card exists for exactly that — if it's digital, there's a good chance we can do it, and we'll tell you honestly if we can't." },
  { q: "Can I renew my AI tool when the month ends?", a: "Absolutely. Message us before expiry and we'll renew it with the same setup — usually in minutes." },
];

const PAYMENTS = [
  { icon: Landmark, label: "Bank Transfer" },
  { icon: Smartphone, label: "Easypaisa" },
  { icon: Smartphone, label: "JazzCash" },
  { icon: Bitcoin, label: "Crypto" },
];

const NAV_LINKS = [
  { id: "services", href: "#services", label: "Services" },
  { id: "how", href: "#how", label: "How it works" },
  { id: "why", href: "#why", label: "Why us" },
  { id: "faq", href: "#faq", label: "FAQ" },
];

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const openWhatsApp = (text) => window.open(waLink(text), "_blank", "noopener,noreferrer");

const SOCIALS = [
  { id: "whatsapp", label: "WhatsApp Support", url: waLink(), Icon: FaWhatsapp, brand: "#25D366" },
  { id: "youtube", label: "YouTube", url: "http://www.youtube.com/@SmartSteamAutomation", Icon: FaYoutube, brand: "#FF0000" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/smartstreamsoftwaretools", Icon: FaInstagram, brand: "#E4405F" },
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@smart.steam.autom", Icon: FaTiktok, brand: "#ffffff" },
  { id: "x", label: "X (Twitter)", url: "https://x.com/SmartSteamX", Icon: FaXTwitter, brand: "#ffffff" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-mubashir-483b6b392", Icon: FaLinkedinIn, brand: "#0A66C2" },
];

const tint = (hue) => ({ color: hue, background: `color-mix(in srgb, ${hue} 14%, transparent)` });

/* ════════════════════════════════════════════════════════════
   HOOKS
   ════════════════════════════════════════════════════════════ */
const loadJSON = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

function getInitialTheme() {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === "light" || s === "dark") return s;
  } catch {
    /* ignore */
  }
  return "dark";
}

function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("fe-theme-transition");
    window.setTimeout(() => root.classList.remove("fe-theme-transition"), 300);
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}

function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useEscape(handler, active) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && handler();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

function useFocusTrap(active) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement;
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
    const focusables = () => [...node.querySelectorAll(sel)].filter((el) => el.offsetParent !== null);
    const t = setTimeout(() => (focusables()[0] || node).focus(), 60);
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return e.preventDefault();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      node.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [active]);
  return ref;
}

function useScrollSpy(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* prefers-reduced-motion as a reactive hook */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* Pointer-driven 3D tilt + glare for cards.
   Sets --rx/--ry/--mx/--my custom properties on the element.
   Skips touch devices and reduced-motion users. Uses rAF to
   avoid layout thrash on rapid pointermove events. */
function useTilt(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        el.classList.add("is-tilting");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, enabled]);
}

/* ════════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ════════════════════════════════════════════════════════════ */
const SmartLink = ({ to, children, ...props }) => {
  const inRouter = useInRouterContext();
  return inRouter ? (
    <Link to={to} {...props}>{children}</Link>
  ) : (
    <a href={to} {...props}>{children}</a>
  );
};

/* The feather logo is a white feather on a black square, so it is
   always shown inside a black rounded tile — crisp in both themes. */
const FeatherLogoTile = React.memo(function FeatherLogoTile({ size = "md", className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const sizes = {
    sm: "h-9 w-9 rounded-xl",
    md: "h-11 w-11 rounded-2xl",
    lg: "h-24 w-24 rounded-[2rem] sm:h-28 sm:w-28",
  };
  return (
    <span className={`fe-logo-tile ${sizes[size] || sizes.md} ${loaded ? "is-loaded" : ""} ${className}`}>
      {!loaded && <span className="fe-shimmer" aria-hidden="true" />}
      <img
        src={featherLogo}
        alt="Feathered Experts logo — a white feather"
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover"
      />
    </span>
  );
});

const BrandLogo = React.memo(function BrandLogo({ className = "" }) {
  return (
    <a
      href="#top"
      aria-label={`${CONFIG.brandName} home`}
      className={`flex items-center gap-2.5 rounded-lg group ${className}`}
    >
      <FeatherLogoTile size="sm" className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6" />
      <span className="hidden text-[15px] font-extrabold tracking-tight sm:block">
        {CONFIG.brandName}
      </span>
    </a>
  );
});

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fe-icon-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Counter({ to, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const Reveal = React.memo(function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

const SectionHead = React.memo(function SectionHead({ eyebrow, title, sub, center = false }) {
  return (
    <Reveal className={`mb-8 max-w-2xl sm:mb-12 ${center ? "mx-auto text-center" : ""}`}>
      <p className="fe-subtle mb-2 text-[11px] font-bold uppercase tracking-[0.14em]">{eyebrow}</p>
      <h2 className="fe-h2">{title}</h2>
      {sub && <p className="fe-muted mt-3 text-sm leading-relaxed sm:text-[15px]">{sub}</p>}
    </Reveal>
  );
});

/* ════════════════════════════════════════════════════════════
   PARTICLE FIELD — HD canvas hero background
   DevicePixelRatio-aware canvas rendering an animated dot-grid
   + particle network. Respects prefers-reduced-motion (renders one
   static frame), pauses when the tab is hidden, and fully cleans
   up listeners/animation frames on unmount or theme change.
   Pure vector rendering: razor sharp on Retina / 4K displays.
   ════════════════════════════════════════════════════════════ */
const ParticleField = React.memo(function ParticleField({ theme, className = "" }) {
  const canvasRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let parts = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf
    const isDark = theme !== "light";

    // Theme-aware palette, cached per init (no per-frame style reads)
    const palette = isDark
      ? { dot: "rgba(148,163,184,0.55)", link: [148, 163, 184], grid: "rgba(148,163,184,0.07)" }
      : { dot: "rgba(15,23,42,0.35)", link: [15, 23, 42], grid: "rgba(15,23,42,0.06)" };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };

    const seed = () => {
      const count = Math.max(24, Math.min(110, Math.floor((w * h) / 20000)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.7 + 0.5,
      }));
    };

    const drawGrid = () => {
      const gap = 54;
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0.5; x <= w; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0.5; y <= h; y += gap) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      const maxD = 130;
      const maxD2 = maxD * maxD;
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const alpha = ((1 - Math.sqrt(d2) / maxD) * 0.20).toFixed(3);
            ctx.strokeStyle = `rgba(${palette.link[0]},${palette.link[1]},${palette.link[2]},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = palette.dot;
      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
          if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
        }
      }
      if (!reduceMotion) raf = requestAnimationFrame(step);
    };

    resize();
    step(); // draws at least one frame (static when reduced motion)

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150); // debounce: no layout thrash
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [theme, reduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

/* ════════════════════════════════════════════════════════════
   SERVICE CARD — memoized + 3D tilt/glare
   The outer motion.article keeps layout animations; the inner
   div owns the pointer-driven tilt so framer's transform never
   fights the CSS custom-property transform.
   ════════════════════════════════════════════════════════════ */
const ServiceCard = React.memo(function ServiceCard({ service, idx, selected, onSelect, tiltEnabled }) {
  const tiltRef = useRef(null);
  useTilt(tiltRef, tiltEnabled);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="fe-card-wrap"
    >
      <button
        type="button"
        onClick={() => onSelect(service.id)}
        aria-pressed={selected}
        className="block h-full w-full text-left"
      >
        <div
          ref={tiltRef}
          className={`fe-card fe-tilt fe-glare fe-spot group relative flex h-full flex-col overflow-hidden p-5 sm:p-6 ${selected ? "fe-card-selected" : ""}`}
        >
          <div className="relative flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={tint(service.hue)}>
              <service.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {service.badge && <span className="fe-chip shrink-0">{service.badge}</span>}
          </div>

          <h3 className="relative mt-4 text-base font-bold tracking-tight">{service.name}</h3>
          <p className="fe-muted relative mt-2 line-clamp-2 text-[13px] leading-relaxed">{service.desc}</p>

          <div className="relative mt-auto pt-5">
            <div className="fe-divider mb-4" />
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${selected ? "" : "fe-muted"}`}>
              {selected ? (
                <>
                  <Check className="h-4 w-4" /> Selected — see details below
                </>
              ) : (
                <>
                  Explore this service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
});

function SocialLinks({ className = "" }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Social media">
      {SOCIALS.map(({ id, label, url, Icon, brand }) => (
        <li key={id}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="fe-social"
            style={{ "--brand": brand }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOTER COMPONENTS
   ════════════════════════════════════════════════════════════ */
const BackToTop = React.memo(function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fe-fab fe-fab-top fixed z-40 inline-flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

const UpdatesForm = React.memo(function UpdatesForm() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const clearError = () => {
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!agree) {
      setStatus("error");
      setMessage("Please confirm you agree to receive updates.");
      return;
    }
    setStatus("loading");
    setMessage("");
    timerRef.current = setTimeout(() => {
      openWhatsApp(`Hello Feathered Experts! Please add ${trimmed} to your offers and updates list.`);
      setStatus("success");
      setMessage("Opening WhatsApp — send the message to finish.");
      setEmail("");
      setAgree(false);
      timerRef.current = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }, 400);
  };

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" noValidate>
      <div className="relative">
        <Mail className="fe-subtle pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2" aria-hidden="true" />
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          placeholder="your@email.com"
          autoComplete="email"
          inputMode="email"
          aria-label="Email address"
          aria-invalid={status === "error"}
          aria-describedby="updates-msg"
          disabled={isLoading}
          className="fe-input !h-12 w-full pl-10 pr-28 disabled:opacity-60 sm:pr-32"
        />
        <button type="submit" disabled={isLoading} className="fe-btn fe-btn-primary absolute right-1.5 top-1/2 !min-h-9 -translate-y-1/2 !rounded-full !px-3.5 !text-xs sm:!px-4">
          {isLoading ? (
            <>
              <span className="fe-spinner h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Joining…</span>
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <label className="fe-muted flex cursor-pointer select-none items-start gap-2.5 text-[12px] leading-snug">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            clearError();
          }}
          className="fe-check mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          I agree to receive offers and updates from Feathered Experts
          {CONFIG.privacyUrl && (
            <>
              {" "}and accept the{" "}
              <SmartLink to={CONFIG.privacyUrl} className="underline underline-offset-2">privacy policy</SmartLink>
            </>
          )}
          .
        </span>
      </label>

      <div id="updates-msg" aria-live="polite" className="min-h-[1.25rem]">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={`flex items-center gap-1.5 text-xs font-medium ${status === "success" ? "fe-success" : "text-red-500"}`}
              role={status === "error" ? "alert" : "status"}
            >
              {status === "success" ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} /> : <span aria-hidden="true">!</span>}
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});

const FeatherFooter = React.memo(function FeatherFooter({ onPickCategory }) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const legal = [
    { label: "Privacy", href: CONFIG.privacyUrl },
    { label: "Terms", href: CONFIG.termsUrl },
  ];

  return (
    <footer className="fe-foot mt-8 w-full sm:mt-12">
      <div className="fe-divider-b">
        <div className="fe-wrap py-10 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="fe-h2">Join the Feathered Experts list.</h2>
              <p className="fe-muted mt-3 max-w-md text-sm sm:text-base">
                Get early access to new AI tools, offers and guides. We&apos;ll add you to our updates list on WhatsApp.
              </p>
            </div>
            <div className="w-full max-w-md lg:ml-auto">
              <UpdatesForm />
            </div>
          </div>
        </div>
      </div>

      <div className="fe-wrap py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <BrandLogo />
            <p className="fe-muted max-w-sm text-sm leading-relaxed">
              AI tools, blogs, websites, Meta ads and more — one expert team, one WhatsApp chat, 24/7 support.
            </p>
            <SocialLinks />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-4 lg:gap-6 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Services</h3>
              <ul className="space-y-1">
                {EXPLORER_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <li key={c}>
                    <button type="button" onClick={() => onPickCategory(c)} className="fe-foot-link">
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Help</h3>
              <ul className="space-y-1">
                <li><a href="#how" className="fe-foot-link">How it works</a></li>
                <li><a href="#faq" className="fe-foot-link">FAQ</a></li>
                <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="fe-foot-link">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Legal</h3>
              <ul className="space-y-1">
                {legal.map((l) => (
                  <li key={l.label}><SmartLink to={l.href} className="fe-foot-link">{l.label}</SmartLink></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em]">Get in touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="fe-icon-chip"><MessageCircle className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="fe-subtle text-[10px] font-semibold uppercase tracking-wider">WhatsApp</p>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="fe-foot-link !px-0 break-words text-sm !text-[var(--fg)]">
                    {CONFIG.whatsappDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="fe-icon-chip"><Mail className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="fe-subtle text-[10px] font-semibold uppercase tracking-wider">Email</p>
                  <a href={`mailto:${CONFIG.supportEmail}`} className="fe-foot-link !px-0 break-all text-sm !text-[var(--fg)]">
                    {CONFIG.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="fe-icon-chip"><Clock className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="fe-subtle text-[10px] font-semibold uppercase tracking-wider">Hours</p>
                  <p className="text-sm">24/7 Support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="fe-icon-chip bg-[#25D366]/10 text-[#25D366]"><MessageCircle className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="fe-subtle text-[10px] font-semibold uppercase tracking-wider">Channel</p>
                  <a href={CONFIG.channelUrl} target="_blank" rel="noopener noreferrer" className="fe-foot-link !px-0 break-words text-sm !text-[#25D366] hover:underline">
                    Follow our Channel
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="fe-divider-t">
        <div className="fe-wrap py-6">
          <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {[
              { title: "Fast Delivery", subtitle: "Via WhatsApp" },
              { title: "Quality Checked", subtitle: "Before it reaches you" },
              { title: "Local Payments", subtitle: "Bank, Easypaisa, JazzCash, Crypto" },
              { title: "24/7 Support", subtitle: "We're on WhatsApp" },
            ].map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">{b.title}</p>
                  <p className="fe-subtle text-[11px]">{b.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fe-divider-t fe-foot-bottom">
        <div className="fe-wrap flex flex-col items-center justify-between gap-4 py-5 lg:flex-row">
          <p className="fe-subtle text-center text-[11px]">© {year} {CONFIG.brandName}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
            {PAYMENTS.map(({ icon: Icon, label }) => (
              <li key={label} className="fe-pay">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
});

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT — introduction page only (no store, no cart)
   ════════════════════════════════════════════════════════════ */
export default function FeatheredExperts() {
  const [theme, toggleTheme] = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState("ai-tools");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [showChannelPopup, setShowChannelPopup] = useState(false);

  const menuRef = useFocusTrap(menuOpen);
  const activeSection = useScrollSpy(NAV_LINKS.map((l) => l.id));

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  useLockBody(menuOpen || showChannelPopup);
  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setShowChannelPopup(false);
  }, []);
  useEscape(closeAll, menuOpen || showChannelPopup);

  // Show the WhatsApp channel popup once, shortly after first visit
  useEffect(() => {
    let dismissed = null;
    try {
      dismissed = localStorage.getItem(POPUP_KEY);
    } catch {
      /* storage unavailable */
    }
    if (!dismissed) {
      const timer = setTimeout(() => setShowChannelPopup(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissChannelPopup = () => {
    setShowChannelPopup(false);
    try {
      localStorage.setItem(POPUP_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.title = "Feathered Experts — AI Tools, Blogs, Websites & Meta Ads";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Feathered Experts: premium AI tools, blog uploads, website creation, Meta ads and more — one expert team, one WhatsApp chat.";
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCategory = useCallback((cat) => {
    setSelectedCategory(cat);
    const svc = SERVICES.find((s) => s.category === cat);
    if (svc) setSelectedService(svc.id);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const filteredServices = useMemo(
    () => SERVICES.filter((s) => selectedCategory === "All" || s.category === selectedCategory),
    [selectedCategory]
  );
  const activeService = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];

  const stats = [
    { n: SERVICES.length, s: "", l: "Facilities", d: 0 },
    { n: AI_TOOLS.length, s: "", l: "Premium AI tools", d: 0 },
    { n: 24, s: "/7", l: "WhatsApp support", d: 0 },
    { n: 100, s: "%", l: "Done for you", d: 0 },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="fe-root min-h-screen overflow-x-clip">
        <a href="#services" className="fe-skip">Skip to services</a>

        <motion.div style={{ scaleX: progress, background: "var(--accent)" }} className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left" aria-hidden="true" />

        <header className={`fe-header fixed top-0 z-40 w-full transition-colors duration-300 ${isScrolled ? "fe-header-on fe-glass" : ""}`}>
          <div className="fe-wrap flex h-14 items-center justify-between gap-2 sm:h-16">
            <BrandLogo />

            <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} aria-current={activeSection === l.id ? "true" : undefined} className={`fe-navlink ${activeSection === l.id ? "fe-navlink-active" : ""}`}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="fe-btn fe-btn-outline !min-h-9 !px-3.5 !text-[13px] hidden sm:inline-flex">
                <MessageCircle className="h-4 w-4" /> Support
              </a>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <a href={waLink("Hello Feathered Experts! I want to get started.")} target="_blank" rel="noopener noreferrer" className="fe-btn fe-btn-wa !min-h-9 !px-3.5 !text-[13px] hidden sm:inline-flex">
                <FaWhatsapp className="h-4 w-4" /> Chat Now
              </a>
              <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="fe-icon-btn md:hidden">
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="fe-scrim fixed inset-0 z-50 md:hidden" />
              <motion.aside
                ref={menuRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="fe-panel fe-drawer fe-glass fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-xs flex-col p-5 md:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <BrandLogo />
                  <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="fe-icon-btn">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav aria-label="Mobile" className="overflow-y-auto">
                  {NAV_LINKS.map((l, i) => (
                    <motion.a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.05 }} className="fe-divider-b flex min-h-12 items-center justify-between py-3 text-lg font-bold tracking-tight">
                      {l.label} <ArrowUpRight className="fe-subtle h-4 w-4" />
                    </motion.a>
                  ))}
                </nav>
                <div className="mt-auto space-y-4 pt-6">
                  <SocialLinks />
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="fe-btn fe-btn-wa !min-h-12 w-full">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main>
          {/* ─── HERO ─── */}
          <section className="relative isolate overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 2xl:pt-40">
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <ParticleField theme={theme} className="fe-particles absolute inset-0 h-full w-full" />
              <div className="fe-noise absolute inset-0" />
              <div className="fe-hero-fade absolute inset-0" />
            </div>
            <div className="fe-blob fe-blob-a -z-10" aria-hidden="true" />
            <div className="fe-blob fe-blob-b -z-10" aria-hidden="true" />
            <div className="fe-blob fe-blob-c -z-10" aria-hidden="true" />

            <div className="mx-auto flex max-w-4xl flex-col items-center text-center 3xl:max-w-6xl">
              {/* Floating feather logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-6"
              >
                <div className="fe-logo-glow absolute inset-0 -z-10" aria-hidden="true" />
                <motion.div
                  animate={reduceMotion ? {} : { y: [0, -12, 0], rotate: [0, -2, 0, 2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FeatherLogoTile size="lg" className="fe-float-shadow" />
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="fe-pill fe-glass mb-5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {CONFIG.tagline}
              </motion.div>

              <h1 className="fe-h1">
                {["Every digital service", "you need."].map((w, i) => (
                  <motion.span key={w} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mr-[0.25em] inline-block">
                    {w}
                  </motion.span>
                ))}
                <br />
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="fe-gradient-text inline-block">
                  One expert team.
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.45 }} className="fe-muted mt-4 max-w-xl text-sm leading-relaxed sm:text-base 3xl:max-w-2xl 3xl:text-lg">
                Feathered Experts brings you premium AI tools, blogs, websites, Meta ads and more — message us on WhatsApp and consider it done.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.45 }} className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                <a href={waLink("Hello Feathered Experts! I want to get started.")} target="_blank" rel="noopener noreferrer" className="fe-btn fe-btn-wa group !min-h-11 w-full !px-6 sm:w-auto">
                  <FaWhatsapp className="h-4 w-4" /> Chat on WhatsApp <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a href="#services" className="fe-btn fe-btn-outline fe-glass !min-h-11 w-full !px-6 sm:w-auto">
                  <Sparkles className="h-4 w-4" /> Explore Services
                </a>
              </motion.div>

              <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 3xl:max-w-4xl" aria-label="AI tools we sell">
                {AI_TOOLS.map((t) => (
                  <li key={t.id} className="fe-pill fe-glass !py-1 !normal-case !tracking-normal">
                    <span className="flex h-4 w-4 items-center justify-center rounded" style={tint(t.hue)}>
                      <t.icon className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold">{t.name}</span>
                  </li>
                ))}
              </motion.ul>

              <dl className="fe-divider-y mt-10 grid w-full max-w-2xl grid-cols-2 gap-5 py-6 sm:grid-cols-4 3xl:max-w-4xl">
                {stats.map((s) => (
                  <div key={s.l} className="flex flex-col-reverse">
                    <dt className="fe-subtle mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">{s.l}</dt>
                    <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl 3xl:text-4xl">
                      <Counter to={s.n} decimals={s.d} suffix={s.s} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ─── SERVICES MARQUEE ─── */}
          <section aria-hidden="true" className="fe-marquee-wrap overflow-hidden py-3.5">
            <div className="fe-marquee flex w-max whitespace-nowrap">
              {[...SERVICES, ...SERVICES].map((s, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 text-xs font-bold uppercase tracking-[0.14em]">
                  {s.name} <Sparkles className="h-3.5 w-3.5 opacity-50" />
                </span>
              ))}
            </div>
          </section>

          {/* ─── SERVICES EXPLORER ─── */}
          <section id="services" className="fe-wrap scroll-mt-16 py-14 sm:py-20">
            <SectionHead eyebrow="What we do" title="Pick a facility. We'll handle the rest." sub="Tap a service to see what it includes — then message us on WhatsApp to get started." />

            <div className="mb-8 flex flex-col gap-3">
              <LayoutGroup>
                <div role="group" aria-label="Service categories" className="fe-noscroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0">
                  {EXPLORER_CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button key={cat} type="button" aria-pressed={active} onClick={() => setSelectedCategory(cat)} className={`fe-tab relative ${active ? "fe-tab-active" : ""}`}>
                        {active && <motion.span layoutId="catPill" className="absolute inset-0 rounded-full" style={{ background: "var(--accent)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        <span className="relative">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>

            <p className="sr-only" role="status" aria-live="polite">{filteredServices.length} services shown</p>

            <motion.div layout className="fe-services-grid">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service, idx) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    idx={idx}
                    selected={selectedService === service.id}
                    onSelect={setSelectedService}
                    tiltEnabled={!reduceMotion}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Selected service detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fe-card fe-glass mt-6 overflow-hidden p-6 sm:p-8"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={tint(activeService.hue)}>
                        <activeService.icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="fe-subtle text-[10px] font-bold uppercase tracking-[0.14em]">{activeService.category}</p>
                        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{activeService.name}</h3>
                      </div>
                    </div>
                    <p className="fe-muted mt-4 max-w-2xl text-sm leading-relaxed sm:text-[15px]">{activeService.desc}</p>

                    {activeService.tools.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="AI tools included">
                        {activeService.tools.map((t) => (
                          <li key={t.id} className="fe-pill !py-1 !normal-case !tracking-normal">
                            <span className="flex h-4 w-4 items-center justify-center rounded" style={tint(t.hue)}>
                              <t.icon className="h-2.5 w-2.5" aria-hidden="true" />
                            </span>
                            <span className="text-xs font-semibold">{t.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="w-full shrink-0 lg:w-80">
                    <h4 className="fe-subtle mb-3 text-[11px] font-bold uppercase tracking-[0.14em]">What&apos;s included</h4>
                    <ul className="space-y-2.5">
                      {activeService.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm font-medium">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                            <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={waLink(`Hello Feathered Experts! I'm interested in ${activeService.name}. Please share the details and price.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fe-btn fe-btn-wa !min-h-11 mt-6 w-full"
                    >
                      <MessageCircle className="h-4 w-4" /> {activeService.cta}
                    </a>
                    <p className="fe-subtle mt-3 text-center text-xs">You&apos;ll be redirected to WhatsApp to discuss and order.</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ─── HOW IT WORKS ─── */}
          <section id="how" className="fe-band scroll-mt-16 py-14 sm:py-20">
            <div className="fe-wrap">
              <SectionHead center eyebrow="Simple process" title="From message to done in 4 steps." />
              <ol className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 3xl:gap-8">
                {STEPS.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <div className="fe-card fe-card-hover h-full p-6 text-center 3xl:p-8">
                        <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl 3xl:h-14 3xl:w-14" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                          <s.icon className="h-5 w-5" aria-hidden="true" />
                          <span className="fe-step-num absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">{i + 1}</span>
                        </div>
                        <h3 className="mb-1.5 text-base font-bold tracking-tight 3xl:text-lg">{s.title}</h3>
                        <p className="fe-muted text-[13px] leading-relaxed 3xl:text-sm">{s.desc}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ─── WHY US ─── */}
          <section id="why" className="scroll-mt-16 py-14 sm:py-20">
            <div className="fe-wrap">
              <SectionHead center eyebrow="Why Feathered Experts" title="Why work with us?" sub="One team for everything digital — so you stop juggling sellers and start getting things done." />
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 3xl:gap-8">
                {FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.07} className="h-full">
                    <div className="fe-card fe-card-hover h-full p-6 3xl:p-8">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl 3xl:h-12 3xl:w-12" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                        <f.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mb-1.5 text-base font-bold tracking-tight 3xl:text-lg">{f.title}</h3>
                      <p className="fe-muted text-[13px] leading-relaxed 3xl:text-sm">{f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section id="faq" className="fe-band scroll-mt-16 py-14 sm:py-20">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 3xl:max-w-5xl">
              <SectionHead center eyebrow="FAQ" title="Got questions?" />
              <div className="space-y-2.5">
                {FAQS.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <Reveal key={f.q} delay={i * 0.04}>
                      <div className={`fe-card overflow-hidden !rounded-xl transition-colors ${open ? "!border-[var(--border-strong)]" : ""}`}>
                        <h3>
                          <button type="button" onClick={() => setOpenFaq(open ? -1 : i)} id={`faq-btn-${i}`} aria-expanded={open} aria-controls={`faq-panel-${i}`} className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold sm:px-5 sm:text-[15px]">
                            {f.q}
                            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                              <Plus className="h-3.5 w-3.5" />
                            </motion.span>
                          </button>
                        </h3>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                              <p className="fe-muted px-4 pb-5 text-[13px] leading-relaxed sm:px-5 sm:text-sm">{f.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ─── FINAL CTA ─── */}
          <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <div className="fe-cta fe-noise-wrap relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-7 text-center sm:p-14 3xl:max-w-6xl">
                <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="fe-cta-glow absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" aria-hidden="true" />
                <div className="fe-noise absolute inset-0" aria-hidden="true" />
                <div className="relative mb-5 flex justify-center">
                  <FeatherLogoTile size="md" />
                </div>
                <h2 className="fe-h2 relative">Ready to get started?</h2>
                <p className="relative mx-auto mt-3 max-w-md text-sm opacity-75 sm:text-base">Message us on WhatsApp — tell us what you need and we&apos;ll take it from there.</p>
                <a href={waLink("Hello Feathered Experts! I want to get started.")} target="_blank" rel="noopener noreferrer" className="fe-btn fe-btn-cta relative mt-7 !min-h-11 !px-6">
                  <MessageCircle className="h-4 w-4" /> Start on WhatsApp
                </a>
              </div>
            </Reveal>
          </section>
        </main>

        <FeatherFooter onPickCategory={goCategory} />
        <BackToTop />

        {/* ─── FLOATING WHATSAPP ─── */}
        <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }} whileTap={{ scale: 0.92 }} className="fe-fab fe-fab-wa fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 sm:h-14 sm:w-14">
          <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
        </motion.a>

        {/* ─── WHATSAPP CHANNEL POPUP ─── */}
        <AnimatePresence>
          {showChannelPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={dismissChannelPopup}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fe-glass relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 text-center shadow-2xl sm:max-w-md sm:p-8"
              >
                <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20 blur-3xl pointer-events-none" />
                <button
                  onClick={dismissChannelPopup}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.15)]">
                  <FaWhatsapp className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Join Our Channel
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  Follow the <strong className="text-white">Feathered Experts</strong> WhatsApp channel for exclusive drops, private discounts, and AI setup guides.
                </p>
                <a
                  href={CONFIG.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissChannelPopup}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" /> Follow Channel
                </a>
                <button
                  onClick={dismissChannelPopup}
                  className="mt-4 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300"
                >
                  No thanks, continue browsing
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          :root, :root[data-theme="light"] {
            --bg: #ffffff;
            --surface: #ffffff;
            --surface-2: #f5f5f6;
            --fg: #0a0a0b;
            --muted: #55555e;
            --subtle: #6b6b75;
            --border: rgba(10,10,11,0.09);
            --border-strong: rgba(10,10,11,0.28);
            --hover: rgba(10,10,11,0.05);
            --accent: #0a0a0b;
            --accent-fg: #ffffff;
            --ring: #2563eb;
            --success: #047857;
            --shadow: 0 1px 2px rgba(10,10,11,0.04), 0 8px 24px rgba(10,10,11,0.04);
            --shadow-hover: 0 2px 4px rgba(10,10,11,0.04), 0 16px 40px rgba(10,10,11,0.09);
            --shadow-lg: 0 16px 48px rgba(10,10,11,0.14);
            --shadow-tilt: 0 24px 60px -12px rgba(10,10,11,0.22), 0 8px 24px rgba(10,10,11,0.08);
            --scrim: rgba(10,10,11,0.45);
            --grid-line: rgba(10,10,11,0.06);
            --blob-a: rgba(167,139,250,0.30);
            --blob-b: rgba(251,146,60,0.26);
            --blob-c: rgba(56,189,248,0.22);
            --glass-bg: color-mix(in srgb, var(--surface) 74%, transparent);
          }
          :root[data-theme="dark"] {
            --bg: #000000;
            --surface: #0a0a0a;
            --surface-2: #141414;
            --fg: #ffffff;
            --muted: #a1a1aa;
            --subtle: #8a8a94;
            --border: rgba(255,255,255,0.08);
            --border-strong: rgba(255,255,255,0.2);
            --hover: rgba(255,255,255,0.06);
            --accent: #ffffff;
            --accent-fg: #000000;
            --ring: #60a5fa;
            --success: #34d399;
            --shadow: 0 1px 3px rgba(0,0,0,0.2), 0 8px 24px -4px rgba(0,0,0,0.3);
            --shadow-hover: 0 4px 12px rgba(0,0,0,0.3), 0 24px 48px -8px rgba(0,0,0,0.5);
            --shadow-lg: 0 24px 64px rgba(0,0,0,0.6);
            --shadow-tilt: 0 32px 80px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), 0 0 44px -8px rgba(139,92,246,0.25);
            --scrim: rgba(0,0,0,0.7);
            --grid-line: rgba(255,255,255,0.04);
            --blob-a: rgba(139,92,246,0.12);
            --blob-b: rgba(249,115,22,0.09);
            --blob-c: rgba(56,189,248,0.10);
            --glass-bg: color-mix(in srgb, var(--surface) 68%, transparent);
          }

          html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
          html, body { overflow-x: clip; }
          .fe-theme-transition, .fe-theme-transition *, .fe-theme-transition *::before, .fe-theme-transition *::after {
            transition: background-color .25s ease, color .25s ease, border-color .25s ease, fill .25s ease !important;
          }

          .fe-root {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 15px;
            line-height: 1.55;
            letter-spacing: -0.01em;
            background: var(--bg);
            color: var(--fg);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            overflow-x: clip;
          }
          .fe-root ::selection { background: var(--accent); color: var(--accent-fg); }
          .fe-root :focus-visible {
            outline: 3px solid var(--ring);
            outline-offset: 3px;
            border-radius: 10px;
          }
          .fe-root img, .fe-root svg { max-width: 100%; }

          /* Refined scrollbar */
          .fe-root ::-webkit-scrollbar { width: 10px; height: 10px; }
          .fe-root ::-webkit-scrollbar-track { background: transparent; }
          .fe-root ::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--fg) 22%, transparent);
            border-radius: 8px;
            border: 2px solid var(--bg);
          }
          .fe-root ::-webkit-scrollbar-thumb:hover {
            background: color-mix(in srgb, var(--fg) 38%, transparent);
          }

          /* ── Fluid container: scales to 4K ── */
          .fe-wrap { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: clamp(1rem, 3vw, 2rem); }
          @media (min-width: 1536px) { .fe-wrap { max-width: 88rem; } }
          @media (min-width: 1920px) {
            .fe-root { font-size: 16.5px; }
            .fe-wrap { max-width: 112rem; padding-inline: clamp(2rem, 4vw, 4rem); }
          }
          @media (min-width: 2560px) {
            .fe-root { font-size: 18px; }
            .fe-wrap { max-width: 140rem; padding-inline: clamp(3rem, 5vw, 6rem); }
          }

          /* ── Fluid type ── */
          .fe-h1 {
            font-size: clamp(2.25rem, 1.15rem + 5.2vw, 4.75rem);
            line-height: 1.04;
            font-weight: 900;
            letter-spacing: -0.04em;
            text-wrap: balance;
          }
          @media (min-width: 2560px) {
            .fe-h1 { font-size: clamp(3.5rem, 2rem + 4vw, 6.5rem); }
          }
          .fe-h2 {
            font-size: clamp(1.625rem, 1.05rem + 2.4vw, 2.75rem);
            line-height: 1.08;
            font-weight: 900;
            letter-spacing: -0.03em;
            text-wrap: balance;
          }

          .fe-muted { color: var(--muted); }
          .fe-subtle { color: var(--subtle); }
          .fe-success { color: var(--success); }
          .fe-border { border: 1px solid var(--border-strong); }
          .fe-divider { height: 1px; background: var(--border); }
          .fe-divider-b { border-bottom: 1px solid var(--border); }
          .fe-divider-t { border-top: 1px solid var(--border); }
          .fe-divider-y { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
          .fe-band { background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
          .fe-noscroll { scrollbar-width: none; }
          .fe-noscroll::-webkit-scrollbar { display: none; }
          .fe-check { accent-color: var(--accent); }

          /* ── Glassmorphism utility ── */
          .fe-glass {
            background: var(--glass-bg);
            -webkit-backdrop-filter: blur(18px) saturate(160%);
            backdrop-filter: blur(18px) saturate(160%);
          }

          /* ── SVG film-grain noise (vector, resolution independent) ── */
          .fe-noise {
            pointer-events: none;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
            background-size: 180px 180px;
            opacity: 0.05;
            mix-blend-mode: overlay;
          }
          .fe-noise-wrap { isolation: isolate; }

          /* ── Hero canvas + fade ── */
          .fe-particles { display: block; }
          .fe-hero-fade {
            background:
              radial-gradient(ellipse 75% 65% at 50% 38%, transparent 35%, var(--bg) 100%),
              linear-gradient(to bottom, transparent 55%, var(--bg) 100%);
          }

          .fe-skip { position: absolute; left: 12px; top: -48px; z-index: 100; padding: 10px 16px; border-radius: 10px; background: var(--accent); color: var(--accent-fg); font-weight: 700; font-size: 14px; transition: top .15s; }
          .fe-skip:focus { top: 10px; }

          .fe-header { border-bottom: 1px solid transparent; padding-top: env(safe-area-inset-top); }
          .fe-header-on { border-bottom-color: var(--border); box-shadow: var(--shadow); }
          .fe-navlink { position: relative; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--muted); transition: color .2s, background-color .2s; }
          .fe-navlink:hover { color: var(--fg); background: var(--hover); }
          .fe-navlink-active { color: var(--fg); background: var(--hover); }

          .fe-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 1.5rem;
            box-shadow: var(--shadow);
          }
          .fe-card-hover { transition: transform .3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow .3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color .3s; }
          .fe-card-wrap { height: 100%; min-width: 0; }
          .fe-card-selected { border-color: var(--border-strong); box-shadow: var(--shadow-hover); }
          .fe-panel { background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); color: var(--fg); }
          .fe-scrim { background: var(--scrim); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
          .fe-step-num { background: var(--surface); color: var(--fg); border: 1px solid var(--border-strong); }
          .fe-drawer { height: 100vh; height: 100dvh; padding-bottom: env(safe-area-inset-bottom); }

          /* ── 3D tilt + cursor glare (driven by --rx/--ry/--mx/--my) ── */
          .fe-tilt {
            transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
            transition: transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease;
            transform-style: preserve-3d;
            will-change: transform;
          }
          .fe-tilt.is-tilting {
            transition: transform .08s linear, box-shadow .35s ease, border-color .35s ease;
            box-shadow: var(--shadow-tilt);
            border-color: var(--border-strong);
          }
          .fe-glare { position: relative; }
          .fe-glare::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            transition: opacity .35s ease;
            background: radial-gradient(560px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.13), transparent 62%);
          }
          .fe-tilt.is-tilting.fe-glare::after { opacity: 1; }

          @media (hover: hover) and (pointer: fine) {
            .fe-card-hover:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--border-strong); }
            .fe-spot::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), var(--hover), transparent 70%); }
            .fe-spot:hover::before { opacity: 1; }
          }

          /* ── Services grid: 1 → 2 → 3 → 4 columns, CSS containment ── */
          .fe-services-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: clamp(1rem, 2vw, 1.5rem);
            contain: layout style;
          }
          @media (min-width: 640px) {
            .fe-services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .fe-services-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (min-width: 1920px) {
            .fe-services-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(1.5rem, 1.6vw, 2.25rem); }
          }

          /* ── Feather logo tile (black tile, white feather) + shimmer ── */
          .fe-logo-tile {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #000000;
            border: 1px solid rgba(255,255,255,0.14);
            flex-shrink: 0;
          }
          .fe-logo-tile img { position: relative; z-index: 1; }
          .fe-logo-tile:not(.is-loaded) img { opacity: 0; }
          .fe-shimmer {
            position: absolute; inset: 0; overflow: hidden;
            background: rgba(255,255,255,0.06);
          }
          .fe-shimmer::after {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
            animation: feShimmerSweep 1.4s ease-in-out infinite;
          }
          .fe-logo-glow {
            background: radial-gradient(circle, rgba(139,92,246,0.35), rgba(56,189,248,0.18) 55%, transparent 75%);
            filter: blur(32px);
            border-radius: 999px;
          }
          .fe-float-shadow { box-shadow: 0 24px 60px -12px rgba(0,0,0,0.55), 0 0 44px -8px rgba(139,92,246,0.35); }

          .fe-fab { right: max(1.25rem, env(safe-area-inset-right)); }
          .fe-fab-wa { bottom: max(1.25rem, env(safe-area-inset-bottom)); }
          .fe-fab-top { bottom: calc(5.25rem + env(safe-area-inset-bottom)); background: var(--accent); color: var(--accent-fg); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); transition: transform .2s; }
          .fe-fab-top:hover { transform: scale(1.05); }
          .fe-fab-top:active { transform: scale(.95); }
          @media (min-width: 640px) { .fe-fab-top { bottom: calc(5.75rem + env(safe-area-inset-bottom)); } }

          .fe-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 2.75rem; padding: 0 1.25rem; border-radius: .75rem; font-size: .875rem; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer; transition: transform .15s ease, background-color .2s, color .2s, border-color .2s, box-shadow .2s, opacity .2s, filter .2s; }
          .fe-btn:active { transform: scale(.97); }
          .fe-btn:disabled { opacity: .55; cursor: not-allowed; }
          .fe-btn-primary { background: var(--accent); color: var(--accent-fg); box-shadow: 0 2px 8px rgba(0,0,0,.15); }
          .fe-btn-primary:hover { opacity: .9; box-shadow: 0 4px 16px rgba(0,0,0,.2); }
          .fe-btn-outline { background: transparent; color: var(--fg); border: 1px solid var(--border-strong); }
          .fe-btn-outline:hover { background: var(--hover); }
          .fe-btn-wa { background: #25D366; color: #052e14; box-shadow: 0 6px 20px rgba(37,211,102,.3); }
          .fe-btn-wa:hover { filter: brightness(1.05); box-shadow: 0 8px 28px rgba(37,211,102,.42); }
          .fe-btn-cta { background: var(--bg); color: var(--fg); }
          .fe-btn-cta:hover { opacity: .9; }

          .fe-icon-btn { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; flex-shrink: 0; border-radius: 999px; border: 1px solid var(--border-strong); background: transparent; color: var(--fg); cursor: pointer; transition: background-color .2s, color .2s, transform .15s; }
          @media (max-width: 359px) { .fe-icon-btn { height: 2.25rem; width: 2.25rem; } }
          .fe-icon-btn:hover { background: var(--hover); }
          .fe-icon-btn:active { transform: scale(.94); }

          .fe-chip { padding: 4px 10px; border-radius: 999px; background: var(--hover); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
          .fe-pill { display: inline-flex; align-items: center; gap: .5rem; padding: 6px 12px; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

          .fe-tab { white-space: nowrap; min-height: 2.5rem; padding: 0 1.25rem; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); background: var(--surface); border: 1px solid var(--border); cursor: pointer; transition: color .2s, border-color .2s, background-color .2s; box-shadow: var(--shadow); }
          .fe-tab:hover { color: var(--fg); border-color: var(--border-strong); }
          .fe-tab-active { color: var(--accent-fg); border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
          .fe-tab-active:hover { color: var(--accent-fg); }

          .fe-input { height: 2.5rem; border-radius: 999px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--fg); font-size: 16px; font-weight: 500; transition: border-color .2s, box-shadow .2s; box-shadow: var(--shadow); }
          @media (min-width: 768px) { .fe-input { font-size: 14px; } }
          .fe-input::placeholder { color: var(--subtle); }
          .fe-input:focus { outline: none; border-color: var(--fg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--fg) 15%, transparent); }
          .fe-input::-webkit-search-cancel-button { display: none; }

          .fe-spinner {
            display: inline-block;
            border-radius: 999px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            animation: feSpin 0.7s linear infinite;
          }

          .fe-social { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); transition: color .2s, border-color .2s, transform .2s, background-color .2s; box-shadow: var(--shadow); }
          .fe-social:hover, .fe-social:focus-visible { color: var(--brand); border-color: var(--brand); transform: translateY(-2px); }

          .fe-foot { background: var(--surface); border-top: 1px solid var(--border); }
          .fe-foot-bottom { background: var(--surface-2); }
          .fe-foot-link { display: inline-flex; align-items: center; min-height: 2.25rem; padding: 0 0; font-size: 14px; color: var(--muted); text-align: left; transition: color .2s; cursor: pointer; }
          .fe-foot-link:hover { color: var(--fg); }
          .fe-icon-chip { display: inline-flex; align-items: center; justify-content: center; height: 2rem; width: 2rem; flex-shrink: 0; margin-top: 2px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
          .fe-pay { display: inline-flex; align-items: center; gap: .4rem; height: 1.75rem; padding: 0 .75rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); color: var(--muted); font-size: 11px; font-weight: 600; }

          /* ── Ambient blobs (three, theme-tinted) ── */
          .fe-blob { position: absolute; border-radius: 999px; filter: blur(100px); pointer-events: none; }
          .fe-blob-a { left: -100px; top: 80px; width: 300px; height: 300px; background: var(--blob-a); animation: feFloatA 20s ease-in-out infinite; }
          .fe-blob-b { right: -100px; top: 160px; width: 350px; height: 350px; background: var(--blob-b); animation: feFloatB 24s ease-in-out infinite; }
          .fe-blob-c { left: 38%; bottom: -140px; width: 420px; height: 420px; background: var(--blob-c); animation: feFloatA 28s ease-in-out infinite reverse; }
          @media (min-width: 1920px) {
            .fe-blob-a { width: 480px; height: 480px; }
            .fe-blob-b { width: 560px; height: 560px; }
            .fe-blob-c { width: 640px; height: 640px; }
          }
          .fe-gradient-text { background: linear-gradient(90deg, var(--fg), color-mix(in srgb, var(--fg) 40%, transparent), var(--fg)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; animation: feShimmer 6s linear infinite; }

          .fe-marquee-wrap { background: var(--accent); color: var(--accent-fg); }
          .fe-marquee { animation: feMarquee 40s linear infinite; }

          .fe-cta { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-lg); }
          .fe-cta-glow { background: var(--accent-fg); }

          @keyframes feMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes feShimmer { to { background-position: 200% center; } }
          @keyframes feShimmerSweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
          @keyframes feSpin { to { transform: rotate(360deg); } }
          @keyframes feFloatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
          @keyframes feFloatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-40px,36px); } }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            .fe-marquee, .fe-blob, .fe-gradient-text, .fe-shimmer::after { animation: none !important; }
            .fe-tilt { transform: none !important; }
            .fe-root *, .fe-root *::before, .fe-root *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}










// import React, {
//   useState,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useCallback,
//   useRef,
//   useDeferredValue,
// } from "react";
// import { Link, useInRouterContext } from "react-router-dom";
// import {
//   Search,
//   ShoppingCart,
//   X,
//   Check,
//   Zap,
//   ShieldCheck,
//   Star,
//   ArrowRight,
//   ArrowUp,
//   ArrowUpRight,
//   MessageCircle,
//   Mail,
//   Clock,
//   Loader2,
//   AlertCircle,
//   CreditCard,
//   Headphones,
//   Play,
//   Monitor,
//   Cpu,
//   Layers,
//   Sparkles,
//   Menu,
//   Plus,
//   Minus,
//   Trash2,
//   Heart,
//   ChevronDown,
//   SlidersHorizontal,
//   MousePointerClick,
//   Send,
//   PackageCheck,
//   Sun,
//   Moon,
//   Landmark,
//   Smartphone,
//   Bitcoin,
//   Tag,
// } from "lucide-react";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
//   FaYoutube,
//   FaTiktok,
//   FaXTwitter,
//   FaWhatsapp,
// } from "react-icons/fa6";
// import {
//   SiGooglegemini,
//   SiYoutube,
//   SiCursor,
//   SiElevenlabs,
//   SiAnthropic,
// } from "react-icons/si";
// import {
//   motion,
//   AnimatePresence,
//   MotionConfig,
//   useScroll,
//   useSpring,
//   useInView,
//   animate,
//   LayoutGroup,
// } from "framer-motion";

// /* ════════════════════════════════════════════════════════════
//    LOGO IMPORT
//    ════════════════════════════════════════════════════════════ */
// import logoImage from "../assets/logo2.jpeg";

// /* ════════════════════════════════════════════════════════════
//    CONFIGURATION & CONSTANTS
//    ════════════════════════════════════════════════════════════ */
// const CONFIG = {
//   brandName: "SMARTSTREAM",
//   whatsappNumber: "923716837122",
//   whatsappDisplay: "+92 371 6837122",
//   currency: "$",
//   supportEmail: "smartstreamsoftware@gmail.com",
//   termsUrl: "/terms",
//   privacyUrl: "/privacy",
//   channelUrl: "https://whatsapp.com/channel/0029VbE66le8fewoR2Y8ZF2y",
// };

// const THEME_KEY = "ss-theme";
// const CART_KEY = "ss-cart";
// const WISH_KEY = "ss-wishlist";
// const POPUP_KEY = "ss-channel-popup-dismissed"; // Key for the popup
// const MAX_QTY = 10;

// /* Custom Midjourney SVG Icon */
// const MidjourneyIcon = (props) => (
//   <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
//     <path d="M22.36 19.06H1.64a.45.45 0 0 1-.39-.68l.83-1.42a.45.45 0 0 1 .78 0l.56.95h17.16l.56-.95a.45.45 0 0 1 .78 0l.83 1.42a.45.45 0 0 1-.39.68Z"/>
//     <path d="M18.15 11.28 12 2.06 5.85 11.28a.45.45 0 0 0 .37.7h11.56a.45.45 0 0 0 .37-.7Zm-6.15-6.4 3.8 5.68H8.2L12 4.88Z"/>
//   </svg>
// );

// const TOOLS = [
//   {
//     id: "gemini-pro",
//     name: "Gemini Advanced (Pro)",
//     category: "AI Chat",
//     duration: "1 Month",
//     rating: 4.9,
//     reviews: 1240,
//     icon: SiGooglegemini,
//     hue: "#3b82f6",
//     badge: "HOT",
//     desc: "Unlock Google's most capable AI model. Includes 2TB of Google One storage and integration with Gmail, Docs, and more.",
//     features: ["Gemini 1.5 Pro Access", "2TB Cloud Storage", "Google Workspace Integration", "Priority Support"],
//   },
//   {
//     id: "youtube-premium",
//     name: "YouTube Premium",
//     category: "Entertainment",
//     duration: "1 Month",
//     rating: 4.8,
//     reviews: 3890,
//     icon: SiYoutube,
//     hue: "#ef4444",
//     badge: "POPULAR",
//     desc: "Ad-free YouTube, YouTube Music Premium, offline downloads, and background play on all your devices.",
//     features: ["Ad-free Video", "YouTube Music Premium", "Background Play", "Offline Downloads"],
//   },
//   {
//     id: "cursor-pro",
//     name: "Cursor AI Pro",
//     category: "Coding",
//     duration: "1 Month",
//     rating: 5.0,
//     reviews: 850,
//     icon: SiCursor,
//     hue: "#10b981",
//     badge: "DEV FAV",
//     desc: "The AI-first code editor. Built for pair programming with an AI that deeply understands your codebase.",
//     features: ["Unlimited AI Completions", "Claude 3.5 Sonnet Access", "GPT-4o Access", "Multi-file Edits"],
//   },
//   {
//     id: "midjourney",
//     name: "Midjourney Basic",
//     category: "Image Gen",
//     duration: "1 Month",
//     rating: 4.9,
//     reviews: 2100,
//     icon: MidjourneyIcon,
//     hue: "#d946ef",
//     badge: "",
//     desc: "Generate stunning, high-resolution images from simple text prompts using one of the best AI image models.",
//     features: ["~200 Generations/Month", "Standard Resolution", "Web App Access", "Commercial Use"],
//   },
//   {
//     id: "elevenlabs",
//     name: "ElevenLabs Creator",
//     category: "Audio & Voice",
//     duration: "1 Month",
//     rating: 4.8,
//     reviews: 940,
//     icon: SiElevenlabs,
//     hue: "#f59e0b",
//     badge: "NEW",
//     desc: "A realistic AI text-to-speech engine. Clone your voice or use thousands of studio-quality voices.",
//     features: ["100k Characters/Month", "Voice Cloning", "Commercial License", "29 Languages"],
//   },
//   {
//     id: "claude-pro",
//     name: "Claude Pro",
//     category: "AI Chat",
//     duration: "1 Month",
//     rating: 4.9,
//     reviews: 1670,
//     icon: SiAnthropic,
//     hue: "#f97316",
//     badge: "",
//     desc: "Anthropic's Claude. Exceptional at coding, reasoning, and analyzing massive documents.",
//     features: ["Latest Claude models", "5x more usage", "Priority access", "Early features"],
//   },
// ];

// const CATEGORIES = ["All", "AI Chat", "Coding", "Image Gen", "Audio & Voice", "Entertainment"];

// const SORTS = [
//   { id: "featured", label: "Featured" },
//   { id: "rating", label: "Top Rated" },
// ];

// const STEPS = [
//   { icon: MousePointerClick, title: "Pick your tool", desc: "Browse the store and add what you need to your cart." },
//   { icon: Send, title: "Order on WhatsApp", desc: "One tap sends your order to our team with all details filled in." },
//   { icon: CreditCard, title: "Negotiate & Pay", desc: "Discuss price, then pay via Bank transfer, Easypaisa, JazzCash, or crypto." },
//   { icon: PackageCheck, title: "Get activated", desc: "Receive your access details and setup help right in chat." },
// ];

// const FEATURES = [
//   { icon: Zap, title: "Fast Delivery", desc: "Get your activation details right in WhatsApp after payment." },
//   { icon: ShieldCheck, title: "Warranty Cover", desc: "Covered for the duration of your subscription, with replacement if something breaks." },
//   { icon: CreditCard, title: "Local Payments", desc: "Pay via bank transfer, Easypaisa, JazzCash, or crypto." },
//   { icon: Headphones, title: "24/7 Support", desc: "Our team is on WhatsApp to help you get set up." },
// ];

// const FAQS = [
//   { q: "How does delivery work?", a: "After you confirm payment on WhatsApp, we send your activation details in the same chat. Most orders are completed within minutes." },
//   { q: "How is the price decided?", a: "We offer the best market rates. Add items to your cart, click checkout, and our team will give you a final quote on WhatsApp based on your selected duration and bundle." },
//   { q: "Which payment methods do you accept?", a: "Local bank transfer, Easypaisa, JazzCash, and crypto. Our team shares the details once you place your order." },
//   { q: "What if something stops working?", a: "Message us on WhatsApp any time during your subscription period and we'll fix it or replace it." },
//   { q: "Can I renew when my month ends?", a: "Absolutely. Message us before expiry and we'll renew with the same setup." },
// ];

// const PAYMENTS = [
//   { icon: Landmark, label: "Bank Transfer" },
//   { icon: Smartphone, label: "Easypaisa" },
//   { icon: Smartphone, label: "JazzCash" },
//   { icon: Bitcoin, label: "Crypto" },
// ];

// const NAV_LINKS = [
//   { id: "tools", href: "#tools", label: "Store" },
//   { id: "how", href: "#how", label: "How it works" },
//   { id: "features", href: "#features", label: "Why us" },
//   { id: "faq", href: "#faq", label: "FAQ" },
// ];

// const waLink = (text) =>
//   `https://wa.me/${CONFIG.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
// const openWhatsApp = (text) => window.open(waLink(text), "_blank", "noopener,noreferrer");

// const SOCIALS = [
//   { id: "whatsapp", label: "WhatsApp Support", url: waLink(), Icon: FaWhatsapp, brand: "#25D366" },
//   { id: "youtube", label: "YouTube", url: "http://www.youtube.com/@SmartSteamAutomation", Icon: FaYoutube, brand: "#FF0000" },
//   { id: "instagram", label: "Instagram", url: "https://www.instagram.com/smartstreamsoftwaretools", Icon: FaInstagram, brand: "#E4405F" },
//   { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@smart.steam.autom", Icon: FaTiktok, brand: "#ffffff" },
//   { id: "x", label: "X (Twitter)", url: "https://x.com/SmartSteamX", Icon: FaXTwitter, brand: "#ffffff" },
//   { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-mubashir-483b6b392", Icon: FaLinkedinIn, brand: "#0A66C2" },
// ];

// const tint = (hue) => ({ color: hue, background: `color-mix(in srgb, ${hue} 14%, transparent)` });

// /* ════════════════════════════════════════════════════════════
//    HOOKS
//    ════════════════════════════════════════════════════════════ */
// const loadJSON = (key, fallback) => {
//   try {
//     const v = JSON.parse(localStorage.getItem(key));
//     return v ?? fallback;
//   } catch {
//     return fallback;
//   }
// };
// const saveJSON = (key, value) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch {
//     /* storage unavailable */
//   }
// };

// function getInitialTheme() {
//   if (typeof document === "undefined") return "dark";
//   const attr = document.documentElement.dataset.theme;
//   if (attr === "light" || attr === "dark") return attr;
//   try {
//     const s = localStorage.getItem(THEME_KEY);
//     if (s === "light" || s === "dark") return s;
//   } catch {
//     /* ignore */
//   }
//   return "dark";
// }

// function useTheme() {
//   const [theme, setTheme] = useState(getInitialTheme);

//   useLayoutEffect(() => {
//     document.documentElement.dataset.theme = theme;
//     document.documentElement.style.colorScheme = theme;
//   }, [theme]);

//   const toggle = useCallback(() => {
//     const root = document.documentElement;
//     root.classList.add("ss-theme-transition");
//     window.setTimeout(() => root.classList.remove("ss-theme-transition"), 300);
//     setTheme((t) => {
//       const next = t === "dark" ? "light" : "dark";
//       try {
//         localStorage.setItem(THEME_KEY, next);
//       } catch {
//         /* ignore */
//       }
//       return next;
//     });
//   }, []);

//   return [theme, toggle];
// }

// function useLockBody(locked) {
//   useEffect(() => {
//     if (!locked) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [locked]);
// }

// function useEscape(handler, active) {
//   useEffect(() => {
//     if (!active) return;
//     const onKey = (e) => e.key === "Escape" && handler();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handler, active]);
// }

// function useFocusTrap(active) {
//   const ref = useRef(null);
//   useEffect(() => {
//     if (!active) return;
//     const node = ref.current;
//     if (!node) return;
//     const prev = document.activeElement;
//     const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
//     const focusables = () => [...node.querySelectorAll(sel)].filter((el) => el.offsetParent !== null);
//     const t = setTimeout(() => (focusables()[0] || node).focus(), 60);
//     const onKey = (e) => {
//       if (e.key !== "Tab") return;
//       const f = focusables();
//       if (!f.length) return e.preventDefault();
//       const first = f[0];
//       const last = f[f.length - 1];
//       if (e.shiftKey && document.activeElement === first) {
//         e.preventDefault();
//         last.focus();
//       } else if (!e.shiftKey && document.activeElement === last) {
//         e.preventDefault();
//         first.focus();
//       }
//     };
//     node.addEventListener("keydown", onKey);
//     return () => {
//       clearTimeout(t);
//       node.removeEventListener("keydown", onKey);
//       if (prev && prev.focus) prev.focus();
//     };
//   }, [active]);
//   return ref;
// }

// function useScrollSpy(ids) {
//   const [active, setActive] = useState("");
//   useEffect(() => {
//     if (typeof IntersectionObserver === "undefined") return;
//     const obs = new IntersectionObserver(
//       (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
//       { rootMargin: "-40% 0px -55% 0px" }
//     );
//     ids.forEach((id) => {
//       const el = document.getElementById(id);
//       if (el) obs.observe(el);
//     });
//     return () => obs.disconnect();
//   }, []);
//   return active;
// }

// /* ── NEW: prefers-reduced-motion as a reactive hook ── */
// function usePrefersReducedMotion() {
//   const [reduced, setReduced] = useState(() =>
//     typeof window !== "undefined" && window.matchMedia
//       ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
//       : false
//   );
//   useEffect(() => {
//     if (!window.matchMedia) return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const onChange = (e) => setReduced(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);
//   return reduced;
// }

// /* ── NEW: pointer-driven 3D tilt + glare for cards ──
//    Sets --rx/--ry/--mx/--my custom properties on the element.
//    Skips touch devices and reduced-motion users. Uses rAF to
//    avoid layout thrash on rapid pointermove events. */
// function useTilt(ref, enabled) {
//   useEffect(() => {
//     const el = ref.current;
//     if (!el || !enabled) return;
//     if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;
//     let raf = 0;
//     const onMove = (e) => {
//       const r = el.getBoundingClientRect();
//       if (r.width === 0) return;
//       const px = (e.clientX - r.left) / r.width;
//       const py = (e.clientY - r.top) / r.height;
//       cancelAnimationFrame(raf);
//       raf = requestAnimationFrame(() => {
//         el.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
//         el.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
//         el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
//         el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
//         el.classList.add("is-tilting");
//       });
//     };
//     const onLeave = () => {
//       cancelAnimationFrame(raf);
//       el.classList.remove("is-tilting");
//       el.style.setProperty("--rx", "0deg");
//       el.style.setProperty("--ry", "0deg");
//     };
//     el.addEventListener("pointermove", onMove, { passive: true });
//     el.addEventListener("pointerleave", onLeave, { passive: true });
//     return () => {
//       cancelAnimationFrame(raf);
//       el.removeEventListener("pointermove", onMove);
//       el.removeEventListener("pointerleave", onLeave);
//     };
//   }, [ref, enabled]);
// }

// /* ════════════════════════════════════════════════════════════
//    SMALL COMPONENTS
//    ════════════════════════════════════════════════════════════ */
// const SmartLink = ({ to, children, ...props }) => {
//   const inRouter = useInRouterContext();
//   return inRouter ? (
//     <Link to={to} {...props}>{children}</Link>
//   ) : (
//     <a href={to} {...props}>{children}</a>
//   );
// };

// /* Brand logo with a shimmer placeholder while the raster logo loads,
//    so first paint never shows a broken/empty box on slow networks. */
// const BrandLogo = React.memo(function BrandLogo({ className = "" }) {
//   const [loaded, setLoaded] = useState(false);
//   return (
//     <a
//       href="#top"
//       aria-label={`${CONFIG.brandName} home`}
//       className={`flex items-center gap-2.5 rounded-lg group ${className}`}
//     >
//       <span className={`ss-logo-frame ${loaded ? "is-loaded" : ""}`}>
//         {!loaded && <span className="ss-shimmer" aria-hidden="true" />}
//         <img
//           src={logoImage}
//           alt={`${CONFIG.brandName} Logo`}
//           onLoad={() => setLoaded(true)}
//           className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9"
//         />
//       </span>
//       <span className="hidden text-[15px] font-extrabold tracking-tight sm:block">
//         {CONFIG.brandName}
//       </span>
//     </a>
//   );
// });

// function ThemeToggle({ theme, onToggle }) {
//   const isDark = theme === "dark";
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       role="switch"
//       aria-checked={isDark}
//       aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
//       className="ss-icon-btn"
//     >
//       <AnimatePresence mode="wait" initial={false}>
//         <motion.span
//           key={theme}
//           initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
//           animate={{ opacity: 1, rotate: 0, scale: 1 }}
//           exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
//           transition={{ duration: 0.2 }}
//           className="flex"
//         >
//           {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//         </motion.span>
//       </AnimatePresence>
//     </button>
//   );
// }

// function Counter({ to, decimals = 0, suffix = "" }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: "-40px" });
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     if (!inView) return;
//     const controls = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: setVal });
//     return () => controls.stop();
//   }, [inView, to]);
//   return (
//     <span ref={ref}>
//       {val.toFixed(decimals)}
//       {suffix}
//     </span>
//   );
// }

// const Reveal = React.memo(function Reveal({ children, delay = 0, className = "" }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 18 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-50px" }}
//       transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
//       className={className}
//     >
//       {children}
//     </motion.div>
//   );
// });

// const SectionHead = React.memo(function SectionHead({ eyebrow, title, sub, center = false }) {
//   return (
//     <Reveal className={`mb-8 max-w-2xl sm:mb-12 ${center ? "mx-auto text-center" : ""}`}>
//       <p className="ss-subtle mb-2 text-[11px] font-bold uppercase tracking-[0.14em]">{eyebrow}</p>
//       <h2 className="ss-h2">{title}</h2>
//       {sub && <p className="ss-muted mt-3 text-sm leading-relaxed sm:text-[15px]">{sub}</p>}
//     </Reveal>
//   );
// });

// const Stars = React.memo(function Stars({ rating }) {
//   return (
//     <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
//       <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
//       <span className="sr-only">Rated </span>
//       {rating.toFixed(1)}
//     </span>
//   );
// });

// /* ════════════════════════════════════════════════════════════
//    PARTICLE FIELD — HD canvas hero background
//    ────────────────────────────────────────────────────────────
//    DevicePixelRatio-aware canvas rendering an animated dot-grid
//    + particle network. Respects prefers-reduced-motion (renders one
//    static frame), pauses when the tab is hidden, and fully cleans
//    up listeners/animation frames on unmount or theme change.
//    Pure vector rendering: razor sharp on Retina / 4K displays.
//    ════════════════════════════════════════════════════════════ */
// const ParticleField = React.memo(function ParticleField({ theme, className = "" }) {
//   const canvasRef = useRef(null);
//   const reduceMotion = usePrefersReducedMotion();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let raf = 0;
//     let w = 0;
//     let h = 0;
//     let parts = [];
//     const DPR = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf
//     const isDark = theme !== "light";

//     // Theme-aware palette, cached per init (no per-frame style reads)
//     const palette = isDark
//       ? { dot: "rgba(148,163,184,0.55)", link: [148, 163, 184], grid: "rgba(148,163,184,0.07)" }
//       : { dot: "rgba(15,23,42,0.35)", link: [15, 23, 42], grid: "rgba(15,23,42,0.06)" };

//     const resize = () => {
//       const rect = canvas.getBoundingClientRect();
//       w = Math.max(1, rect.width);
//       h = Math.max(1, rect.height);
//       canvas.width = Math.round(w * DPR);
//       canvas.height = Math.round(h * DPR);
//       ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
//       seed();
//     };

//     const seed = () => {
//       const count = Math.max(24, Math.min(110, Math.floor((w * h) / 20000)));
//       parts = Array.from({ length: count }, () => ({
//         x: Math.random() * w,
//         y: Math.random() * h,
//         vx: (Math.random() - 0.5) * 0.35,
//         vy: (Math.random() - 0.5) * 0.35,
//         r: Math.random() * 1.7 + 0.5,
//       }));
//     };

//     const drawGrid = () => {
//       const gap = 54;
//       ctx.strokeStyle = palette.grid;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       for (let x = 0.5; x <= w; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
//       for (let y = 0.5; y <= h; y += gap) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
//       ctx.stroke();
//     };

//     const step = () => {
//       ctx.clearRect(0, 0, w, h);
//       drawGrid();
//       const maxD = 130;
//       const maxD2 = maxD * maxD;
//       ctx.lineWidth = 1;
//       for (let i = 0; i < parts.length; i++) {
//         const a = parts[i];
//         for (let j = i + 1; j < parts.length; j++) {
//           const b = parts[j];
//           const dx = a.x - b.x;
//           const dy = a.y - b.y;
//           const d2 = dx * dx + dy * dy;
//           if (d2 < maxD2) {
//             const alpha = ((1 - Math.sqrt(d2) / maxD) * 0.20).toFixed(3);
//             ctx.strokeStyle = `rgba(${palette.link[0]},${palette.link[1]},${palette.link[2]},${alpha})`;
//             ctx.beginPath();
//             ctx.moveTo(a.x, a.y);
//             ctx.lineTo(b.x, b.y);
//             ctx.stroke();
//           }
//         }
//       }
//       ctx.fillStyle = palette.dot;
//       for (const p of parts) {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fill();
//         if (!reduceMotion) {
//           p.x += p.vx;
//           p.y += p.vy;
//           if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
//           if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
//         }
//       }
//       if (!reduceMotion) raf = requestAnimationFrame(step);
//     };

//     resize();
//     step(); // draws at least one frame (static when reduced motion)

//     let resizeTimer = 0;
//     const onResize = () => {
//       window.clearTimeout(resizeTimer);
//       resizeTimer = window.setTimeout(resize, 150); // debounce: no layout thrash
//     };
//     const onVis = () => {
//       if (document.hidden) {
//         cancelAnimationFrame(raf);
//       } else if (!reduceMotion) {
//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(step);
//       }
//     };
//     window.addEventListener("resize", onResize, { passive: true });
//     document.addEventListener("visibilitychange", onVis);
//     return () => {
//       cancelAnimationFrame(raf);
//       window.clearTimeout(resizeTimer);
//       window.removeEventListener("resize", onResize);
//       document.removeEventListener("visibilitychange", onVis);
//     };
//   }, [theme, reduceMotion]);

//   return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
// });

// /* ════════════════════════════════════════════════════════════
//    PRODUCT CARD — now memoized + 3D tilt/glare
//    The outer motion.article keeps layout animations; the inner
//    div owns the pointer-driven tilt so framer's transform never
//    fights the CSS custom-property transform.
//    ════════════════════════════════════════════════════════════ */
// const ProductCard = React.memo(function ProductCard({ tool, idx, onOpen, onAdd, inCart, liked, onLike, tiltEnabled }) {
//   const tiltRef = useRef(null);
//   useTilt(tiltRef, tiltEnabled);

//   return (
//     <motion.article
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.96 }}
//       transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
//       className="ss-card-wrap"
//     >
//       <div
//         ref={tiltRef}
//         className="ss-card ss-tilt ss-glare ss-spot group relative flex h-full flex-col overflow-hidden p-5 sm:p-6"
//       >
//         <div className="relative flex items-start justify-between gap-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={tint(tool.hue)}>
//               <tool.icon className="h-5 w-5" aria-hidden="true" />
//             </span>
//             <div className="min-w-0">
//               <p className="ss-subtle text-[10px] font-bold uppercase tracking-[0.14em]">{tool.category}</p>
//               <h3 className="truncate text-base font-bold tracking-tight">{tool.name}</h3>
//             </div>
//           </div>
//           <div className="flex shrink-0 items-center gap-1.5">
//             {tool.badge && <span className="ss-chip hidden min-[400px]:inline-block">{tool.badge}</span>}
//             <button
//               type="button"
//               onClick={() => onLike(tool.id)}
//               aria-label={liked ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
//               aria-pressed={liked}
//               className="ss-icon-btn !h-9 !w-9"
//             >
//               <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`} />
//             </button>
//           </div>
//         </div>

//         <p className="ss-muted relative mt-4 line-clamp-2 text-[13px] leading-relaxed">{tool.desc}</p>

//         <ul className="relative mt-4 space-y-2">
//           {tool.features.slice(0, 3).map((feat) => (
//             <li key={feat} className="flex items-center gap-2.5 text-[13px] font-medium">
//               <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-black">
//                 <Check className="h-2.5 w-2.5" aria-hidden="true" />
//               </span>
//               {feat}
//             </li>
//           ))}
//         </ul>

//         <div className="relative mt-auto pt-5">
//           <div className="ss-divider mb-4" />
//           <div className="mb-4 flex items-end justify-between gap-3">
//             <div>
//               <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-500">
//                 <Tag className="h-3.5 w-3.5" />
//                 Price on Request
//               </div>
//               <p className="ss-subtle mt-1 text-[11px]">Negotiate via WhatsApp</p>
//             </div>
//             <div className="text-right">
//               <Stars rating={tool.rating} />
//               <p className="ss-subtle text-[11px]">{tool.reviews.toLocaleString()} reviews</p>
//             </div>
//           </div>
//           <div className="flex gap-2.5">
//             <button type="button" onClick={() => onOpen(tool)} className="ss-btn ss-btn-outline flex-1">
//               Details
//             </button>
//             <button type="button" onClick={() => onAdd(tool)} className="ss-btn ss-btn-primary flex-[1.4]">
//               <AnimatePresence mode="wait" initial={false}>
//                 {inCart ? (
//                   <motion.span key="in" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
//                     <Check className="h-4 w-4" /> Added
//                   </motion.span>
//                 ) : (
//                   <motion.span key="add" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
//                     <ShoppingCart className="h-4 w-4" /> Add
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.article>
//   );
// });

// function SocialLinks({ className = "" }) {
//   return (
//     <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Social media">
//       {SOCIALS.map(({ id, label, url, Icon, brand }) => (
//         <li key={id}>
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label={label}
//             title={label}
//             className="ss-social"
//             style={{ "--brand": brand }}
//           >
//             <Icon className="h-4 w-4" aria-hidden="true" />
//           </a>
//         </li>
//       ))}
//     </ul>
//   );
// }

// /* ════════════════════════════════════════════════════════════
//    FOOTER COMPONENTS
//    ════════════════════════════════════════════════════════════ */
// const BackToTop = React.memo(function BackToTop() {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     let ticking = false;
//     const onScroll = () => {
//       if (ticking) return;
//       ticking = true;
//       window.requestAnimationFrame(() => {
//         setVisible(window.scrollY > 600);
//         ticking = false;
//       });
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.button
//           type="button"
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           aria-label="Back to top"
//           initial={{ opacity: 0, y: 16, scale: 0.9 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: 16, scale: 0.9 }}
//           transition={{ duration: 0.2 }}
//           className="ss-fab ss-fab-top fixed z-40 inline-flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
//         >
//           <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
//         </motion.button>
//       )}
//     </AnimatePresence>
//   );
// });

// const UpdatesForm = React.memo(function UpdatesForm() {
//   const [email, setEmail] = useState("");
//   const [agree, setAgree] = useState(false);
//   const [status, setStatus] = useState("idle");
//   const [message, setMessage] = useState("");
//   const timerRef = useRef(null);

//   useEffect(() => () => clearTimeout(timerRef.current), []);

//   const clearError = () => {
//     if (status === "error") {
//       setStatus("idle");
//       setMessage("");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (status === "loading") return;
//     const trimmed = email.trim();
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
//       setStatus("error");
//       setMessage("Please enter a valid email address.");
//       return;
//     }
//     if (!agree) {
//       setStatus("error");
//       setMessage("Please confirm you agree to receive updates.");
//       return;
//     }
//     setStatus("loading");
//     setMessage("");
//     timerRef.current = setTimeout(() => {
//       openWhatsApp(`Hello SmartStream! Please add ${trimmed} to your offers and updates list.`);
//       setStatus("success");
//       setMessage("Opening WhatsApp — send the message to finish.");
//       setEmail("");
//       setAgree(false);
//       timerRef.current = setTimeout(() => {
//         setStatus("idle");
//         setMessage("");
//       }, 5000);
//     }, 400);
//   };

//   const isLoading = status === "loading";

//   return (
//     <form onSubmit={handleSubmit} className="w-full space-y-3" noValidate>
//       <div className="relative">
//         <Mail className="ss-subtle pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2" aria-hidden="true" />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//             clearError();
//           }}
//           placeholder="your@email.com"
//           autoComplete="email"
//           inputMode="email"
//           aria-label="Email address"
//           aria-invalid={status === "error"}
//           aria-describedby="updates-msg"
//           disabled={isLoading}
//           className="ss-input !h-12 w-full pl-10 pr-28 disabled:opacity-60 sm:pr-32"
//         />
//         <button type="submit" disabled={isLoading} className="ss-btn ss-btn-primary absolute right-1.5 top-1/2 !min-h-9 -translate-y-1/2 !rounded-full !px-3.5 !text-xs sm:!px-4">
//           {isLoading ? (
//             <>
//               <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
//               <span className="hidden sm:inline">Joining…</span>
//             </>
//           ) : (
//             <>
//               Subscribe <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
//             </>
//           )}
//         </button>
//       </div>

//       <label className="ss-muted flex cursor-pointer select-none items-start gap-2.5 text-[12px] leading-snug">
//         <input
//           type="checkbox"
//           checked={agree}
//           onChange={(e) => {
//             setAgree(e.target.checked);
//             clearError();
//           }}
//           className="ss-check mt-0.5 h-4 w-4 shrink-0"
//         />
//         <span>
//           I agree to receive offers and updates from SmartStream
//           {CONFIG.privacyUrl && (
//             <>
//               {" "}and accept the{" "}
//               <SmartLink to={CONFIG.privacyUrl} className="underline underline-offset-2">privacy policy</SmartLink>
//             </>
//           )}
//           .
//         </span>
//       </label>

//       <div id="updates-msg" aria-live="polite" className="min-h-[1.25rem]">
//         <AnimatePresence mode="wait">
//           {message && (
//             <motion.p
//               key={message}
//               initial={{ opacity: 0, y: -4 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -4 }}
//               transition={{ duration: 0.18 }}
//               className={`flex items-center gap-1.5 text-xs font-medium ${status === "success" ? "ss-success" : "text-red-500"}`}
//               role={status === "error" ? "alert" : "status"}
//             >
//               {status === "success" ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
//               {message}
//             </motion.p>
//           )}
//         </AnimatePresence>
//       </div>
//     </form>
//   );
// });

// const SmartStreamFooter = React.memo(function SmartStreamFooter({ onPickCategory }) {
//   const year = useMemo(() => new Date().getFullYear(), []);
//   const legal = [
//     { label: "Privacy", href: CONFIG.privacyUrl },
//     { label: "Terms", href: CONFIG.termsUrl },
//   ];

//   return (
//     <footer className="ss-foot mt-8 w-full sm:mt-12">
//       <div className="ss-divider-b">
//         <div className="ss-wrap py-10 sm:py-14">
//           <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
//             <div>
//               <h2 className="ss-h2">Join the SmartStream list.</h2>
//               <p className="ss-muted mt-3 max-w-md text-sm sm:text-base">
//                 Get early access to new tools and setup guides. We'll add you to our updates list on WhatsApp.
//               </p>
//             </div>
//             <div className="w-full max-w-md lg:ml-auto">
//               <UpdatesForm />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="ss-wrap py-10 sm:py-14">
//         <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
//           <div className="space-y-5 sm:col-span-2 lg:col-span-4">
//             <BrandLogo />
//             <p className="ss-muted max-w-sm text-sm leading-relaxed">
//               Premium access to popular AI tools at clear prices. Delivery via WhatsApp, 24/7 support, and warranty cover for your subscription period.
//             </p>
//             <SocialLinks />
//           </div>

//           <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-4 lg:gap-6 sm:grid-cols-3">
//             <div>
//               <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Store</h3>
//               <ul className="space-y-1">
//                 {["All", "AI Chat", "Coding", "Image Gen"].map((c) => (
//                   <li key={c}>
//                     <button type="button" onClick={() => onPickCategory(c)} className="ss-foot-link">
//                       {c === "All" ? "All Tools" : c}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Help</h3>
//               <ul className="space-y-1">
//                 <li><a href="#how" className="ss-foot-link">How it works</a></li>
//                 <li><a href="#faq" className="ss-foot-link">FAQ</a></li>
//                 <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-foot-link">Contact Support</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Legal</h3>
//               <ul className="space-y-1">
//                 {legal.map((l) => (
//                   <li key={l.label}><SmartLink to={l.href} className="ss-foot-link">{l.label}</SmartLink></li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="space-y-4 sm:col-span-2 lg:col-span-4">
//             <h3 className="text-[11px] font-bold uppercase tracking-[0.15em]">Get in touch</h3>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-3">
//                 <span className="ss-icon-chip"><MessageCircle className="h-3.5 w-3.5" /></span>
//                 <div className="min-w-0">
//                   <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">WhatsApp</p>
//                   <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-foot-link !px-0 break-words text-sm !text-[var(--fg)]">
//                     {CONFIG.whatsappDisplay}
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="ss-icon-chip"><Mail className="h-3.5 w-3.5" /></span>
//                 <div className="min-w-0">
//                   <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Email</p>
//                   <a href={`mailto:${CONFIG.supportEmail}`} className="ss-foot-link !px-0 break-all text-sm !text-[var(--fg)]">
//                     {CONFIG.supportEmail}
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="ss-icon-chip"><Clock className="h-3.5 w-3.5" /></span>
//                 <div className="min-w-0">
//                   <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Hours</p>
//                   <p className="text-sm">24/7 Support</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="ss-icon-chip bg-[#25D366]/10 text-[#25D366]"><MessageCircle className="h-3.5 w-3.5" /></span>
//                 <div className="min-w-0">
//                   <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Channel</p>
//                   <a href={CONFIG.channelUrl} target="_blank" rel="noopener noreferrer" className="ss-foot-link !px-0 break-words text-sm !text-[#25D366] hover:underline">
//                     Follow our Channel
//                   </a>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="ss-divider-t">
//         <div className="ss-wrap py-6">
//           <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4 sm:gap-6">
//             {[
//               { title: "Instant Delivery", subtitle: "Via WhatsApp" },
//               { title: "Warranty Cover", subtitle: "Replacement if it breaks" },
//               { title: "Local Payments", subtitle: "Bank, Easypaisa, JazzCash, Crypto" },
//               { title: "24/7 Support", subtitle: "We're on WhatsApp" },
//             ].map((b) => (
//               <li key={b.title} className="flex items-start gap-3">
//                 <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
//                   <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
//                 </span>
//                 <div className="min-w-0">
//                   <p className="text-xs font-semibold text-white">{b.title}</p>
//                   <p className="ss-subtle text-[11px]">{b.subtitle}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="ss-divider-t ss-foot-bottom">
//         <div className="ss-wrap flex flex-col items-center justify-between gap-4 py-5 lg:flex-row">
//           <p className="ss-subtle text-center text-[11px]">© {year} {CONFIG.brandName}. All rights reserved.</p>
//           <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
//             {PAYMENTS.map(({ icon: Icon, label }) => (
//               <li key={label} className="ss-pay">
//                 <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </footer>
//   );
// });

// /* ════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ════════════════════════════════════════════════════════════ */
// export default function SmartStreamStore() {
//   const [theme, toggleTheme] = useTheme();
//   const reduceMotion = usePrefersReducedMotion();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const deferredQuery = useDeferredValue(searchQuery); // keep typing silky while filtering defers
//   const [sortBy, setSortBy] = useState("featured");
//   const [sortOpen, setSortOpen] = useState(false);
//   const [showSaved, setShowSaved] = useState(false);
//   const [selectedTool, setSelectedTool] = useState(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [cart, setCart] = useState(() =>
//     loadJSON(CART_KEY, [])
//       .filter((i) => i && TOOLS.some((t) => t.id === i.id) && Number.isInteger(i.qty) && i.qty > 0)
//       .map((i) => ({ id: i.id, qty: Math.min(i.qty, MAX_QTY) }))
//   );
//   const [wishlist, setWishlist] = useState(() => loadJSON(WISH_KEY, []).filter((id) => TOOLS.some((t) => t.id === id)));
//   const [openFaq, setOpenFaq] = useState(0);
//   const [toast, setToast] = useState(null);

//   // State for the Channel Popup
//   const [showChannelPopup, setShowChannelPopup] = useState(false);

//   const searchRef = useRef(null);
//   const menuRef = useFocusTrap(menuOpen);
//   const toolRef = useFocusTrap(!!selectedTool);
//   const cartRef = useFocusTrap(cartOpen);
//   const activeSection = useScrollSpy(NAV_LINKS.map((l) => l.id));

//   const { scrollYProgress } = useScroll();
//   const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

//   useLockBody(!!selectedTool || cartOpen || menuOpen || showChannelPopup);
//   const closeAll = useCallback(() => {
//     setSelectedTool(null);
//     setCartOpen(false);
//     setMenuOpen(false);
//     setSortOpen(false);
//     setShowChannelPopup(false);
//   }, []);
//   useEscape(closeAll, !!selectedTool || cartOpen || menuOpen || sortOpen || showChannelPopup);

//   // Check if the popup should be shown on mount
//   useEffect(() => {
//     const dismissed = localStorage.getItem(POPUP_KEY);
//     if (!dismissed) {
//       // Slight delay so it feels natural
//       const timer = setTimeout(() => setShowChannelPopup(true), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const dismissChannelPopup = () => {
//     setShowChannelPopup(false);
//     localStorage.setItem(POPUP_KEY, "true");
//   };

//   useEffect(() => {
//     document.title = "SmartStream — Premium AI Tools at Smarter Prices";
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement("meta");
//       meta.name = "description";
//       document.head.appendChild(meta);
//     }
//     meta.content = "Gemini Pro, YouTube Premium, Cursor AI, Midjourney, ElevenLabs and Claude Pro subscriptions. Clear pricing, order and get activated on WhatsApp.";
//   }, []);

//   useEffect(() => saveJSON(CART_KEY, cart), [cart]);
//   useEffect(() => saveJSON(WISH_KEY, wishlist), [wishlist]);

//   useEffect(() => {
//     const onScroll = () => setIsScrolled(window.scrollY > 12);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 2200);
//     return () => clearTimeout(t);
//   }, [toast]);

//   useEffect(() => {
//     const onKey = (e) => {
//       const tag = (e.target.tagName || "").toLowerCase();
//       if (e.key === "/" && !["input", "textarea", "select"].includes(tag) && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         searchRef.current?.focus();
//         searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const addToCart = useCallback((tool) => {
//     setCart((c) => {
//       const found = c.find((i) => i.id === tool.id);
//       if (found) return c.map((i) => (i.id === tool.id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i));
//       return [...c, { id: tool.id, qty: 1 }];
//     });
//     setToast(`${tool.name} added to cart`);
//   }, []);
//   const changeQty = (id, d) =>
//     setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + d, MAX_QTY) } : i)).filter((i) => i.qty > 0));
//   const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));
//   const toggleWish = useCallback((id) => {
//     setWishlist((w) => {
//       const has = w.includes(id);
//       setToast(has ? "Removed from saved" : "Saved for later");
//       return has ? w.filter((x) => x !== id) : [...w, id];
//     });
//   }, []);

//   const cartItems = useMemo(() => cart.map((i) => ({ ...TOOLS.find((t) => t.id === i.id), qty: i.qty })), [cart]);
//   const cartCount = cart.reduce((s, i) => s + i.qty, 0);

//   const checkout = () => {
//     const lines = cartItems.map((i) => `• ${i.name} (${i.duration}) x${i.qty}`).join("\n");
//     openWhatsApp(`Hello SmartStream! I'd like to request a quote for:\n\n${lines}\n\nPlease share the best price and payment details.`);
//   };
//   const buyNow = (tool) =>
//     openWhatsApp(`Hello SmartStream! I want to purchase *${tool.name}* (${tool.duration}). Please provide the price and payment details.`);

//   const goCategory = useCallback((cat) => {
//     setSelectedCategory(cat);
//     setShowSaved(false);
//     setSearchQuery("");
//     document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   const filteredTools = useMemo(() => {
//     const q = deferredQuery.trim().toLowerCase();
//     const list = TOOLS.filter((t) => {
//       const mc = selectedCategory === "All" || t.category === selectedCategory;
//       const ms = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
//       const mw = !showSaved || wishlist.includes(t.id);
//       return mc && ms && mw;
//     });
//     switch (sortBy) {
//       case "rating": return [...list].sort((a, b) => b.rating - a.rating);
//       default: return list;
//     }
//   }, [selectedCategory, deferredQuery, sortBy, showSaved, wishlist]);

//   const avgRating = useMemo(() => TOOLS.reduce((s, t) => s + t.rating, 0) / TOOLS.length, []);

//   const stats = [
//     { n: TOOLS.length, s: "", l: "Premium tools", d: 0 },
//     { n: avgRating, s: "/5", l: "Avg. tool rating", d: 1 },
//     { n: PAYMENTS.length, s: "", l: "Payment methods", d: 0 },
//     { n: 24, s: "/7", l: "WhatsApp support", d: 0 },
//   ];

//   return (
//     <MotionConfig reducedMotion="user">
//       <div id="top" className="ss-root min-h-screen overflow-x-clip">
//         <a href="#tools" className="ss-skip">Skip to store</a>

//         <motion.div style={{ scaleX: progress, background: "var(--accent)" }} className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left" aria-hidden="true" />

//         <header className={`ss-header fixed top-0 z-40 w-full transition-colors duration-300 ${isScrolled ? "ss-header-on ss-glass" : ""}`}>
//           <div className="ss-wrap flex h-14 items-center justify-between gap-2 sm:h-16">
//             <BrandLogo />

//             <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
//               {NAV_LINKS.map((l) => (
//                 <a key={l.href} href={l.href} aria-current={activeSection === l.id ? "true" : undefined} className={`ss-navlink ${activeSection === l.id ? "ss-navlink-active" : ""}`}>
//                   {l.label}
//                 </a>
//               ))}
//             </nav>

//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-outline !min-h-9 !px-3.5 !text-[13px] hidden sm:inline-flex">
//                 <MessageCircle className="h-4 w-4" /> Support
//               </a>
//               <ThemeToggle theme={theme} onToggle={toggleTheme} />
//               <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`} className="ss-icon-btn ss-icon-btn-solid relative">
//                 <ShoppingCart className="h-4 w-4" />
//                 <AnimatePresence>
//                   {cartCount > 0 && (
//                     <motion.span
//                       key={cartCount}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                       className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
//                       style={{ boxShadow: "0 0 0 2px var(--bg)" }}
//                     >
//                       {cartCount}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </button>
//               <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="ss-icon-btn md:hidden">
//                 <Menu className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </header>

//         <AnimatePresence>
//           {menuOpen && (
//             <>
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="ss-scrim fixed inset-0 z-50 md:hidden" />
//               <motion.aside
//                 ref={menuRef}
//                 tabIndex={-1}
//                 role="dialog"
//                 aria-modal="true"
//                 aria-label="Menu"
//                 initial={{ x: "100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "100%" }}
//                 transition={{ type: "spring", stiffness: 320, damping: 34 }}
//                 className="ss-panel ss-drawer ss-glass fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-xs flex-col p-5 md:hidden"
//               >
//                 <div className="mb-6 flex items-center justify-between">
//                   <BrandLogo />
//                   <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="ss-icon-btn">
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//                 <nav aria-label="Mobile" className="overflow-y-auto">
//                   {NAV_LINKS.map((l, i) => (
//                     <motion.a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.05 }} className="ss-divider-b flex min-h-12 items-center justify-between py-3 text-lg font-bold tracking-tight">
//                       {l.label} <ArrowUpRight className="ss-subtle h-4 w-4" />
//                     </motion.a>
//                   ))}
//                 </nav>
//                 <div className="mt-auto space-y-4 pt-6">
//                   <SocialLinks />
//                   <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-primary !min-h-12 w-full">
//                     <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
//                   </a>
//                 </div>
//               </motion.aside>
//             </>
//           )}
//         </AnimatePresence>

//         <main>
//           <section className="relative isolate overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 2xl:pt-40">
//             {/* HD canvas hero: particle network + dot grid, DPR-aware, theme-aware */}
//             <div className="absolute inset-0 -z-10" aria-hidden="true">
//               <ParticleField theme={theme} className="ss-particles absolute inset-0 h-full w-full" />
//               <div className="ss-noise absolute inset-0" />
//               <div className="ss-hero-fade absolute inset-0" />
//             </div>
//             <div className="ss-blob ss-blob-a -z-10" aria-hidden="true" />
//             <div className="ss-blob ss-blob-b -z-10" aria-hidden="true" />
//             <div className="ss-blob ss-blob-c -z-10" aria-hidden="true" />

//             <div className="mx-auto flex max-w-4xl flex-col items-center text-center 3xl:max-w-6xl">
//               <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="ss-pill ss-glass mb-5">
//                 <span className="relative flex h-1.5 w-1.5">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
//                   <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                 </span>
//                 Fast delivery via WhatsApp
//               </motion.div>

//               <h1 className="ss-h1">
//                 {["Premium", "AI", "Tools."].map((w, i) => (
//                   <motion.span key={w} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mr-[0.25em] inline-block">
//                     {w}
//                   </motion.span>
//                 ))}
//                 <br />
//                 <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="ss-gradient-text inline-block">
//                   Best Price Guaranteed.
//                 </motion.span>
//               </h1>

//               <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.45 }} className="ss-muted mt-4 max-w-xl text-sm leading-relaxed sm:text-base 3xl:max-w-2xl 3xl:text-lg">
//                 Get access to Gemini Pro, YouTube Premium, Cursor AI, and more. Contact us on WhatsApp to negotiate the best price and get activated instantly.
//               </motion.p>

//               <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.45 }} className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
//                 <a href="#tools" className="ss-btn ss-btn-primary group !min-h-11 w-full !px-6 sm:w-auto">
//                   Browse Store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//                 </a>
//                 <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-outline ss-glass !min-h-11 w-full !px-6 sm:w-auto">
//                   <MessageCircle className="h-4 w-4" /> Chat with Us
//                 </a>
//               </motion.div>

//               <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }} className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 3xl:max-w-4xl" aria-label="Available tools">
//                 {TOOLS.map((t) => (
//                   <li key={t.id} className="ss-pill ss-glass !py-1 !normal-case !tracking-normal">
//                     <span className="flex h-4 w-4 items-center justify-center rounded" style={tint(t.hue)}>
//                       <t.icon className="h-2.5 w-2.5" aria-hidden="true" />
//                     </span>
//                     <span className="text-xs font-semibold">{t.name.split(" ")[0]}</span>
//                   </li>
//                 ))}
//               </motion.ul>

//               <dl className="ss-divider-y mt-10 grid w-full max-w-2xl grid-cols-2 gap-5 py-6 sm:grid-cols-4 3xl:max-w-4xl">
//                 {stats.map((s) => (
//                   <div key={s.l} className="flex flex-col-reverse">
//                     <dt className="ss-subtle mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">{s.l}</dt>
//                     <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl 3xl:text-4xl">
//                       <Counter to={s.n} decimals={s.d} suffix={s.s} />
//                     </dd>
//                   </div>
//                 ))}
//               </dl>
//             </div>
//           </section>

//           <section aria-hidden="true" className="ss-marquee-wrap overflow-hidden py-3.5">
//             <div className="ss-marquee flex w-max whitespace-nowrap">
//               {[...TOOLS, ...TOOLS].map((t, i) => (
//                 <span key={i} className="flex items-center gap-8 pr-8 text-xs font-bold uppercase tracking-[0.14em]">
//                   {t.name} <Sparkles className="h-3.5 w-3.5 opacity-50" />
//                 </span>
//               ))}
//             </div>
//           </section>

//           <section id="tools" className="ss-wrap scroll-mt-16 py-14 sm:py-20">
//             <SectionHead eyebrow="The Store" title="Choose your next superpower." />

//             <div className="mb-8 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
//               <LayoutGroup>
//                 <div role="group" aria-label="Categories" className="ss-noscroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0">
//                   {CATEGORIES.map((cat) => {
//                     const active = selectedCategory === cat;
//                     return (
//                       <button key={cat} type="button" aria-pressed={active} onClick={() => setSelectedCategory(cat)} className={`ss-tab relative ${active ? "ss-tab-active" : ""}`}>
//                         {active && <motion.span layoutId="catPill" className="absolute inset-0 rounded-full" style={{ background: "var(--accent)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
//                         <span className="relative">{cat}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </LayoutGroup>

//               <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
//                 <div className="relative w-full sm:w-64">
//                   <Search className="ss-subtle pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
//                   <input
//                     ref={searchRef}
//                     type="search"
//                     aria-label="Search tools (press / to focus)"
//                     placeholder="Search tools…  ( / )"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="ss-input w-full pl-10 pr-9"
//                   />
//                   {searchQuery && (
//                     <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[var(--hover)]">
//                       <X className="h-3.5 w-3.5" />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex gap-2.5">
//                   <button type="button" onClick={() => setShowSaved((s) => !s)} aria-pressed={showSaved} className={`ss-btn ss-btn-outline !h-10 !min-h-10 !px-4 ${showSaved ? "ss-saved-on" : ""}`}>
//                     <Heart className={`h-4 w-4 ${showSaved ? "fill-red-500 text-red-500" : ""}`} /> Saved
//                     {wishlist.length > 0 && <span className="ss-chip !px-1.5 !py-0.5">{wishlist.length}</span>}
//                   </button>

//                   <div className="relative min-w-0 flex-1 sm:flex-none">
//                     <button type="button" onClick={() => setSortOpen((o) => !o)} aria-expanded={sortOpen} aria-controls="sort-list" className="ss-btn ss-btn-outline !h-10 !min-h-10 w-full justify-between !px-4 sm:w-auto">
//                       <SlidersHorizontal className="h-4 w-4 shrink-0" />
//                       <span className="truncate">{SORTS.find((s) => s.id === sortBy).label}</span>
//                       <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
//                     </button>
//                     <AnimatePresence>
//                       {sortOpen && (
//                         <>
//                           <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
//                           <motion.ul id="sort-list" aria-label="Sort by" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }} className="ss-panel ss-glass absolute right-0 z-30 mt-2 w-full min-w-52 overflow-hidden rounded-xl p-1 sm:w-auto" style={{ boxShadow: "var(--shadow-lg)" }}>
//                             {SORTS.map((s) => (
//                               <li key={s.id}>
//                                 <button type="button" aria-current={sortBy === s.id ? "true" : undefined} onClick={() => { setSortBy(s.id); setSortOpen(false); }} className="flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-[13px] font-medium hover:bg-[var(--hover)]">
//                                   {s.label}
//                                   {sortBy === s.id && <Check className="h-4 w-4" />}
//                                 </button>
//                               </li>
//                             ))}
//                           </motion.ul>
//                         </>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <p className="sr-only" role="status" aria-live="polite">{filteredTools.length} tools shown</p>

//             {/* Responsive HD grid: 1 → 2 → 3 → 4 columns at 3xl (1920px+) */}
//             <motion.div layout className="ss-tools-grid">
//               <AnimatePresence mode="popLayout">
//                 {filteredTools.map((tool, idx) => (
//                   <ProductCard key={tool.id} tool={tool} idx={idx} onOpen={setSelectedTool} onAdd={addToCart} inCart={cart.some((c) => c.id === tool.id)} liked={wishlist.includes(tool.id)} onLike={toggleWish} tiltEnabled={!reduceMotion} />
//                 ))}
//               </AnimatePresence>
//             </motion.div>

//             {filteredTools.length === 0 && (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
//                 {showSaved ? <Heart className="ss-subtle mx-auto mb-3 h-8 w-8" /> : <Search className="ss-subtle mx-auto mb-3 h-8 w-8" />}
//                 <p className="text-base font-bold tracking-tight">{showSaved && wishlist.length === 0 ? "Nothing saved yet" : "No tools found"}</p>
//                 <p className="ss-muted mt-1 text-sm">
//                   {showSaved && wishlist.length === 0 ? "Tap the heart on a tool to save it here." : "Try a different search or category."}
//                 </p>
//                 <button type="button" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setShowSaved(false); }} className="ss-btn ss-btn-primary mt-5">
//                   Reset filters
//                 </button>
//               </motion.div>
//             )}
//           </section>

//           <section id="how" className="ss-band scroll-mt-16 py-14 sm:py-20">
//             <div className="ss-wrap">
//               <SectionHead center eyebrow="Simple process" title="From cart to activated in 4 steps." />
//               <ol className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 3xl:gap-8">
//                 {STEPS.map((s, i) => (
//                   <li key={s.title}>
//                     <Reveal delay={i * 0.08} className="h-full">
//                       <div className="ss-card ss-card-hover h-full p-6 text-center 3xl:p-8">
//                         <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl 3xl:h-14 3xl:w-14" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
//                           <s.icon className="h-5 w-5" aria-hidden="true" />
//                           <span className="ss-step-num absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">{i + 1}</span>
//                         </div>
//                         <h3 className="mb-1.5 text-base font-bold tracking-tight 3xl:text-lg">{s.title}</h3>
//                         <p className="ss-muted text-[13px] leading-relaxed 3xl:text-sm">{s.desc}</p>
//                       </div>
//                     </Reveal>
//                   </li>
//                 ))}
//               </ol>
//             </div>
//           </section>

//           <section id="features" className="scroll-mt-16 py-14 sm:py-20">
//             <div className="ss-wrap">
//               <SectionHead center eyebrow="Why SmartStream" title="Why buy from us?" sub="A smooth experience for premium software, from order to setup." />
//               <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 3xl:gap-8">
//                 {FEATURES.map((f, i) => (
//                   <Reveal key={f.title} delay={i * 0.07} className="h-full">
//                     <div className="ss-card ss-card-hover h-full p-6 3xl:p-8">
//                       <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl 3xl:h-12 3xl:w-12" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
//                         <f.icon className="h-5 w-5" aria-hidden="true" />
//                       </div>
//                       <h3 className="mb-1.5 text-base font-bold tracking-tight 3xl:text-lg">{f.title}</h3>
//                       <p className="ss-muted text-[13px] leading-relaxed 3xl:text-sm">{f.desc}</p>
//                     </div>
//                   </Reveal>
//                 ))}
//               </div>
//             </div>
//           </section>

//           <section id="faq" className="ss-band scroll-mt-16 py-14 sm:py-20">
//             <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 3xl:max-w-5xl">
//               <SectionHead center eyebrow="FAQ" title="Got questions?" />
//               <div className="space-y-2.5">
//                 {FAQS.map((f, i) => {
//                   const open = openFaq === i;
//                   return (
//                     <Reveal key={f.q} delay={i * 0.04}>
//                       <div className={`ss-card overflow-hidden !rounded-xl transition-colors ${open ? "!border-[var(--border-strong)]" : ""}`}>
//                         <h3>
//                           <button type="button" onClick={() => setOpenFaq(open ? -1 : i)} id={`faq-btn-${i}`} aria-expanded={open} aria-controls={`faq-panel-${i}`} className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold sm:px-5 sm:text-[15px]">
//                             {f.q}
//                             <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
//                               <Plus className="h-3.5 w-3.5" />
//                             </motion.span>
//                           </button>
//                         </h3>
//                         <AnimatePresence initial={false}>
//                           {open && (
//                             <motion.div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
//                               <p className="ss-muted px-4 pb-5 text-[13px] leading-relaxed sm:px-5 sm:text-sm">{f.a}</p>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </div>
//                     </Reveal>
//                   );
//                 })}
//               </div>
//             </div>
//           </section>

//           <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
//             <Reveal>
//               <div className="ss-cta ss-noise-wrap relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-7 text-center sm:p-14 3xl:max-w-6xl">
//                 <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="ss-cta-glow absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" aria-hidden="true" />
//                 <div className="ss-noise absolute inset-0" aria-hidden="true" />
//                 <h2 className="ss-h2 relative">Ready to level up?</h2>
//                 <p className="relative mx-auto mt-3 max-w-md text-sm opacity-75 sm:text-base">Message us on WhatsApp to negotiate your price and get set up today.</p>
//                 <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-cta relative mt-7 !min-h-11 !px-6">
//                   <MessageCircle className="h-4 w-4" /> Start on WhatsApp
//                 </a>
//               </div>
//             </Reveal>
//           </section>
//         </main>

//         <SmartStreamFooter onPickCategory={goCategory} />
//         <BackToTop />

//         {/* ─── PRODUCT MODAL ─── */}
//         <AnimatePresence>
//           {selectedTool && (
//             <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTool(null)} className="ss-scrim absolute inset-0" />
//               <motion.div ref={toolRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tool-title" initial={{ opacity: 0, y: 60, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 60, scale: 0.98 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="ss-panel ss-modal ss-glass relative w-full max-w-md overflow-y-auto rounded-t-3xl sm:rounded-3xl">
//                 <div className="ss-divider-b relative p-6 text-center sm:p-8">
//                   <button type="button" onClick={() => setSelectedTool(null)} aria-label="Close" className="ss-icon-btn absolute right-4 top-4">
//                     <X className="h-4 w-4" />
//                   </button>
//                   <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.05 }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={tint(selectedTool.hue)}>
//                     <selectedTool.icon className="h-8 w-8" aria-hidden="true" />
//                   </motion.div>
//                   <h2 id="tool-title" className="text-2xl font-extrabold tracking-tight">{selectedTool.name}</h2>
//                   <p className="ss-subtle mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{selectedTool.category} · {selectedTool.duration}</p>

//                   <div className="mt-5 flex flex-col items-center justify-center gap-1">
//                     <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-amber-500">
//                       <Tag className="h-4 w-4" />
//                       Price on Request
//                     </div>
//                     <p className="ss-subtle text-xs">Contact us for the best rate</p>
//                   </div>

//                   <div className="ss-muted mt-3 flex items-center justify-center gap-2 text-[13px]">
//                     <Stars rating={selectedTool.rating} /> · {selectedTool.reviews.toLocaleString()} reviews
//                   </div>
//                 </div>

//                 <div className="p-6 sm:p-8">
//                   <p className="ss-muted mb-6 text-sm leading-relaxed">{selectedTool.desc}</p>
//                   <h3 className="ss-subtle mb-3 text-[11px] font-bold uppercase tracking-[0.14em]">What's included</h3>
//                   <ul className="mb-7 space-y-3">
//                     {selectedTool.features.map((feat, i) => (
//                       <motion.li key={feat} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex items-start gap-2.5 text-sm font-medium">
//                         <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
//                           <Check className="h-2.5 w-2.5" aria-hidden="true" />
//                         </span>
//                         {feat}
//                       </motion.li>
//                     ))}
//                   </ul>
//                   <div className="flex flex-col gap-2.5 sm:flex-row">
//                     <button type="button" onClick={() => { addToCart(selectedTool); setSelectedTool(null); setCartOpen(true); }} className="ss-btn ss-btn-outline !min-h-11 flex-1">
//                       <ShoppingCart className="h-4 w-4" /> Add to Cart
//                     </button>
//                     <button type="button" onClick={() => buyNow(selectedTool)} className="ss-btn ss-btn-wa !min-h-11 flex-1">
//                       <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
//                     </button>
//                   </div>
//                   <p className="ss-subtle mt-3 text-center text-xs">You'll be redirected to WhatsApp to negotiate and complete your order.</p>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* ─── CART DRAWER ─── */}
//         <AnimatePresence>
//           {cartOpen && (
//             <>
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="ss-scrim fixed inset-0 z-50" />
//               <motion.aside ref={cartRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Shopping cart" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} className="ss-panel ss-drawer ss-glass fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col">
//                 <div className="ss-divider-b flex items-center justify-between p-4 sm:p-6">
//                   <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
//                     Your Cart <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-white text-black">{cartCount}</span>
//                   </h2>
//                   <div className="flex items-center gap-2">
//                     {cartItems.length > 0 && (
//                       <button type="button" onClick={() => setCart([])} className="ss-subtle rounded-full px-2.5 py-1.5 text-xs font-semibold hover:text-red-500">
//                         Clear
//                       </button>
//                     )}
//                     <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" className="ss-icon-btn">
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 sm:p-6">
//                   {cartItems.length === 0 ? (
//                     <div className="flex h-full flex-col items-center justify-center text-center">
//                       <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-2)]">
//                         <ShoppingCart className="ss-subtle h-8 w-8" />
//                       </div>
//                       <p className="text-lg font-bold tracking-tight">Your cart is empty</p>
//                       <p className="ss-muted mt-1.5 text-sm">Add a tool to get started.</p>
//                       <button type="button" onClick={() => setCartOpen(false)} className="ss-btn ss-btn-primary mt-6">Browse Store</button>
//                     </div>
//                   ) : (
//                     <ul className="space-y-3">
//                       <AnimatePresence initial={false}>
//                         {cartItems.map((item) => (
//                           <motion.li key={item.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="ss-card flex gap-3 !rounded-2xl p-3 sm:gap-3.5 sm:p-3.5">
//                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14" style={tint(item.hue)}>
//                               <item.icon className="h-6 w-6" aria-hidden="true" />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <div className="flex items-start justify-between gap-2">
//                                 <div className="min-w-0">
//                                   <p className="truncate text-sm font-bold tracking-tight">{item.name}</p>
//                                   <p className="ss-subtle text-[10px] font-bold uppercase tracking-[0.14em]">{item.duration}</p>
//                                 </div>
//                                 <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="ss-subtle flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--hover)] hover:text-red-500">
//                                   <Trash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                               <div className="mt-2.5 flex items-center justify-between gap-2">
//                                 <div className="ss-border flex items-center rounded-full" role="group" aria-label={`Quantity for ${item.name}`}>
//                                   <button type="button" onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--hover)]"><Minus className="h-3.5 w-3.5" /></button>
//                                   <span className="w-6 text-center text-[13px] font-bold" aria-live="polite">{item.qty}</span>
//                                   <button type="button" onClick={() => changeQty(item.id, 1)} disabled={item.qty >= MAX_QTY} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--hover)] disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
//                                 </div>
//                                 <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Price on Request</span>
//                               </div>
//                             </div>
//                           </motion.li>
//                         ))}
//                       </AnimatePresence>
//                     </ul>
//                   )}
//                 </div>

//                 {cartItems.length > 0 && (
//                   <div className="ss-divider-t ss-safe-bottom p-4 sm:p-6">
//                     <div className="mb-4 rounded-xl bg-[var(--surface-2)] p-3 text-center">
//                       <p className="text-sm font-bold text-white">Total: Negotiable</p>
//                       <p className="ss-subtle mt-1 text-xs">Our team will offer the best price in chat.</p>
//                     </div>
//                     <button type="button" onClick={checkout} className="ss-btn ss-btn-wa !min-h-12 w-full">
//                       <MessageCircle className="h-4 w-4" /> Request Quote on WhatsApp
//                     </button>
//                     <p className="ss-subtle mt-3 text-center text-xs">Your order list is sent as a pre-filled WhatsApp message.</p>
//                   </div>
//                 )}
//               </motion.aside>
//             </>
//           )}
//         </AnimatePresence>

//         {/* ─── TOAST ─── */}
//         <div aria-live="polite" role="status">
//           <AnimatePresence>
//             {toast && (
//               <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.2 }} className="ss-toast ss-toast-pos fixed left-1/2 z-[70] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold">
//                 <Check className="h-4 w-4 shrink-0 text-emerald-500" /> <span className="truncate">{toast}</span>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* ─── FLOATING WHATSAPP ─── */}
//         <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }} whileTap={{ scale: 0.92 }} className="ss-fab ss-fab-wa fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 sm:h-14 sm:w-14">
//           <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
//         </motion.a>

//         {/* ─── WHATSAPP CHANNEL POPUP ─── */}
//         <AnimatePresence>
//           {showChannelPopup && (
//             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//               {/* Backdrop */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={dismissChannelPopup}
//                 className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//                 aria-hidden="true"
//               />

//               {/* Modal Box */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                 className="ss-glass relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 text-center shadow-2xl sm:max-w-md sm:p-8"
//               >
//                 {/* Decorative Background Glow */}
//                 <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20 blur-3xl pointer-events-none" />

//                 {/* Close Button */}
//                 <button
//                   onClick={dismissChannelPopup}
//                   aria-label="Close"
//                   className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>

//                 {/* Channel Icon */}
//                 <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.15)]">
//                   <FaWhatsapp className="h-8 w-8" />
//                 </div>

//                 {/* Text Content */}
//                 <h3 className="mb-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
//                   Join Our Channel
//                 </h3>
//                 <p className="mb-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
//                   Follow the <strong className="text-white">SmartStream</strong> WhatsApp channel for exclusive drops, private discounts, and AI setup guides.
//                 </p>

//                 {/* CTA Button */}
//                 <a
//                   href={CONFIG.channelUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   onClick={dismissChannelPopup}
//                   className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
//                 >
//                   <MessageCircle className="h-5 w-5" /> Follow Channel
//                 </a>

//                 {/* Skip Button */}
//                 <button
//                   onClick={dismissChannelPopup}
//                   className="mt-4 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300"
//                 >
//                   No thanks, continue browsing
//                 </button>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

//           :root, :root[data-theme="light"] {
//             --bg: #ffffff;
//             --surface: #ffffff;
//             --surface-2: #f5f5f6;
//             --fg: #0a0a0b;
//             --muted: #55555e;
//             --subtle: #6b6b75;
//             --border: rgba(10,10,11,0.09);
//             --border-strong: rgba(10,10,11,0.28);
//             --hover: rgba(10,10,11,0.05);
//             --accent: #0a0a0b;
//             --accent-fg: #ffffff;
//             --ring: #2563eb;
//             --success: #047857;
//             --shadow: 0 1px 2px rgba(10,10,11,0.04), 0 8px 24px rgba(10,10,11,0.04);
//             --shadow-hover: 0 2px 4px rgba(10,10,11,0.04), 0 16px 40px rgba(10,10,11,0.09);
//             --shadow-lg: 0 16px 48px rgba(10,10,11,0.14);
//             --shadow-tilt: 0 24px 60px -12px rgba(10,10,11,0.22), 0 8px 24px rgba(10,10,11,0.08);
//             --scrim: rgba(10,10,11,0.45);
//             --grid-line: rgba(10,10,11,0.06);
//             --blob-a: rgba(167,139,250,0.30);
//             --blob-b: rgba(251,146,60,0.26);
//             --blob-c: rgba(56,189,248,0.22);
//             --glass-bg: color-mix(in srgb, var(--surface) 74%, transparent);
//           }
//           :root[data-theme="dark"] {
//             --bg: #000000;
//             --surface: #0a0a0a;
//             --surface-2: #141414;
//             --fg: #ffffff;
//             --muted: #a1a1aa;
//             --subtle: #8a8a94;
//             --border: rgba(255,255,255,0.08);
//             --border-strong: rgba(255,255,255,0.2);
//             --hover: rgba(255,255,255,0.06);
//             --accent: #ffffff;
//             --accent-fg: #000000;
//             --ring: #60a5fa;
//             --success: #34d399;
//             --shadow: 0 1px 3px rgba(0,0,0,0.2), 0 8px 24px -4px rgba(0,0,0,0.3);
//             --shadow-hover: 0 4px 12px rgba(0,0,0,0.3), 0 24px 48px -8px rgba(0,0,0,0.5);
//             --shadow-lg: 0 24px 64px rgba(0,0,0,0.6);
//             --shadow-tilt: 0 32px 80px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), 0 0 44px -8px rgba(139,92,246,0.25);
//             --scrim: rgba(0,0,0,0.7);
//             --grid-line: rgba(255,255,255,0.04);
//             --blob-a: rgba(139,92,246,0.12);
//             --blob-b: rgba(249,115,22,0.09);
//             --blob-c: rgba(56,189,248,0.10);
//             --glass-bg: color-mix(in srgb, var(--surface) 68%, transparent);
//           }

//           html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
//           html, body { overflow-x: clip; }
//           .ss-theme-transition, .ss-theme-transition *, .ss-theme-transition *::before, .ss-theme-transition *::after {
//             transition: background-color .25s ease, color .25s ease, border-color .25s ease, fill .25s ease !important;
//           }

//           .ss-root {
//             font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//             font-size: 15px;
//             line-height: 1.55;
//             letter-spacing: -0.01em;
//             background: var(--bg);
//             color: var(--fg);
//             -webkit-font-smoothing: antialiased;
//             -moz-osx-font-smoothing: grayscale;
//             text-rendering: optimizeLegibility;
//             overflow-x: clip;
//           }
//           .ss-root ::selection { background: var(--accent); color: var(--accent-fg); }
//           .ss-root :focus-visible {
//             outline: 3px solid var(--ring);
//             outline-offset: 3px;
//             border-radius: 10px;
//           }
//           .ss-root img, .ss-root svg { max-width: 100%; }

//           /* Refined scrollbar */
//           .ss-root ::-webkit-scrollbar { width: 10px; height: 10px; }
//           .ss-root ::-webkit-scrollbar-track { background: transparent; }
//           .ss-root ::-webkit-scrollbar-thumb {
//             background: color-mix(in srgb, var(--fg) 22%, transparent);
//             border-radius: 8px;
//             border: 2px solid var(--bg);
//           }
//           .ss-root ::-webkit-scrollbar-thumb:hover {
//             background: color-mix(in srgb, var(--fg) 38%, transparent);
//           }

//           /* ── Fluid container: scales to 4K ── */
//           .ss-wrap { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: clamp(1rem, 3vw, 2rem); }
//           @media (min-width: 1536px) { .ss-wrap { max-width: 88rem; } }
//           @media (min-width: 1920px) {
//             .ss-root { font-size: 16.5px; }
//             .ss-wrap { max-width: 112rem; padding-inline: clamp(2rem, 4vw, 4rem); }
//           }
//           @media (min-width: 2560px) {
//             .ss-root { font-size: 18px; }
//             .ss-wrap { max-width: 140rem; padding-inline: clamp(3rem, 5vw, 6rem); }
//           }

//           /* ── Fluid type ── */
//           .ss-h1 {
//             font-size: clamp(2.25rem, 1.15rem + 5.2vw, 4.75rem);
//             line-height: 1.04;
//             font-weight: 900;
//             letter-spacing: -0.04em;
//             text-wrap: balance;
//           }
//           @media (min-width: 2560px) {
//             .ss-h1 { font-size: clamp(3.5rem, 2rem + 4vw, 6.5rem); }
//           }
//           .ss-h2 {
//             font-size: clamp(1.625rem, 1.05rem + 2.4vw, 2.75rem);
//             line-height: 1.08;
//             font-weight: 900;
//             letter-spacing: -0.03em;
//             text-wrap: balance;
//           }

//           .ss-muted { color: var(--muted); }
//           .ss-subtle { color: var(--subtle); }
//           .ss-success { color: var(--success); }
//           .ss-border { border: 1px solid var(--border-strong); }
//           .ss-divider { height: 1px; background: var(--border); }
//           .ss-divider-b { border-bottom: 1px solid var(--border); }
//           .ss-divider-t { border-top: 1px solid var(--border); }
//           .ss-divider-y { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
//           .ss-band { background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
//           .ss-noscroll { scrollbar-width: none; }
//           .ss-noscroll::-webkit-scrollbar { display: none; }
//           .ss-check { accent-color: var(--accent); }

//           /* ── Glassmorphism utility ── */
//           .ss-glass {
//             background: var(--glass-bg);
//             -webkit-backdrop-filter: blur(18px) saturate(160%);
//             backdrop-filter: blur(18px) saturate(160%);
//           }

//           /* ── SVG film-grain noise (vector, resolution independent) ── */
//           .ss-noise {
//             pointer-events: none;
//             background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
//             background-size: 180px 180px;
//             opacity: 0.05;
//             mix-blend-mode: overlay;
//           }
//           .ss-noise-wrap { isolation: isolate; }

//           /* ── Hero canvas + fade ── */
//           .ss-particles { display: block; }
//           .ss-hero-fade {
//             background:
//               radial-gradient(ellipse 75% 65% at 50% 38%, transparent 35%, var(--bg) 100%),
//               linear-gradient(to bottom, transparent 55%, var(--bg) 100%);
//           }

//           .ss-skip { position: absolute; left: 12px; top: -48px; z-index: 100; padding: 10px 16px; border-radius: 10px; background: var(--accent); color: var(--accent-fg); font-weight: 700; font-size: 14px; transition: top .15s; }
//           .ss-skip:focus { top: 10px; }

//           .ss-header { border-bottom: 1px solid transparent; padding-top: env(safe-area-inset-top); }
//           .ss-header-on { border-bottom-color: var(--border); box-shadow: var(--shadow); }
//           .ss-navlink { position: relative; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--muted); transition: color .2s, background-color .2s; }
//           .ss-navlink:hover { color: var(--fg); background: var(--hover); }
//           .ss-navlink-active { color: var(--fg); background: var(--hover); }

//           .ss-card {
//             background: var(--surface);
//             border: 1px solid var(--border);
//             border-radius: 1.5rem;
//             box-shadow: var(--shadow);
//           }
//           .ss-card-hover { transition: transform .3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow .3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color .3s; }
//           .ss-card-wrap { height: 100%; min-width: 0; }
//           .ss-panel { background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); color: var(--fg); }
//           .ss-scrim { background: var(--scrim); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
//           .ss-toast { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-lg); }
//           .ss-toast-pos { bottom: calc(6rem + env(safe-area-inset-bottom)); }
//           .ss-step-num { background: var(--surface); color: var(--fg); border: 1px solid var(--border-strong); }
//           .ss-modal { max-height: 92vh; max-height: 92dvh; }
//           .ss-drawer { height: 100vh; height: 100dvh; padding-bottom: env(safe-area-inset-bottom); }
//           .ss-safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }

//           /* ── 3D tilt + cursor glare (driven by --rx/--ry/--mx/--my) ── */
//           .ss-tilt {
//             transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
//             transition: transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease;
//             transform-style: preserve-3d;
//             will-change: transform;
//           }
//           .ss-tilt.is-tilting {
//             transition: transform .08s linear, box-shadow .35s ease, border-color .35s ease;
//             box-shadow: var(--shadow-tilt);
//             border-color: var(--border-strong);
//           }
//           .ss-glare { position: relative; }
//           .ss-glare::after {
//             content: "";
//             position: absolute;
//             inset: 0;
//             border-radius: inherit;
//             pointer-events: none;
//             opacity: 0;
//             transition: opacity .35s ease;
//             background: radial-gradient(560px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.13), transparent 62%);
//           }
//           .ss-tilt.is-tilting.ss-glare::after { opacity: 1; }

//           @media (hover: hover) and (pointer: fine) {
//             .ss-card-hover:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--border-strong); }
//             .ss-spot::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s; background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), var(--hover), transparent 70%); }
//             .ss-spot:hover::before { opacity: 1; }
//           }

//           /* ── HD product grid: 1 → 2 → 3 → 4 columns, CSS containment ── */
//           .ss-tools-grid {
//             display: grid;
//             grid-template-columns: minmax(0, 1fr);
//             gap: clamp(1rem, 2vw, 1.5rem);
//             contain: layout style;
//           }
//           @media (min-width: 640px) {
//             .ss-tools-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//           }
//           @media (min-width: 1024px) {
//             .ss-tools-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//           }
//           @media (min-width: 1920px) {
//             .ss-tools-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(1.5rem, 1.6vw, 2.25rem); }
//           }

//           /* ── Logo shimmer placeholder ── */
//           .ss-logo-frame { position: relative; display: inline-flex; align-items: center; min-width: 2.25rem; min-height: 2rem; }
//           .ss-logo-frame img { position: relative; z-index: 1; }
//           .ss-logo-frame:not(.is-loaded) img { opacity: 0; }
//           .ss-shimmer {
//             position: absolute; inset: 0; border-radius: 0.5rem; overflow: hidden;
//             background: color-mix(in srgb, var(--fg) 8%, transparent);
//           }
//           .ss-shimmer::after {
//             content: ""; position: absolute; inset: 0;
//             background: linear-gradient(100deg, transparent 20%, color-mix(in srgb, var(--fg) 14%, transparent) 50%, transparent 80%);
//             animation: ssShimmerSweep 1.4s ease-in-out infinite;
//           }

//           .ss-fab { right: max(1.25rem, env(safe-area-inset-right)); }
//           .ss-fab-wa { bottom: max(1.25rem, env(safe-area-inset-bottom)); }
//           .ss-fab-top { bottom: calc(5.25rem + env(safe-area-inset-bottom)); background: var(--accent); color: var(--accent-fg); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); transition: transform .2s; }
//           .ss-fab-top:hover { transform: scale(1.05); }
//           .ss-fab-top:active { transform: scale(.95); }
//           @media (min-width: 640px) { .ss-fab-top { bottom: calc(5.75rem + env(safe-area-inset-bottom)); } }

//           .ss-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 2.75rem; padding: 0 1.25rem; border-radius: .75rem; font-size: .875rem; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer; transition: transform .15s ease, background-color .2s, color .2s, border-color .2s, box-shadow .2s, opacity .2s, filter .2s; }
//           .ss-btn:active { transform: scale(.97); }
//           .ss-btn:disabled { opacity: .55; cursor: not-allowed; }
//           .ss-btn-primary { background: var(--accent); color: var(--accent-fg); box-shadow: 0 2px 8px rgba(0,0,0,.15); }
//           .ss-btn-primary:hover { opacity: .9; box-shadow: 0 4px 16px rgba(0,0,0,.2); }
//           .ss-btn-outline { background: transparent; color: var(--fg); border: 1px solid var(--border-strong); }
//           .ss-btn-outline:hover { background: var(--hover); }
//           .ss-saved-on { background: var(--hover); border-color: var(--fg); }
//           .ss-btn-wa { background: #25D366; color: #052e14; box-shadow: 0 6px 20px rgba(37,211,102,.3); }
//           .ss-btn-wa:hover { filter: brightness(1.05); box-shadow: 0 8px 28px rgba(37,211,102,.42); }
//           .ss-btn-cta { background: var(--bg); color: var(--fg); }
//           .ss-btn-cta:hover { opacity: .9; }

//           .ss-icon-btn { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; flex-shrink: 0; border-radius: 999px; border: 1px solid var(--border-strong); background: transparent; color: var(--fg); cursor: pointer; transition: background-color .2s, color .2s, transform .15s; }
//           @media (max-width: 359px) { .ss-icon-btn { height: 2.25rem; width: 2.25rem; } }
//           .ss-icon-btn:hover { background: var(--hover); }
//           .ss-icon-btn:active { transform: scale(.94); }
//           .ss-icon-btn-solid { background: var(--accent); color: var(--accent-fg); border-color: transparent; }
//           .ss-icon-btn-solid:hover { background: var(--accent); opacity: .9; }

//           .ss-chip { padding: 4px 10px; border-radius: 999px; background: var(--hover); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
//           .ss-pill { display: inline-flex; align-items: center; gap: .5rem; padding: 6px 12px; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

//           .ss-tab { white-space: nowrap; min-height: 2.5rem; padding: 0 1.25rem; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); background: var(--surface); border: 1px solid var(--border); cursor: pointer; transition: color .2s, border-color .2s, background-color .2s; box-shadow: var(--shadow); }
//           .ss-tab:hover { color: var(--fg); border-color: var(--border-strong); }
//           .ss-tab-active { color: var(--accent-fg); border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
//           .ss-tab-active:hover { color: var(--accent-fg); }

//           .ss-input { height: 2.5rem; border-radius: 999px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--fg); font-size: 16px; font-weight: 500; transition: border-color .2s, box-shadow .2s; box-shadow: var(--shadow); }
//           @media (min-width: 768px) { .ss-input { font-size: 14px; } }
//           .ss-input::placeholder { color: var(--subtle); }
//           .ss-input:focus { outline: none; border-color: var(--fg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--fg) 15%, transparent); }
//           .ss-input::-webkit-search-cancel-button { display: none; }

//           .ss-link { transition: color .2s; }
//           .ss-link:hover { color: var(--fg); }

//           .ss-social { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); transition: color .2s, border-color .2s, transform .2s, background-color .2s; box-shadow: var(--shadow); }
//           .ss-social:hover, .ss-social:focus-visible { color: var(--brand); border-color: var(--brand); transform: translateY(-2px); }

//           .ss-foot { background: var(--surface); border-top: 1px solid var(--border); }
//           .ss-foot-bottom { background: var(--surface-2); }
//           .ss-foot-link { display: inline-flex; align-items: center; min-height: 2.25rem; padding: 0 0; font-size: 14px; color: var(--muted); text-align: left; transition: color .2s; cursor: pointer; }
//           .ss-foot-link:hover { color: var(--fg); }
//           .ss-icon-chip { display: inline-flex; align-items: center; justify-content: center; height: 2rem; width: 2rem; flex-shrink: 0; margin-top: 2px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
//           .ss-pay { display: inline-flex; align-items: center; gap: .4rem; height: 1.75rem; padding: 0 .75rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); color: var(--muted); font-size: 11px; font-weight: 600; }

//           /* ── Ambient blobs (now three, theme-tinted) ── */
//           .ss-blob { position: absolute; border-radius: 999px; filter: blur(100px); pointer-events: none; }
//           .ss-blob-a { left: -100px; top: 80px; width: 300px; height: 300px; background: var(--blob-a); animation: ssFloatA 20s ease-in-out infinite; }
//           .ss-blob-b { right: -100px; top: 160px; width: 350px; height: 350px; background: var(--blob-b); animation: ssFloatB 24s ease-in-out infinite; }
//           .ss-blob-c { left: 38%; bottom: -140px; width: 420px; height: 420px; background: var(--blob-c); animation: ssFloatA 28s ease-in-out infinite reverse; }
//           @media (min-width: 1920px) {
//             .ss-blob-a { width: 480px; height: 480px; }
//             .ss-blob-b { width: 560px; height: 560px; }
//             .ss-blob-c { width: 640px; height: 640px; }
//           }
//           .ss-gradient-text { background: linear-gradient(90deg, var(--fg), color-mix(in srgb, var(--fg) 40%, transparent), var(--fg)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; animation: ssShimmer 6s linear infinite; }

//           .ss-marquee-wrap { background: var(--accent); color: var(--accent-fg); }
//           .ss-marquee { animation: ssMarquee 40s linear infinite; }

//           .ss-cta { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-lg); }
//           .ss-cta-glow { background: var(--accent-fg); }

//           @keyframes ssMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
//           @keyframes ssShimmer { to { background-position: 200% center; } }
//           @keyframes ssShimmerSweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
//           @keyframes ssFloatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
//           @keyframes ssFloatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-40px,36px); } }

//           @media (prefers-reduced-motion: reduce) {
//             html { scroll-behavior: auto; }
//             .ss-marquee, .ss-blob, .ss-gradient-text, .ss-shimmer::after { animation: none !important; }
//             .ss-tilt { transform: none !important; }
//             .ss-root *, .ss-root *::before, .ss-root *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
//           }
//         `}</style>
//       </div>
//     </MotionConfig>
//   );
// }
