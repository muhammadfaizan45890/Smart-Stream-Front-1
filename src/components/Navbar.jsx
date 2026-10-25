import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  X,
  Check,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  MessageCircle,
  Mail,
  Clock,
  Loader2,
  AlertCircle,
  CreditCard,
  Headphones,
  Play,
  Monitor,
  Cpu,
  Layers,
  Sparkles,
  Menu,
  Plus,
  Minus,
  Trash2,
  Heart,
  ChevronDown,
  SlidersHorizontal,
  MousePointerClick,
  Send,
  PackageCheck,
  Sun,
  Moon,
  Landmark,
  Smartphone,
  Bitcoin,
  Tag,
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
   LOGO IMPORT
   ════════════════════════════════════════════════════════════ */
import logoImage from "../assets/logo2.jpeg"; 

/* ════════════════════════════════════════════════════════════
   CONFIGURATION & CONSTANTS
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  brandName: "SMARTSTREAM",
  whatsappNumber: "923716837122", 
  whatsappDisplay: "+92 371 6837122",
  currency: "$",
  supportEmail: "smartstreamsoftware@gmail.com",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
  channelUrl: "https://whatsapp.com/channel/0029VbE66le8fewoR2Y8ZF2y",
};

const THEME_KEY = "ss-theme";
const CART_KEY = "ss-cart";
const WISH_KEY = "ss-wishlist";
const POPUP_KEY = "ss-channel-popup-dismissed"; // Key for the popup
const MAX_QTY = 10;

/* Custom Midjourney SVG Icon */
const MidjourneyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.36 19.06H1.64a.45.45 0 0 1-.39-.68l.83-1.42a.45.45 0 0 1 .78 0l.56.95h17.16l.56-.95a.45.45 0 0 1 .78 0l.83 1.42a.45.45 0 0 1-.39.68Z"/>
    <path d="M18.15 11.28 12 2.06 5.85 11.28a.45.45 0 0 0 .37.7h11.56a.45.45 0 0 0 .37-.7Zm-6.15-6.4 3.8 5.68H8.2L12 4.88Z"/>
  </svg>
);

const TOOLS = [
  {
    id: "gemini-pro",
    name: "Gemini Advanced (Pro)",
    category: "AI Chat",
    duration: "1 Month",
    rating: 4.9,
    reviews: 1240,
    icon: SiGooglegemini,
    hue: "#3b82f6",
    badge: "HOT",
    desc: "Unlock Google's most capable AI model. Includes 2TB of Google One storage and integration with Gmail, Docs, and more.",
    features: ["Gemini 1.5 Pro Access", "2TB Cloud Storage", "Google Workspace Integration", "Priority Support"],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "Entertainment",
    duration: "1 Month",
    rating: 4.8,
    reviews: 3890,
    icon: SiYoutube,
    hue: "#ef4444",
    badge: "POPULAR",
    desc: "Ad-free YouTube, YouTube Music Premium, offline downloads, and background play on all your devices.",
    features: ["Ad-free Video", "YouTube Music Premium", "Background Play", "Offline Downloads"],
  },
  {
    id: "cursor-pro",
    name: "Cursor AI Pro",
    category: "Coding",
    duration: "1 Month",
    rating: 5.0,
    reviews: 850,
    icon: SiCursor,
    hue: "#10b981",
    badge: "DEV FAV",
    desc: "The AI-first code editor. Built for pair programming with an AI that deeply understands your codebase.",
    features: ["Unlimited AI Completions", "Claude 3.5 Sonnet Access", "GPT-4o Access", "Multi-file Edits"],
  },
  {
    id: "midjourney",
    name: "Midjourney Basic",
    category: "Image Gen",
    duration: "1 Month",
    rating: 4.9,
    reviews: 2100,
    icon: MidjourneyIcon,
    hue: "#d946ef",
    badge: "",
    desc: "Generate stunning, high-resolution images from simple text prompts using one of the best AI image models.",
    features: ["~200 Generations/Month", "Standard Resolution", "Web App Access", "Commercial Use"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Creator",
    category: "Audio & Voice",
    duration: "1 Month",
    rating: 4.8,
    reviews: 940,
    icon: SiElevenlabs,
    hue: "#f59e0b",
    badge: "NEW",
    desc: "A realistic AI text-to-speech engine. Clone your voice or use thousands of studio-quality voices.",
    features: ["100k Characters/Month", "Voice Cloning", "Commercial License", "29 Languages"],
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    category: "AI Chat",
    duration: "1 Month",
    rating: 4.9,
    reviews: 1670,
    icon: SiAnthropic,
    hue: "#f97316",
    badge: "",
    desc: "Anthropic's Claude. Exceptional at coding, reasoning, and analyzing massive documents.",
    features: ["Latest Claude models", "5x more usage", "Priority access", "Early features"],
  },
];

const CATEGORIES = ["All", "AI Chat", "Coding", "Image Gen", "Audio & Voice", "Entertainment"];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "rating", label: "Top Rated" },
];

const STEPS = [
  { icon: MousePointerClick, title: "Pick your tool", desc: "Browse the store and add what you need to your cart." },
  { icon: Send, title: "Order on WhatsApp", desc: "One tap sends your order to our team with all details filled in." },
  { icon: CreditCard, title: "Negotiate & Pay", desc: "Discuss price, then pay via Bank transfer, Easypaisa, JazzCash, or crypto." },
  { icon: PackageCheck, title: "Get activated", desc: "Receive your access details and setup help right in chat." },
];

const FEATURES = [
  { icon: Zap, title: "Fast Delivery", desc: "Get your activation details right in WhatsApp after payment." },
  { icon: ShieldCheck, title: "Warranty Cover", desc: "Covered for the duration of your subscription, with replacement if something breaks." },
  { icon: CreditCard, title: "Local Payments", desc: "Pay via bank transfer, Easypaisa, JazzCash, or crypto." },
  { icon: Headphones, title: "24/7 Support", desc: "Our team is on WhatsApp to help you get set up." },
];

const FAQS = [
  { q: "How does delivery work?", a: "After you confirm payment on WhatsApp, we send your activation details in the same chat. Most orders are completed within minutes." },
  { q: "How is the price decided?", a: "We offer the best market rates. Add items to your cart, click checkout, and our team will give you a final quote on WhatsApp based on your selected duration and bundle." },
  { q: "Which payment methods do you accept?", a: "Local bank transfer, Easypaisa, JazzCash, and crypto. Our team shares the details once you place your order." },
  { q: "What if something stops working?", a: "Message us on WhatsApp any time during your subscription period and we'll fix it or replace it." },
  { q: "Can I renew when my month ends?", a: "Absolutely. Message us before expiry and we'll renew with the same setup." },
];

const PAYMENTS = [
  { icon: Landmark, label: "Bank Transfer" },
  { icon: Smartphone, label: "Easypaisa" },
  { icon: Smartphone, label: "JazzCash" },
  { icon: Bitcoin, label: "Crypto" },
];

const NAV_LINKS = [
  { id: "tools", href: "#tools", label: "Store" },
  { id: "how", href: "#how", label: "How it works" },
  { id: "features", href: "#features", label: "Why us" },
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
    root.classList.add("ss-theme-transition");
    window.setTimeout(() => root.classList.remove("ss-theme-transition"), 300);
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

const BrandLogo = ({ className = "" }) => (
  <a 
    href="#top" 
    aria-label={`${CONFIG.brandName} home`} 
    className={`flex items-center gap-2.5 rounded-lg group ${className}`}
  >
    <img 
      src={logoImage} 
      alt={`${CONFIG.brandName} Logo`} 
      className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9" 
    />
    <span className="hidden text-[15px] font-extrabold tracking-tight sm:block">
      {CONFIG.brandName}
    </span>
  </a>
);

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="ss-icon-btn"
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

const Reveal = ({ children, delay = 0, className = "" }) => (
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

const SectionHead = ({ eyebrow, title, sub, center = false }) => (
  <Reveal className={`mb-8 max-w-2xl sm:mb-12 ${center ? "mx-auto text-center" : ""}`}>
    <p className="ss-subtle mb-2 text-[11px] font-bold uppercase tracking-[0.14em]">{eyebrow}</p>
    <h2 className="ss-h2">{title}</h2>
    {sub && <p className="ss-muted mt-3 text-sm leading-relaxed sm:text-[15px]">{sub}</p>}
  </Reveal>
);

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="sr-only">Rated </span>
      {rating.toFixed(1)}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   PRODUCT CARD
   ════════════════════════════════════════════════════════════ */
function ProductCard({ tool, idx, onOpen, onAdd, inCart, liked, onLike }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      ref={ref}
      onMouseMove={onMove}
      className="ss-card ss-card-hover ss-spot group relative flex flex-col overflow-hidden p-5 sm:p-6"
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={tint(tool.hue)}>
            <tool.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="ss-subtle text-[10px] font-bold uppercase tracking-[0.14em]">{tool.category}</p>
            <h3 className="truncate text-base font-bold tracking-tight">{tool.name}</h3>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {tool.badge && <span className="ss-chip hidden min-[400px]:inline-block">{tool.badge}</span>}
          <button
            type="button"
            onClick={() => onLike(tool.id)}
            aria-label={liked ? `Remove ${tool.name} from saved` : `Save ${tool.name}`}
            aria-pressed={liked}
            className="ss-icon-btn !h-9 !w-9"
          >
            <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>

      <p className="ss-muted relative mt-4 line-clamp-2 text-[13px] leading-relaxed">{tool.desc}</p>

      <ul className="relative mt-4 space-y-2">
        {tool.features.slice(0, 3).map((feat) => (
          <li key={feat} className="flex items-center gap-2.5 text-[13px] font-medium">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-5">
        <div className="ss-divider mb-4" />
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-500">
              <Tag className="h-3.5 w-3.5" />
              Price on Request
            </div>
            <p className="ss-subtle mt-1 text-[11px]">Negotiate via WhatsApp</p>
          </div>
          <div className="text-right">
            <Stars rating={tool.rating} />
            <p className="ss-subtle text-[11px]">{tool.reviews.toLocaleString()} reviews</p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button type="button" onClick={() => onOpen(tool)} className="ss-btn ss-btn-outline flex-1">
            Details
          </button>
          <button type="button" onClick={() => onAdd(tool)} className="ss-btn ss-btn-primary flex-[1.4]">
            <AnimatePresence mode="wait" initial={false}>
              {inCart ? (
                <motion.span key="in" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Added
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

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
            className="ss-social"
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
          className="ss-fab ss-fab-top fixed z-40 inline-flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
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
      openWhatsApp(`Hello SmartStream! Please add ${trimmed} to your offers and updates list.`);
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
        <Mail className="ss-subtle pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2" aria-hidden="true" />
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
          className="ss-input !h-12 w-full pl-10 pr-28 disabled:opacity-60 sm:pr-32"
        />
        <button type="submit" disabled={isLoading} className="ss-btn ss-btn-primary absolute right-1.5 top-1/2 !min-h-9 -translate-y-1/2 !rounded-full !px-3.5 !text-xs sm:!px-4">
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <span className="hidden sm:inline">Joining…</span>
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <label className="ss-muted flex cursor-pointer select-none items-start gap-2.5 text-[12px] leading-snug">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            clearError();
          }}
          className="ss-check mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          I agree to receive offers and updates from SmartStream
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
              className={`flex items-center gap-1.5 text-xs font-medium ${status === "success" ? "ss-success" : "text-red-500"}`}
              role={status === "error" ? "alert" : "status"}
            >
              {status === "success" ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});

const SmartStreamFooter = ({ onPickCategory }) => {
  const year = useMemo(() => new Date().getFullYear(), []);
  const legal = [
    { label: "Privacy", href: CONFIG.privacyUrl },
    { label: "Terms", href: CONFIG.termsUrl },
  ];

  return (
    <footer className="ss-foot mt-8 w-full sm:mt-12">
      <div className="ss-divider-b">
        <div className="ss-wrap py-10 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="ss-h2">Join the SmartStream list.</h2>
              <p className="ss-muted mt-3 max-w-md text-sm sm:text-base">
                Get early access to new tools and setup guides. We'll add you to our updates list on WhatsApp.
              </p>
            </div>
            <div className="w-full max-w-md lg:ml-auto">
              <UpdatesForm />
            </div>
          </div>
        </div>
      </div>

      <div className="ss-wrap py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <BrandLogo />
            <p className="ss-muted max-w-sm text-sm leading-relaxed">
              Premium access to popular AI tools at clear prices. Delivery via WhatsApp, 24/7 support, and warranty cover for your subscription period.
            </p>
            <SocialLinks />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-4 lg:gap-6 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Store</h3>
              <ul className="space-y-1">
                {["All", "AI Chat", "Coding", "Image Gen"].map((c) => (
                  <li key={c}>
                    <button type="button" onClick={() => onPickCategory(c)} className="ss-foot-link">
                      {c === "All" ? "All Tools" : c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Help</h3>
              <ul className="space-y-1">
                <li><a href="#how" className="ss-foot-link">How it works</a></li>
                <li><a href="#faq" className="ss-foot-link">FAQ</a></li>
                <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-foot-link">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em]">Legal</h3>
              <ul className="space-y-1">
                {legal.map((l) => (
                  <li key={l.label}><SmartLink to={l.href} className="ss-foot-link">{l.label}</SmartLink></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em]">Get in touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="ss-icon-chip"><MessageCircle className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">WhatsApp</p>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-foot-link !px-0 break-words text-sm !text-[var(--fg)]">
                    {CONFIG.whatsappDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="ss-icon-chip"><Mail className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Email</p>
                  <a href={`mailto:${CONFIG.supportEmail}`} className="ss-foot-link !px-0 break-all text-sm !text-[var(--fg)]">
                    {CONFIG.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="ss-icon-chip"><Clock className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Hours</p>
                  <p className="text-sm">24/7 Support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="ss-icon-chip bg-[#25D366]/10 text-[#25D366]"><MessageCircle className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="ss-subtle text-[10px] font-semibold uppercase tracking-wider">Channel</p>
                  <a href={CONFIG.channelUrl} target="_blank" rel="noopener noreferrer" className="ss-foot-link !px-0 break-words text-sm !text-[#25D366] hover:underline">
                    Follow our Channel
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ss-divider-t">
        <div className="ss-wrap py-6">
          <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {[
              { title: "Instant Delivery", subtitle: "Via WhatsApp" },
              { title: "Warranty Cover", subtitle: "Replacement if it breaks" },
              { title: "Local Payments", subtitle: "Bank, Easypaisa, JazzCash, Crypto" },
              { title: "24/7 Support", subtitle: "We're on WhatsApp" },
            ].map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{b.title}</p>
                  <p className="ss-subtle text-[11px]">{b.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ss-divider-t ss-foot-bottom">
        <div className="ss-wrap flex flex-col items-center justify-between gap-4 py-5 lg:flex-row">
          <p className="ss-subtle text-center text-[11px]">© {year} {CONFIG.brandName}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
            {PAYMENTS.map(({ icon: Icon, label }) => (
              <li key={label} className="ss-pay">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function SmartStreamStore() {
  const [theme, toggleTheme] = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() =>
    loadJSON(CART_KEY, [])
      .filter((i) => i && TOOLS.some((t) => t.id === i.id) && Number.isInteger(i.qty) && i.qty > 0)
      .map((i) => ({ id: i.id, qty: Math.min(i.qty, MAX_QTY) }))
  );
  const [wishlist, setWishlist] = useState(() => loadJSON(WISH_KEY, []).filter((id) => TOOLS.some((t) => t.id === id)));
  const [openFaq, setOpenFaq] = useState(0);
  const [toast, setToast] = useState(null);
  
  // State for the Channel Popup
  const [showChannelPopup, setShowChannelPopup] = useState(false);

  const searchRef = useRef(null);
  const menuRef = useFocusTrap(menuOpen);
  const toolRef = useFocusTrap(!!selectedTool);
  const cartRef = useFocusTrap(cartOpen);
  const activeSection = useScrollSpy(NAV_LINKS.map((l) => l.id));

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  useLockBody(!!selectedTool || cartOpen || menuOpen || showChannelPopup);
  const closeAll = useCallback(() => {
    setSelectedTool(null);
    setCartOpen(false);
    setMenuOpen(false);
    setSortOpen(false);
    setShowChannelPopup(false);
  }, []);
  useEscape(closeAll, !!selectedTool || cartOpen || menuOpen || sortOpen || showChannelPopup);

  // Check if the popup should be shown on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_KEY);
    if (!dismissed) {
      // Slight delay so it feels natural
      const timer = setTimeout(() => setShowChannelPopup(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissChannelPopup = () => {
    setShowChannelPopup(false);
    localStorage.setItem(POPUP_KEY, "true");
  };

  useEffect(() => {
    document.title = "SmartStream — Premium AI Tools at Smarter Prices";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Gemini Pro, YouTube Premium, Cursor AI, Midjourney, ElevenLabs and Claude Pro subscriptions. Clear pricing, order and get activated on WhatsApp.";
  }, []);

  useEffect(() => saveJSON(CART_KEY, cart), [cart]);
  useEffect(() => saveJSON(WISH_KEY, wishlist), [wishlist]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (e.key === "/" && !["input", "textarea", "select"].includes(tag) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addToCart = useCallback((tool) => {
    setCart((c) => {
      const found = c.find((i) => i.id === tool.id);
      if (found) return c.map((i) => (i.id === tool.id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i));
      return [...c, { id: tool.id, qty: 1 }];
    });
    setToast(`${tool.name} added to cart`);
  }, []);
  const changeQty = (id, d) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + d, MAX_QTY) } : i)).filter((i) => i.qty > 0));
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const toggleWish = useCallback((id) => {
    setWishlist((w) => {
      const has = w.includes(id);
      setToast(has ? "Removed from saved" : "Saved for later");
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, []);

  const cartItems = useMemo(() => cart.map((i) => ({ ...TOOLS.find((t) => t.id === i.id), qty: i.qty })), [cart]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const checkout = () => {
    const lines = cartItems.map((i) => `• ${i.name} (${i.duration}) x${i.qty}`).join("\n");
    openWhatsApp(`Hello SmartStream! I'd like to request a quote for:\n\n${lines}\n\nPlease share the best price and payment details.`);
  };
  const buyNow = (tool) =>
    openWhatsApp(`Hello SmartStream! I want to purchase *${tool.name}* (${tool.duration}). Please provide the price and payment details.`);

  const goCategory = useCallback((cat) => {
    setSelectedCategory(cat);
    setShowSaved(false);
    setSearchQuery("");
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = TOOLS.filter((t) => {
      const mc = selectedCategory === "All" || t.category === selectedCategory;
      const ms = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const mw = !showSaved || wishlist.includes(t.id);
      return mc && ms && mw;
    });
    switch (sortBy) {
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [selectedCategory, searchQuery, sortBy, showSaved, wishlist]);

  const avgRating = useMemo(() => TOOLS.reduce((s, t) => s + t.rating, 0) / TOOLS.length, []);

  const stats = [
    { n: TOOLS.length, s: "", l: "Premium tools", d: 0 },
    { n: avgRating, s: "/5", l: "Avg. tool rating", d: 1 },
    { n: PAYMENTS.length, s: "", l: "Payment methods", d: 0 },
    { n: 24, s: "/7", l: "WhatsApp support", d: 0 },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="ss-root min-h-screen overflow-x-hidden">
        <a href="#tools" className="ss-skip">Skip to store</a>

        <motion.div style={{ scaleX: progress, background: "var(--accent)" }} className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left" aria-hidden="true" />

        <header className={`ss-header fixed top-0 z-40 w-full transition-colors duration-300 ${isScrolled ? "ss-header-on" : ""}`}>
          <div className="ss-wrap flex h-14 items-center justify-between gap-2">
            <BrandLogo />

            <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} aria-current={activeSection === l.id ? "true" : undefined} className={`ss-navlink ${activeSection === l.id ? "ss-navlink-active" : ""}`}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-outline !min-h-9 !px-3.5 !text-[13px] hidden sm:inline-flex">
                <MessageCircle className="h-4 w-4" /> Support
              </a>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`} className="ss-icon-btn ss-icon-btn-solid relative">
                <ShoppingCart className="h-4 w-4" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                      style={{ boxShadow: "0 0 0 2px var(--bg)" }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="ss-icon-btn md:hidden">
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="ss-scrim fixed inset-0 z-50 md:hidden" />
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
                className="ss-panel ss-drawer fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-xs flex-col p-5 md:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <BrandLogo />
                  <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="ss-icon-btn">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav aria-label="Mobile" className="overflow-y-auto">
                  {NAV_LINKS.map((l, i) => (
                    <motion.a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.05 }} className="ss-divider-b flex min-h-12 items-center justify-between py-3 text-lg font-bold tracking-tight">
                      {l.label} <ArrowUpRight className="ss-subtle h-4 w-4" />
                    </motion.a>
                  ))}
                </nav>
                <div className="mt-auto space-y-4 pt-6">
                  <SocialLinks />
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-primary !min-h-12 w-full">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main>
          <section className="relative isolate overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 2xl:pt-40">
            <div className="ss-grid-bg absolute inset-0 -z-10" aria-hidden="true" />
            <div className="ss-blob ss-blob-a -z-10" aria-hidden="true" />
            <div className="ss-blob ss-blob-b -z-10" aria-hidden="true" />

            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="ss-pill mb-5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Fast delivery via WhatsApp
              </motion.div>

              <h1 className="ss-h1">
                {["Premium", "AI", "Tools."].map((w, i) => (
                  <motion.span key={w} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mr-[0.25em] inline-block">
                    {w}
                  </motion.span>
                ))}
                <br />
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="ss-gradient-text inline-block">
                  Best Price Guaranteed.
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.45 }} className="ss-muted mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
                Get access to Gemini Pro, YouTube Premium, Cursor AI, and more. Contact us on WhatsApp to negotiate the best price and get activated instantly.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.45 }} className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                <a href="#tools" className="ss-btn ss-btn-primary group !min-h-11 w-full !px-6 sm:w-auto">
                  Browse Store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-outline !min-h-11 w-full !px-6 sm:w-auto">
                  <MessageCircle className="h-4 w-4" /> Chat with Us
                </a>
              </motion.div>

              <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }} className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2" aria-label="Available tools">
                {TOOLS.map((t) => (
                  <li key={t.id} className="ss-pill !py-1 !normal-case !tracking-normal">
                    <span className="flex h-4 w-4 items-center justify-center rounded" style={tint(t.hue)}>
                      <t.icon className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold">{t.name.split(" ")[0]}</span>
                  </li>
                ))}
              </motion.ul>

              <dl className="ss-divider-y mt-10 grid w-full max-w-2xl grid-cols-2 gap-5 py-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.l} className="flex flex-col-reverse">
                    <dt className="ss-subtle mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">{s.l}</dt>
                    <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                      <Counter to={s.n} decimals={s.d} suffix={s.s} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-hidden="true" className="ss-marquee-wrap overflow-hidden py-3.5">
            <div className="ss-marquee flex w-max whitespace-nowrap">
              {[...TOOLS, ...TOOLS].map((t, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 text-xs font-bold uppercase tracking-[0.14em]">
                  {t.name} <Sparkles className="h-3.5 w-3.5 opacity-50" />
                </span>
              ))}
            </div>
          </section>

          <section id="tools" className="ss-wrap scroll-mt-16 py-14 sm:py-20">
            <SectionHead eyebrow="The Store" title="Choose your next superpower." />

            <div className="mb-8 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <LayoutGroup>
                <div role="group" aria-label="Categories" className="ss-noscroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0">
                  {CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button key={cat} type="button" aria-pressed={active} onClick={() => setSelectedCategory(cat)} className={`ss-tab relative ${active ? "ss-tab-active" : ""}`}>
                        {active && <motion.span layoutId="catPill" className="absolute inset-0 rounded-full" style={{ background: "var(--accent)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        <span className="relative">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="ss-subtle pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    ref={searchRef}
                    type="search"
                    aria-label="Search tools (press / to focus)"
                    placeholder="Search tools…  ( / )"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ss-input w-full pl-10 pr-9"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[var(--hover)]">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button type="button" onClick={() => setShowSaved((s) => !s)} aria-pressed={showSaved} className={`ss-btn ss-btn-outline !h-10 !min-h-10 !px-4 ${showSaved ? "ss-saved-on" : ""}`}>
                    <Heart className={`h-4 w-4 ${showSaved ? "fill-red-500 text-red-500" : ""}`} /> Saved
                    {wishlist.length > 0 && <span className="ss-chip !px-1.5 !py-0.5">{wishlist.length}</span>}
                  </button>

                  <div className="relative min-w-0 flex-1 sm:flex-none">
                    <button type="button" onClick={() => setSortOpen((o) => !o)} aria-expanded={sortOpen} aria-controls="sort-list" className="ss-btn ss-btn-outline !h-10 !min-h-10 w-full justify-between !px-4 sm:w-auto">
                      <SlidersHorizontal className="h-4 w-4 shrink-0" />
                      <span className="truncate">{SORTS.find((s) => s.id === sortBy).label}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {sortOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                          <motion.ul id="sort-list" aria-label="Sort by" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }} className="ss-panel absolute right-0 z-30 mt-2 w-full min-w-52 overflow-hidden rounded-xl p-1 sm:w-auto" style={{ boxShadow: "var(--shadow-lg)" }}>
                            {SORTS.map((s) => (
                              <li key={s.id}>
                                <button type="button" aria-current={sortBy === s.id ? "true" : undefined} onClick={() => { setSortBy(s.id); setSortOpen(false); }} className="flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-[13px] font-medium hover:bg-[var(--hover)]">
                                  {s.label}
                                  {sortBy === s.id && <Check className="h-4 w-4" />}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <p className="sr-only" role="status" aria-live="polite">{filteredTools.length} tools shown</p>

            <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool, idx) => (
                  <ProductCard key={tool.id} tool={tool} idx={idx} onOpen={setSelectedTool} onAdd={addToCart} inCart={cart.some((c) => c.id === tool.id)} liked={wishlist.includes(tool.id)} onLike={toggleWish} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredTools.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                {showSaved ? <Heart className="ss-subtle mx-auto mb-3 h-8 w-8" /> : <Search className="ss-subtle mx-auto mb-3 h-8 w-8" />}
                <p className="text-base font-bold tracking-tight">{showSaved && wishlist.length === 0 ? "Nothing saved yet" : "No tools found"}</p>
                <p className="ss-muted mt-1 text-sm">
                  {showSaved && wishlist.length === 0 ? "Tap the heart on a tool to save it here." : "Try a different search or category."}
                </p>
                <button type="button" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setShowSaved(false); }} className="ss-btn ss-btn-primary mt-5">
                  Reset filters
                </button>
              </motion.div>
            )}
          </section>

          <section id="how" className="ss-band scroll-mt-16 py-14 sm:py-20">
            <div className="ss-wrap">
              <SectionHead center eyebrow="Simple process" title="From cart to activated in 4 steps." />
              <ol className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {STEPS.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <div className="ss-card ss-card-hover h-full p-6 text-center">
                        <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                          <s.icon className="h-5 w-5" aria-hidden="true" />
                          <span className="ss-step-num absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">{i + 1}</span>
                        </div>
                        <h3 className="mb-1.5 text-base font-bold tracking-tight">{s.title}</h3>
                        <p className="ss-muted text-[13px] leading-relaxed">{s.desc}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="features" className="scroll-mt-16 py-14 sm:py-20">
            <div className="ss-wrap">
              <SectionHead center eyebrow="Why SmartStream" title="Why buy from us?" sub="A smooth experience for premium software, from order to setup." />
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.07} className="h-full">
                    <div className="ss-card ss-card-hover h-full p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                        <f.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mb-1.5 text-base font-bold tracking-tight">{f.title}</h3>
                      <p className="ss-muted text-[13px] leading-relaxed">{f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="ss-band scroll-mt-16 py-14 sm:py-20">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
              <SectionHead center eyebrow="FAQ" title="Got questions?" />
              <div className="space-y-2.5">
                {FAQS.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <Reveal key={f.q} delay={i * 0.04}>
                      <div className={`ss-card overflow-hidden !rounded-xl transition-colors ${open ? "!border-[var(--border-strong)]" : ""}`}>
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
                              <p className="ss-muted px-4 pb-5 text-[13px] leading-relaxed sm:px-5 sm:text-sm">{f.a}</p>
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

          <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <div className="ss-cta relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-7 text-center sm:p-14">
                <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="ss-cta-glow absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" aria-hidden="true" />
                <h2 className="ss-h2 relative">Ready to level up?</h2>
                <p className="relative mx-auto mt-3 max-w-md text-sm opacity-75 sm:text-base">Message us on WhatsApp to negotiate your price and get set up today.</p>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ss-btn ss-btn-cta relative mt-7 !min-h-11 !px-6">
                  <MessageCircle className="h-4 w-4" /> Start on WhatsApp
                </a>
              </div>
            </Reveal>
          </section>
        </main>

        <SmartStreamFooter onPickCategory={goCategory} />
        <BackToTop />

        {/* ─── PRODUCT MODAL ─── */}
        <AnimatePresence>
          {selectedTool && (
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTool(null)} className="ss-scrim absolute inset-0" />
              <motion.div ref={toolRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tool-title" initial={{ opacity: 0, y: 60, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 60, scale: 0.98 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="ss-panel ss-modal relative w-full max-w-md overflow-y-auto rounded-t-3xl sm:rounded-3xl">
                <div className="ss-divider-b relative p-6 text-center sm:p-8">
                  <button type="button" onClick={() => setSelectedTool(null)} aria-label="Close" className="ss-icon-btn absolute right-4 top-4">
                    <X className="h-4 w-4" />
                  </button>
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.05 }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={tint(selectedTool.hue)}>
                    <selectedTool.icon className="h-8 w-8" aria-hidden="true" />
                  </motion.div>
                  <h2 id="tool-title" className="text-2xl font-extrabold tracking-tight">{selectedTool.name}</h2>
                  <p className="ss-subtle mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{selectedTool.category} · {selectedTool.duration}</p>
                  
                  <div className="mt-5 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-amber-500">
                      <Tag className="h-4 w-4" />
                      Price on Request
                    </div>
                    <p className="ss-subtle text-xs">Contact us for the best rate</p>
                  </div>

                  <div className="ss-muted mt-3 flex items-center justify-center gap-2 text-[13px]">
                    <Stars rating={selectedTool.rating} /> · {selectedTool.reviews.toLocaleString()} reviews
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="ss-muted mb-6 text-sm leading-relaxed">{selectedTool.desc}</p>
                  <h3 className="ss-subtle mb-3 text-[11px] font-bold uppercase tracking-[0.14em]">What's included</h3>
                  <ul className="mb-7 space-y-3">
                    {selectedTool.features.map((feat, i) => (
                      <motion.li key={feat} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex items-start gap-2.5 text-sm font-medium">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                          <Check className="h-2.5 w-2.5" aria-hidden="true" />
                        </span>
                        {feat}
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button type="button" onClick={() => { addToCart(selectedTool); setSelectedTool(null); setCartOpen(true); }} className="ss-btn ss-btn-outline !min-h-11 flex-1">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                    <button type="button" onClick={() => buyNow(selectedTool)} className="ss-btn ss-btn-wa !min-h-11 flex-1">
                      <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                    </button>
                  </div>
                  <p className="ss-subtle mt-3 text-center text-xs">You'll be redirected to WhatsApp to negotiate and complete your order.</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── CART DRAWER ─── */}
        <AnimatePresence>
          {cartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="ss-scrim fixed inset-0 z-50" />
              <motion.aside ref={cartRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Shopping cart" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} className="ss-panel ss-drawer fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col">
                <div className="ss-divider-b flex items-center justify-between p-4 sm:p-6">
                  <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
                    Your Cart <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-white text-black">{cartCount}</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    {cartItems.length > 0 && (
                      <button type="button" onClick={() => setCart([])} className="ss-subtle rounded-full px-2.5 py-1.5 text-xs font-semibold hover:text-red-500">
                        Clear
                      </button>
                    )}
                    <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" className="ss-icon-btn">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-2)]">
                        <ShoppingCart className="ss-subtle h-8 w-8" />
                      </div>
                      <p className="text-lg font-bold tracking-tight">Your cart is empty</p>
                      <p className="ss-muted mt-1.5 text-sm">Add a tool to get started.</p>
                      <button type="button" onClick={() => setCartOpen(false)} className="ss-btn ss-btn-primary mt-6">Browse Store</button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cartItems.map((item) => (
                          <motion.li key={item.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="ss-card flex gap-3 !rounded-2xl p-3 sm:gap-3.5 sm:p-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14" style={tint(item.hue)}>
                              <item.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold tracking-tight">{item.name}</p>
                                  <p className="ss-subtle text-[10px] font-bold uppercase tracking-[0.14em]">{item.duration}</p>
                                </div>
                                <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="ss-subtle flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--hover)] hover:text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-2.5 flex items-center justify-between gap-2">
                                <div className="ss-border flex items-center rounded-full" role="group" aria-label={`Quantity for ${item.name}`}>
                                  <button type="button" onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--hover)]"><Minus className="h-3.5 w-3.5" /></button>
                                  <span className="w-6 text-center text-[13px] font-bold" aria-live="polite">{item.qty}</span>
                                  <button type="button" onClick={() => changeQty(item.id, 1)} disabled={item.qty >= MAX_QTY} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--hover)] disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Price on Request</span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="ss-divider-t ss-safe-bottom p-4 sm:p-6">
                    <div className="mb-4 rounded-xl bg-[var(--surface-2)] p-3 text-center">
                      <p className="text-sm font-bold text-white">Total: Negotiable</p>
                      <p className="ss-subtle mt-1 text-xs">Our team will offer the best price in chat.</p>
                    </div>
                    <button type="button" onClick={checkout} className="ss-btn ss-btn-wa !min-h-12 w-full">
                      <MessageCircle className="h-4 w-4" /> Request Quote on WhatsApp
                    </button>
                    <p className="ss-subtle mt-3 text-center text-xs">Your order list is sent as a pre-filled WhatsApp message.</p>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── TOAST ─── */}
        <div aria-live="polite" role="status">
          <AnimatePresence>
            {toast && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.2 }} className="ss-toast ss-toast-pos fixed left-1/2 z-[70] flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" /> <span className="truncate">{toast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── FLOATING WHATSAPP ─── */}
        <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }} whileTap={{ scale: 0.92 }} className="ss-fab ss-fab-wa fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 sm:h-14 sm:w-14">
          <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
        </motion.a>

        {/* ─── WHATSAPP CHANNEL POPUP ─── */}
        <AnimatePresence>
          {showChannelPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={dismissChannelPopup}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-hidden="true"
              />
              
              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 text-center shadow-2xl sm:max-w-md sm:p-8"
              >
                {/* Decorative Background Glow */}
                <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20 blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button 
                  onClick={dismissChannelPopup} 
                  aria-label="Close" 
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Channel Icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.15)]">
                  <FaWhatsapp className="h-8 w-8" />
                </div>

                {/* Text Content */}
                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Join Our Channel
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  Follow the <strong className="text-white">SmartStream</strong> WhatsApp channel for exclusive drops, private discounts, and AI setup guides.
                </p>

                {/* CTA Button */}
                <a 
                  href={CONFIG.channelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={dismissChannelPopup}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" /> Follow Channel
                </a>

                {/* Skip Button */}
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
            --scrim: rgba(10,10,11,0.45);
            --grid-line: rgba(10,10,11,0.06);
            --blob-a: rgba(167,139,250,0.30);
            --blob-b: rgba(251,146,60,0.26);
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
            --scrim: rgba(0,0,0,0.7);
            --grid-line: rgba(255,255,255,0.04);
            --blob-a: rgba(139,92,246,0.1);
            --blob-b: rgba(249,115,22,0.08);
          }

          html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
          .ss-theme-transition, .ss-theme-transition *, .ss-theme-transition *::before, .ss-theme-transition *::after {
            transition: background-color .25s ease, color .25s ease, border-color .25s ease, fill .25s ease !important;
          }

          .ss-root {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 15px;
            line-height: 1.55;
            letter-spacing: -0.01em;
            background: var(--bg);
            color: var(--fg);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          @media (min-width: 1920px) { .ss-root { font-size: 16px; } }
          .ss-root ::selection { background: var(--accent); color: var(--accent-fg); }
          .ss-root :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; border-radius: 8px; }
          .ss-root img, .ss-root svg { max-width: 100%; }

          .ss-wrap { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: clamp(1rem, 3vw, 2rem); }
          @media (min-width: 1536px) { .ss-wrap { max-width: 88rem; } }
          @media (min-width: 2200px) { .ss-wrap { max-width: 96rem; } }

          .ss-h1 { font-size: clamp(2.125rem, 1rem + 4.6vw, 4.5rem); line-height: 1.05; font-weight: 900; letter-spacing: -0.04em; text-wrap: balance; }
          .ss-h2 { font-size: clamp(1.625rem, 1.1rem + 2vw, 2.5rem); line-height: 1.1; font-weight: 900; letter-spacing: -0.03em; text-wrap: balance; }

          .ss-muted { color: var(--muted); }
          .ss-subtle { color: var(--subtle); }
          .ss-success { color: var(--success); }
          .ss-border { border: 1px solid var(--border-strong); }
          .ss-divider { height: 1px; background: var(--border); }
          .ss-divider-b { border-bottom: 1px solid var(--border); }
          .ss-divider-t { border-top: 1px solid var(--border); }
          .ss-divider-y { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
          .ss-band { background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
          .ss-noscroll { scrollbar-width: none; }
          .ss-noscroll::-webkit-scrollbar { display: none; }
          .ss-check { accent-color: var(--accent); }

          .ss-skip { position: absolute; left: 12px; top: -48px; z-index: 100; padding: 10px 16px; border-radius: 10px; background: var(--accent); color: var(--accent-fg); font-weight: 700; font-size: 14px; transition: top .15s; }
          .ss-skip:focus { top: 10px; }

          .ss-header { border-bottom: 1px solid transparent; padding-top: env(safe-area-inset-top); }
          .ss-header-on { background: color-mix(in srgb, var(--bg) 85%, transparent); border-bottom-color: var(--border); -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); }
          .ss-navlink { position: relative; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--muted); transition: color .2s, background-color .2s; }
          .ss-navlink:hover { color: var(--fg); background: var(--hover); }
          .ss-navlink-active { color: var(--fg); background: var(--hover); }

          .ss-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; box-shadow: var(--shadow); }
          .ss-card-hover { transition: transform .3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow .3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color .3s; }
          .ss-panel { background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); color: var(--fg); }
          .ss-scrim { background: var(--scrim); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
          .ss-toast { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-lg); }
          .ss-toast-pos { bottom: calc(6rem + env(safe-area-inset-bottom)); }
          .ss-step-num { background: var(--surface); color: var(--fg); border: 1px solid var(--border-strong); }
          .ss-modal { max-height: 92vh; max-height: 92dvh; }
          .ss-drawer { height: 100vh; height: 100dvh; padding-bottom: env(safe-area-inset-bottom); }
          .ss-safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }

          @media (hover: hover) and (pointer: fine) {
            .ss-card-hover:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--border-strong); }
            .ss-spot::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s; background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), var(--hover), transparent 70%); }
            .ss-spot:hover::before { opacity: 1; }
          }

          .ss-fab { right: max(1.25rem, env(safe-area-inset-right)); }
          .ss-fab-wa { bottom: max(1.25rem, env(safe-area-inset-bottom)); }
          .ss-fab-top { bottom: calc(5.25rem + env(safe-area-inset-bottom)); background: var(--accent); color: var(--accent-fg); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); transition: transform .2s; }
          .ss-fab-top:hover { transform: scale(1.05); }
          .ss-fab-top:active { transform: scale(.95); }
          @media (min-width: 640px) { .ss-fab-top { bottom: calc(5.75rem + env(safe-area-inset-bottom)); } }

          .ss-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 2.75rem; padding: 0 1.25rem; border-radius: .75rem; font-size: .875rem; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer; transition: transform .15s ease, background-color .2s, color .2s, border-color .2s, box-shadow .2s, opacity .2s, filter .2s; }
          .ss-btn:active { transform: scale(.97); }
          .ss-btn:disabled { opacity: .55; cursor: not-allowed; }
          .ss-btn-primary { background: var(--accent); color: var(--accent-fg); box-shadow: 0 2px 8px rgba(0,0,0,.15); }
          .ss-btn-primary:hover { opacity: .9; box-shadow: 0 4px 16px rgba(0,0,0,.2); }
          .ss-btn-outline { background: transparent; color: var(--fg); border: 1px solid var(--border-strong); }
          .ss-btn-outline:hover { background: var(--hover); }
          .ss-saved-on { background: var(--hover); border-color: var(--fg); }
          .ss-btn-wa { background: #25D366; color: #052e14; box-shadow: 0 6px 20px rgba(37,211,102,.3); }
          .ss-btn-wa:hover { filter: brightness(1.05); }
          .ss-btn-cta { background: var(--bg); color: var(--fg); }
          .ss-btn-cta:hover { opacity: .9; }

          .ss-icon-btn { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; flex-shrink: 0; border-radius: 999px; border: 1px solid var(--border-strong); background: transparent; color: var(--fg); cursor: pointer; transition: background-color .2s, color .2s, transform .15s; }
          @media (max-width: 359px) { .ss-icon-btn { height: 2.25rem; width: 2.25rem; } }
          .ss-icon-btn:hover { background: var(--hover); }
          .ss-icon-btn:active { transform: scale(.94); }
          .ss-icon-btn-solid { background: var(--accent); color: var(--accent-fg); border-color: transparent; }
          .ss-icon-btn-solid:hover { background: var(--accent); opacity: .9; }

          .ss-chip { padding: 4px 10px; border-radius: 999px; background: var(--hover); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
          .ss-pill { display: inline-flex; align-items: center; gap: .5rem; padding: 6px 12px; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

          .ss-tab { white-space: nowrap; min-height: 2.5rem; padding: 0 1.25rem; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); background: var(--surface); border: 1px solid var(--border); cursor: pointer; transition: color .2s, border-color .2s, background-color .2s; box-shadow: var(--shadow); }
          .ss-tab:hover { color: var(--fg); border-color: var(--border-strong); }
          .ss-tab-active { color: var(--accent-fg); border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
          .ss-tab-active:hover { color: var(--accent-fg); }

          .ss-input { height: 2.5rem; border-radius: 999px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--fg); font-size: 16px; font-weight: 500; transition: border-color .2s, box-shadow .2s; box-shadow: var(--shadow); }
          @media (min-width: 768px) { .ss-input { font-size: 14px; } }
          .ss-input::placeholder { color: var(--subtle); }
          .ss-input:focus { outline: none; border-color: var(--fg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--fg) 15%, transparent); }
          .ss-input::-webkit-search-cancel-button { display: none; }

          .ss-link { transition: color .2s; }
          .ss-link:hover { color: var(--fg); }

          .ss-social { display: inline-flex; align-items: center; justify-content: center; height: 2.5rem; width: 2.5rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); transition: color .2s, border-color .2s, transform .2s, background-color .2s; box-shadow: var(--shadow); }
          .ss-social:hover, .ss-social:focus-visible { color: var(--brand); border-color: var(--brand); transform: translateY(-2px); }

          .ss-foot { background: var(--surface); border-top: 1px solid var(--border); }
          .ss-foot-bottom { background: var(--surface-2); }
          .ss-foot-link { display: inline-flex; align-items: center; min-height: 2.25rem; padding: 0 0; font-size: 14px; color: var(--muted); text-align: left; transition: color .2s; cursor: pointer; }
          .ss-foot-link:hover { color: var(--fg); }
          .ss-icon-chip { display: inline-flex; align-items: center; justify-content: center; height: 2rem; width: 2rem; flex-shrink: 0; margin-top: 2px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
          .ss-pay { display: inline-flex; align-items: center; gap: .4rem; height: 1.75rem; padding: 0 .75rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); color: var(--muted); font-size: 11px; font-weight: 600; }

          .ss-grid-bg { background-image: linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px); background-size: 64px 64px; -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 40%, #000, transparent); mask-image: radial-gradient(ellipse 60% 60% at 50% 40%, #000, transparent); }
          .ss-blob { position: absolute; border-radius: 999px; filter: blur(100px); pointer-events: none; }
          .ss-blob-a { left: -100px; top: 80px; width: 300px; height: 300px; background: var(--blob-a); animation: ssFloatA 20s ease-in-out infinite; }
          .ss-blob-b { right: -100px; top: 160px; width: 350px; height: 350px; background: var(--blob-b); animation: ssFloatB 24s ease-in-out infinite; }
          .ss-gradient-text { background: linear-gradient(90deg, var(--fg), color-mix(in srgb, var(--fg) 40%, transparent), var(--fg)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; animation: ssShimmer 6s linear infinite; }

          .ss-marquee-wrap { background: var(--accent); color: var(--accent-fg); }
          .ss-marquee { animation: ssMarquee 40s linear infinite; }

          .ss-cta { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-lg); }
          .ss-cta-glow { background: var(--accent-fg); }

          @keyframes ssMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes ssShimmer { to { background-position: 200% center; } }
          @keyframes ssFloatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
          @keyframes ssFloatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-40px,36px); } }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            .ss-marquee, .ss-blob, .ss-gradient-text { animation: none !important; }
            .ss-root *, .ss-root *::before, .ss-root *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
