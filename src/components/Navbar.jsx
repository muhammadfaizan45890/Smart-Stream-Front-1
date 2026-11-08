/* ════════════════════════════════════════════════════════════════════
   FEATHERED EXPERTS PRO — ADVANCED / HD
   AI Tools Marketplace & Digital Agency — fully advanced, HD,
   ultra-responsive rework of FeatheredExpertsPro.jsx.
   Same default export `FeatheredExpertsPro`, same imports, no new
   dependencies. Drop-in replacement: same props (none), same content,
   same WhatsApp flows, light mode by default, no prices anywhere.

   WHAT'S ADVANCED IN THIS VERSION
   • HD fonts — Sora (display) + Inter (body) via Google Fonts @import
     inside THEME_CSS, with system fallback stacks, antialiased
     rendering, tuned letter-spacing and tabular-nums stats.
   • Fluid clamp() type & spacing tokens from 320px phones to 2560px+
     ultra-wide; breakpoints at 360/480/640/768/1024/1280/1440/1920/2560.
   • DPR-aware particle canvas (devicePixelRatio capped at 2), debounced
     resize, pauses when the tab is hidden, single static frame for
     reduced motion. SVG film-grain overlay for depth.
   • 3D tilt + cursor glare on marketplace cards (rAF-throttled), subtle
     scroll parallax on the hero dashboard, staggered scroll reveals.
   • Performance — memoised ToolCard/SectionHead/Counter/Reveal/
     SmartLink/LeadForm, useDeferredValue on marketplace search,
     content-visibility on below-fold sections, passive listeners,
     will-change only on animated elements.
   • Accessibility — skip link, visible focus rings, aria labels on
     card actions, 44px touch targets on mobile, safe-area insets,
     full prefers-reduced-motion support.

   ── HOW TO USE ───────────────────────────────────────────────────
   1. Drop this file AND `feather-logo.png` into your project
      (e.g. `src/components/`) and render it inside a router:
         import { BrowserRouter } from "react-router-dom";
         import FeatheredExpertsPro from "./FeatheredExpertsPro.advanced";
         <BrowserRouter><FeatheredExpertsPro /></BrowserRouter>
      The footer Privacy/Terms links use `SmartLink`, which falls back
      to a plain <a> when there is no router, so it also renders
      without a <BrowserRouter> wrapper.
   2. Install the dependencies (same family as the SmartStream build):
         npm i react-router-dom lucide-react react-icons framer-motion
   3. Logo: the import below points at `./feather-logo.png` — keep the
      feather PNG next to this file (it is supplied with it). The logo
      is shown inside a black rounded tile, so it stays crisp in both
      themes, and is also used as the page favicon. Do NOT point this
      import at `../assets/logo2.jpeg` — in some projects that file is
      a different (SmartStream "S") logo.

   ── TAILWIND `3xl:` BREAKPOINT — REQUIRED SETUP ──────────────────
   This file uses `3xl:` utilities for the 1920px+ HD/4K enlargements.
   `3xl` is NOT a default Tailwind breakpoint, so those classes are
   silently ignored unless you define it:

   • Tailwind v3 — in `tailwind.config.js`, inside `theme.extend`:
         screens: {
           '3xl': '1920px',
         },
   • Tailwind v4 — in the stylesheet that has `@import "tailwindcss"`:
         @theme {
           --breakpoint-3xl: 1920px;
         },

   The core 1920px / 2560px scaling does NOT depend on this — it lives
   in the embedded <style> block below (fluid container, fluid `clamp()`
   type, media queries) — so the page still works without the config;
   only the `3xl:` enlargements would not apply on very large screens.

   ── LIGHT MODE BY DEFAULT ────────────────────────────────────────
   Light mode is the default on every fresh load. The theme state
   starts at "light", nothing is read from localStorage and nothing
   reads prefers-color-scheme, so the page can never open dark. The
   header toggle switches to dark for that visit only.

   ── NO PRICES ────────────────────────────────────────────────────
   No price is shown anywhere on this page. Every marketplace card
   and every pricing tier says "Price on Request" and its button opens
   WhatsApp to 03716804766 with the tool or plan pre-filled.
   ════════════════════════════════════════════════════════════════════ */

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useDeferredValue,
} from "react";
import { Link, useInRouterContext } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  Gauge,
  Globe,
  Headphones,
  Landmark,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  Moon,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  SiAnthropic,
  SiCoursera,
  SiCursor,
  SiElevenlabs,
  SiNetflix,
  SiNordvpn,
  SiNotion,
  SiSurfshark,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   LOGO IMPORT — white feather on black.
   Keep `feather-logo.png` next to this file. The logo is shown
   inside a black rounded tile, so it stays crisp in both themes.
   ════════════════════════════════════════════════════════════════════ */
import featherLogo from "./feather-logo.png";

/* ════════════════════════════════════════════════════════════════════
   CONFIGURATION & CONSTANTS
   ════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  brandName: "Feathered Experts Pro",
  tagline: "AI Tools • Websites • Meta Ads",
  whatsappNumber: "923716804766", // display: 03716804766
  whatsappDisplay: "0371 6804766",
  supportNumber: "923716837122", // general support: +92 371 6837122
  supportDisplay: "+92 371 6837122",
  supportEmail: "smartstreamsoftware@gmail.com",
  channelUrl: "https://whatsapp.com/channel/0029VbE66le8fewoR2Y8ZF2y",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
};

const WA_NUMBER = CONFIG.whatsappNumber;
const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const openWhatsApp = (text) =>
  window.open(waLink(text), "_blank", "noopener,noreferrer");
const buyText = (name, duration) =>
  `Hello Feathered Experts Pro! I want to buy: ${name}${duration ? ` (${duration})` : ""}. Please share the activation details so we can negotiate on WhatsApp.`;
const planText = (plan, group) =>
  `Hello Feathered Experts Pro! I am interested in the ${plan} plan (${group}). Please share the details so we can negotiate on WhatsApp.`;

/* ── Official brand marks (inline SVG, same official artwork as the live site) ── */

const GeminiProSparkLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Google Gemini logo"><defs><linearGradient id="gemGradPro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4796E3"/><stop offset=".55" stopColor="#9177C7"/><stop offset="1" stopColor="#D96570"/></linearGradient></defs><path fill="url(#gemGradPro)" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>
);

const GeminiSparkLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Google Gemini logo"><defs><linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4796E3"/><stop offset=".55" stopColor="#9177C7"/><stop offset="1" stopColor="#D96570"/></linearGradient></defs><path fill="url(#gemGrad)" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>
);

const LeonardoLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 869.2332764 1000" role="img" aria-label="Leonardo.Ai logo"><path d="M792.0125122,686.2042236c0,0-42.4542236,182.7999268-172.6542358,248.0332642  c5.2000122-5.1916504,99.8583984-74.166626,135.3417358-248.0332642  c-37.3416748,7.4082642-69.5166626,5.6374512-102.2666626-6.9291992c0,6.7833252,28.1583252,222.7458496-145.5708618,274.4916382  C516.9750366,926.8041382,540.458313,862.8125,540.458313,862.8125  c-0.6958008-0.354187-58.5041199,103.020874-106.1916504,103.020874c-47.6916809,0-104.7916565-103.375061-105.4916382-103.020874  c0,0,23.4833069,63.9916382,33.5916443,90.9541626c-172.6208344-51.3041992-145.5666656-267.708313-145.5666656-274.4916382  c-32.7541656,12.5666504-64.9250031,14.3374634-102.2666702,6.9291992  c35.483345,173.8666382,130.1375122,242.8416138,135.3374939,248.0332642  C119.6458359,869.0041504,77.2166672,686.2042236,77.2166672,686.2042236  c-24.2374992,2.1832275-49.8708344-0.145874-72.0999985-6.9291992C8.3708363,688.7166748,116.1291656,1000,434.6166382,1000  c318.4833374,0,426.2750244-311.2833252,429.500061-320.7249756  C841.8833618,686.0583496,816.25,688.3874512,792.0125122,686.2042236z"/><path d="M714.2457886,228.1750031C627.0916748,230.625,603.0541992,212.625,599.479187,211.7416687  c0.9624634,2.0375061,28.5125122,62.6666565,35.604187,119.1625061c7.0874634,56.4958191-2.0917358,120.8416443-0.875,178.3166504  c11.249939,148.395813,120.8666382,145.7999878,127.5249023,147.3625488  C720.2042236,626.1416626,653.916687,547.5750122,669.7542114,434.3125  c1.1583252,7.6416626-1.7458496,195.3666382,199.4790649,222.7457886  C850.4874878,646.8833008,709.5958252,511.6958313,714.2457886,228.1750031z"/><path d="M199.4791718,434.3416748C215.3166656,547.5750122,149.0583344,626.1416626,107.5,656.6166382  c6.6541672-1.562439,116.2749939,1.0625,127.5208435-147.3666382c1.2499847-57.5041809-7.9333344-121.8166809-0.8708496-178.3166809  c7.0916595-56.4999695,34.6416626-117.1249847,35.6000061-119.1624908  c-3.6041565,0.9166565-27.6083374,18.8833313-114.7624969,16.4333496C159.6374969,511.7291565,18.7458344,646.9083252,0,657.0874634  C201.2208405,629.708313,198.3166656,441.9791565,199.4791718,434.3416748z"/><path d="M460.7166443,672.1333618c-4.5083008-4.4833984-8.6041565-5.6917114-14.3874817-5.3708496  c-1.9166565,0.0916138-21.5083313,0.0916138-23.4249878,0c-5.7833557-0.3208618-9.8791809,0.8874512-14.3875122,5.3708496  c-7.8708496,7.8166504-40.625,42.6916504-34.8416748,72.9624634c10.7500305,56.3791504,60.9416504,130.104187,60.9416504,130.104187  s50.1583557-73.7250366,60.9417114-130.104187C501.3416748,714.8250122,468.6208191,679.9500122,460.7166443,672.1333618z"/><path d="M421.4833374,56.2041664C382.25,63.0750008,336.6791992,70.7791672,287.0416565,106.5041656  c23.6875-26.6999969,67.5083618-76.8541641,147.5749817-76.8541641c80.0625,0,123.9458618,53.1041641,147.6333618,79.8333282  c-49.6708374-35.7874985-95.2333069-46.408329-134.4999695-53.2791634  c76.6957703,91.3083344,168.4124451,142.5874939,291.1708069,151.1416626C627.208313,159.1083374,615.4083252,0,434.6166382,0  S242.0250092,159.1083374,130.3125,207.3166504c122.7541656-8.5541534,213.1374817-58.7416534,291.1708374-151.1416473V56.2041664z"/><path d="M434.6166382,605.5166626C326.0416565,556.395874,324.5583496,708.6583252,324.1500244,751.4375  c48.9124756-83.9916992,72.0791321-123.229187,93.6374817-112.520874c12.0916443,5.9875488,21.2749634,6.4875488,33.6583252,0  c21.3291626-11.2124634,44.7250061,28.5291748,93.6333313,112.520874  C544.6749878,708.6583252,543.625,557.1624756,434.6166382,605.5166626z"/><path d="M559.145874,524.9749756l10.9249268,55.6125488c0,0-65.6457825-84.8208313-105.9833069-51.8083496  c-23.833313,19.5041504-35.75,19.0291748-58.9416504,0c-39.7833557-32.6000061-105.9833374,51.8083496-105.9833374,51.8083496  l10.9249878-55.6125488c-106.0166626,63.9291992-72.9708405,192.6791992,6.541687,312.4041748  c-2.2125244-9.291687-94.5958557-310.3416748,111.4499817-257.0582886c5.5499878,1.6832886,7.5833435,1.6541138,13.0791626,0  c205.604187-53.7833862,113.6583252,247.7666016,111.4458618,257.0582886  C632.1208496,717.6541748,665.1624756,588.9041748,559.145874,524.9749756z"/><path d="M434.6166382,125.6250076c-127.6958008,0-164.6582947,190.0874939-165.8541565,195.8083191  c28.6833496-30.770813,172.8291931-53.6374817,143.8000183,58.8625183c-3.9875183,25.0124817-2.8249817,52.8916321,1.3041687,72.75  c4.125,36.6416321-14.0916748,13.8958435-16.7374878,11.416687c-13.0499878-12.3291931-33.5083313,17.6166382-17.9625244,22.541626  c41.7625122,13.3041687,35.0791931,32.4833374,55.4499817,32.4833374c20.3708496,0,13.6875305-19.1791687,55.4500122-32.4833374  c15.5458374-4.9249878-4.9125061-34.8708191-17.9624939-22.541626c-2.645813,2.4791565-20.8624878,25.2249451-16.7374878-11.416687  c4.1291504-19.8583679,5.2916565-47.7375183,1.3083496-72.75c-29.0291748-112.5,115.1124573-89.6333313,143.7958069-58.8625183  C599.2791748,315.7124939,562.3125,125.6250076,434.6166382,125.6250076z"/><path d="M497.0416565,442.8083496c29.6708679,25.3416748,11.0958557,45.4958191,34.9624939,55.2874756  c18.1916504,7.4666748,21.6749878-0.8541565,29.7000122-25.2541504  c8.0166626-24.4000244,45.4499512-38.9750061,39.4041748-99.604187c-1.333313-15.5749817-19.6166382-20.5916443-35.1625366-12.0625  c-28.9749756,15.8999939-51.208313,4.7166748-63.9958191-4.2208252  c-32.1124573-17.1083374-29.7583313,64.6125183-4.9083252,85.8250122V442.8083496z"/><path d="M307.5,472.8708191c8.0208435,24.3999939,11.5083008,32.7208557,29.7000122,25.2541809  c23.8624878-9.7958374,5.2916565-29.9749756,34.9624939-55.2874756  c24.8458252-21.2124939,27.1999817-102.9333801-4.9125061-85.8250122c-12.8125,8.9374695-35.0458374,20.125-63.9916687,4.2207947  c-15.5500183-8.5291443-33.8291626-3.5124512-35.1666565,12.0666809C262.0499878,433.9541626,299.4791565,448.5,307.5,472.8999939  V472.8708191z"/><path d="M510,336.0375061h46.8791504C533.5708618,324,520.4333496,324.2666626,510,336.0375061z"/><path d="M312.3250122,336.0375061h46.875C348.7374878,324.2666626,335.6041565,324,312.3250122,336.0375061z"/></svg>
);

const LovableLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Lovable Pro logo"><defs><radialGradient id="lovableGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-1 22.49999 -30.45394 -1.3535 14 3)"><stop offset=".25" stopColor="#FE7B02"/><stop offset=".433" stopColor="#FE4230"/><stop offset=".548" stopColor="#FE529A"/><stop offset=".654" stopColor="#DD67EE"/><stop offset=".95" stopColor="#4B73FF"/></radialGradient></defs><path clipRule="evenodd" fillRule="evenodd" fill="url(#lovableGrad)" d="M7.082 0c3.91 0 7.081 3.179 7.081 7.1v2.7h2.357c3.91 0 7.082 3.178 7.082 7.1 0 3.923-3.17 7.1-7.082 7.1H0V7.1C0 3.18 3.17 0 7.082 0z"/></svg>
);

const MidjourneyLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Midjourney logo"><path fill="#000000" d="M22.36 19.06H1.64a.45.45 0 0 1-.39-.68l.83-1.42a.45.45 0 0 1 .78 0l.56.95h17.16l.56-.95a.45.45 0 0 1 .78 0l.83 1.42a.45.45 0 0 1-.39.68Z"/><path fill="#000000" d="M18.15 11.28 12 2.06 5.85 11.28a.45.45 0 0 0 .37.7h11.56a.45.45 0 0 0 .37-.7Zm-6.15-6.4 3.8 5.68H8.2L12 4.88Z"/></svg>
);

const OpenAiLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="ChatGPT (OpenAI) logo"><path fill="#000000" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>
);

const LinkedInLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="LinkedIn logo"><rect width="24" height="24" rx="4.5" fill="#0A66C2"/><text x="12" y="17.2" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,Helvetica,sans-serif">in</text></svg>
);

const CanvaLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Canva logo"><defs><linearGradient id="canvaGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00C4CC"/><stop offset="1" stopColor="#7D2AE8"/></linearGradient></defs><circle cx="12" cy="12" r="11.5" fill="url(#canvaGrad)"/><text x="12" y="15.2" textAnchor="middle" fontSize="5.9" fontWeight="700" fontStyle="italic" fill="#FFFFFF" fontFamily="Georgia,serif">Canva</text></svg>
);

const PrimeVideoLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Prime Video logo"><rect width="24" height="24" rx="5" fill="#00A8E1"/><path fill="#FFFFFF" d="M9.2 6.2v8.4c0 .6.65.97 1.16.65l7-4.2c.5-.3.5-1.02 0-1.32l-7-4.2c-.51-.3-1.16.07-1.16.67z"/><path d="M5.5 17.6c2.8 2 8.2 2.3 12.2.1" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/><path d="M16.6 16.4l1.9-.3-.5 1.8" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const AdobeLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Adobe logo"><path fill="#EB1000" fillRule="evenodd" d="M14.86 3H23v19zM9.14 3H1v19zM11.992 9.998 17.182 22h-3.394l-1.549-3.813h-3.79z"/></svg>
);

const PremiereProLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Adobe Premiere Pro logo"><rect width="24" height="24" rx="4.5" fill="#00005B"/><text x="12" y="17" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#9999FF" fontFamily="Arial,Helvetica,sans-serif">Pr</text></svg>
);

const WorkspaceLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Google Workspace logo"><path fill="#1FA463" d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.8 789.8 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.9 423.9 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z"/></svg>
);

const OfficeLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Microsoft Office logo"><rect x="0.5" y="0.5" width="11" height="11" rx="2" fill="#2B579A"/><rect x="12.5" y="0.5" width="11" height="11" rx="2" fill="#217346"/><rect x="0.5" y="12.5" width="11" height="11" rx="2" fill="#D24726"/><rect x="12.5" y="12.5" width="11" height="11" rx="2" fill="#EB3C00"/><text x="6" y="9.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,sans-serif">W</text><text x="18" y="9.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,sans-serif">X</text><text x="6" y="21.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,sans-serif">P</text><text x="18" y="21.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,sans-serif">O</text></svg>
);

const CapCutLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="CapCut logo"><path fill="#000000" fillRule="evenodd" d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828-7.742 4.057-7.825-4.057h15.567z"/></svg>
);

const MuseAiLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="MuseAI logo"><defs><linearGradient id="museGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7C6CFF"/><stop offset="1" stopColor="#B16CFF"/></linearGradient></defs><path fill="url(#museGrad)" d="M5.91 3.869c.867 0 1.486.677 1.486 1.738 0 1.062-.171 2.019-.455 4.052-.203 1.425-.552 3.599-.698 4.503.28-.534.935-1.784 1.051-2.018 1.372-2.769 2.802-5.243 3.214-5.898.546-.874 1.027-1.225 1.77-1.225.386.001.846.196 1.074.456.308.352.373.921.362 1.542-.016.951-.14 2.467-.309 4.158-.075.752-.22 2.289-.318 3.319.878-1.571 2.504-4.461 3.159-5.471.571-.879 1.146-1.466 1.918-1.466.666 0 1.487.471 1.439 1.723-.072 1.847-.339 5.872-.46 7.677.817-1.189 1.89-2.95 2.293-3.612.406-.669.824-1.21 1.458-1.228.65-.018 1.085.424 1.105 1.106.02.683-.387 1.45-.927 2.321-.586.946-1.384 2.0-2.182 2.945-.797.945-1.734 1.663-2.852 1.663-1.002 0-1.668-.666-1.717-1.885-.026-.639.095-2.012.186-3.086.106-1.243.234-2.443.323-3.237-.881 1.612-2.735 4.986-3.569 6.307-.816 1.29-1.216 1.744-2.079 1.745-.862 0-1.483-.621-1.497-1.555-.014-1.012.247-7.095.505-9.122-.418 1.048-1.462 3.242-2.086 4.547-.623 1.305-1.247 2.608-2.292 3.871-.759 1.258-1.518 1.89-2.427 1.89-.91 0-1.424-.612-1.424-1.596s.285-2.623.591-4.656c.153-.984.328-2.056.525-3.193.144-.822.394-2.27.548-3.159-.7 1.09-1.959 3.052-2.342 3.643-.427.657-.809 1.135-1.443 1.135-.699 0-1.115-.545-1.115-1.179S.322 9.848.846 8.988C1.518 7.883 2.726 6.377 3.388 5.586 4.168 4.654 4.947 3.869 5.91 3.869Z"/></svg>
);

const PikaLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Pika logo"><path fill="#000000" fillRule="evenodd" d="M.661 19.889h8.666c-.14-1.41-1.145-2.955-3.601-4.007v-.104c2.863.88 3.893 2.386 4.312 4.11H20.73l-1.72-1.476C20.017 15.244 24 13.747 24 13.747c-.141-2.541-1.441-4.909-5.787-6.827L8.326 3c.331 4.179 1.811 6.575 5.523 7.163v.102c-2.579-.064-4.368-1.216-5.275-3.588C.698 8.123-1.201 14.156.66 19.889z"/></svg>
);

const RunwayLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Runway logo"><path fill="#000000" fillRule="evenodd" d="M17.86 22.992c-2.669.245-4.887-2.876-6.597-4.454C10.398 24.759 1 24.177 1 17.86V6.15c0-.921.244-1.861.733-2.65C2.635 1.977 4.383.98 6.15 1h11.71c6.316 0 6.918 9.398.677 10.243l2.97 2.951c3.252 3.064.808 8.929-3.646 8.797zm-1.428-3.721c1.842 1.898 4.774-1.034 2.876-2.876l-5.132-5.132H11.3v2.876l4.436 4.436.696.696zM4.12 17.842c-.037 2.632 4.117 2.632 4.06 0V6.132c.038-1.316-1.353-2.35-2.612-1.955-.057.019-.113.037-.15.056-.79.301-1.335 1.09-1.317 1.936v11.673h.02zm13.74-9.68c2.632.037 2.632-4.098 0-4.06h-6.973c.526 1.109.395 2.857.413 4.06h6.56z"/></svg>
);

const VidIqLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="vidIQ logo"><text x="12" y="15.8" textAnchor="middle" fontSize="6.7" fontWeight="800" fill="#111827" fontFamily="Arial,Helvetica,sans-serif">vid<tspan fill="#7B2CBF">IQ</tspan></text></svg>
);

const VidIqMaxLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="vidIQ Max logo"><text x="12" y="13.3" textAnchor="middle" fontSize="6.7" fontWeight="800" fill="#111827" fontFamily="Arial,Helvetica,sans-serif">vid<tspan fill="#7B2CBF">IQ</tspan></text><rect x="5" y="16" width="14" height="4.6" rx="2.3" fill="#2563EB"/><text x="12" y="19.9" textAnchor="middle" fontSize="3.6" fontWeight="800" fill="#FFFFFF" fontFamily="Arial,Helvetica,sans-serif">MAX</text></svg>
);

const HeyGenLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="HeyGen logo"><defs><linearGradient id="heyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7B2CBF"/><stop offset="1" stopColor="#00A8C0"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#heyGrad)"/><path fill="#FFFFFF" d="M9.6 7.1v9.8c0 .55.6.9 1.08.6l8-4.9c.45-.28.45-.94 0-1.22l-8-4.9c-.48-.29-1.08.06-1.08.62z"/></svg>
);

const MoreToolsLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" role="img" aria-label="More tools logo"><defs><linearGradient id="moreGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0891A5"/><stop offset="1" stopColor="#7B2CBF"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#moreGrad)"/><circle cx="6.5" cy="12" r="1.7" fill="#FFFFFF"/><circle cx="12" cy="12" r="1.7" fill="#FFFFFF"/><circle cx="17.5" cy="12" r="1.7" fill="#FFFFFF"/></svg>
);

/* ════════════════════════════════════════════════════════════════════
   MARKETPLACE DATA — 31 cards. Featured Gemini Pro Plan first.
   Every card: real official logo, category + duration badges,
   features, "Price on Request", Live Demo + Negotiate on WhatsApp.
   No prices anywhere. The "More Tools" card is always visible.
   ════════════════════════════════════════════════════════════════════ */
const TOOLS = [
  {
    id: "gemini-pro-plan",
    name: "Google Gemini Pro Plan",
    tag: "The flagship premium plan — full owner access for 18 months, private to you, with Google's most advanced AI, video, music and storage in one plan.",
    cat: "chat",
    catLabel: "AI Chat",
    badge: "Featured Premium",
    duration: "18-MONTHS PRIVATE",
    featured: true,
    logo: GeminiProSparkLogo,
    features: [
      "Full Owner Access",
      "Add 5 Family Members",
      "Deep Research",
      "Canvas",
      "Code",
      "Labs",
      "Nano Banana Pro",
      "VEO 3.1 Video Generations",
      "1K Flow Credits / Month",
      "Generate Music With AI",
      "Google Flow",
      "5 TB Google Drive Storage",
    ],
  },
  {
    id: "leonardo",
    name: "Leonardo.Ai",
    tag: "High-resolution AI art generation with elite models and priority processing.",
    cat: "image",
    catLabel: "Image Gen",
    badge: "Premium",
    duration: "1 MONTH",
    logo: LeonardoLogo,
    features: [
      "High-Resolution Art Generation",
      "Priority Processing",
      "Custom Model Training",
      "Access to Elite Models",
    ],
  },
  {
    id: "lovable",
    name: "Lovable Pro",
    tag: "Lite premium for a full year — more connections and full profile visibility.",
    cat: "coding",
    catLabel: "Coding",
    badge: "Premium",
    duration: "LITE 12 MONTHS",
    logo: LovableLogo,
    features: [
      "Premium features",
      "More Connections",
      "See Who Likes You",
      "Boost Your Profile",
    ],
  },
  {
    id: "gemini",
    name: "Gemini Advanced (Pro)",
    tag: "Google's most capable model with Workspace integration and 2TB storage.",
    cat: "chat",
    catLabel: "AI Chat",
    badge: "Bestseller",
    duration: null,
    logo: GeminiSparkLogo,
    features: [
      "Gemini Advanced access",
      "2TB Google One storage",
      "Gmail & Docs integration",
    ],
  },
  {
    id: "claude",
    name: "Claude Pro",
    tag: "Exceptional reasoning, coding and long-document analysis from Anthropic.",
    cat: "chat",
    catLabel: "AI Chat",
    badge: null,
    duration: null,
    logo: SiAnthropic,
    logoColor: "#D97757",
    features: ["Latest Claude models", "5× more usage", "Priority access"],
  },
  {
    id: "cursor",
    name: "Cursor AI Pro",
    tag: "The AI-first code editor that understands your entire codebase.",
    cat: "coding",
    catLabel: "Coding",
    badge: "Dev Favourite",
    duration: null,
    logo: SiCursor,
    logoColor: "#111827",
    features: ["Unlimited completions", "Multi-file edits", "Top model access"],
  },
  {
    id: "midjourney",
    name: "Midjourney Basic",
    tag: "Stunning, high-resolution images from simple text prompts.",
    cat: "image",
    catLabel: "Image Gen",
    badge: null,
    duration: null,
    logo: MidjourneyLogo,
    features: ["~200 generations / mo", "Commercial use", "Web app access"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Creator",
    tag: "Studio-quality AI voices and voice cloning in 29 languages.",
    cat: "audio",
    catLabel: "Audio",
    badge: "Premium",
    duration: "1 MONTH",
    logo: SiElevenlabs,
    logoColor: "#111827",
    features: [
      "AI Voice Generation",
      "Text to Speech",
      "High-Quality Voices",
      "Commercial Use",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    tag: "Faster responses, image generation and advanced reasoning tools.",
    cat: "chat",
    catLabel: "AI Chat",
    badge: "Premium",
    duration: "1 MONTH",
    logo: OpenAiLogo,
    features: ["All Premium Features", "Team Access", "Save & Create More"],
  },
  {
    id: "notion",
    name: "Notion AI + Plus",
    tag: "Write, summarise and organise your whole workspace with AI.",
    cat: "productivity",
    catLabel: "Productivity",
    badge: null,
    duration: null,
    logo: SiNotion,
    logoColor: "#111827",
    features: ["AI writing & summaries", "Unlimited blocks", "Team workspaces"],
  },
  {
    id: "youtube",
    name: "YouTube Premium",
    tag: "Ad-free video, background play, downloads and YouTube Music.",
    cat: "entertainment",
    catLabel: "Entertainment",
    badge: "Premium",
    duration: "1 MONTH",
    logo: SiYoutube,
    logoColor: "#FF0000",
    features: [
      "Ad-Free Videos",
      "Background Play",
      "YouTube Music Premium",
      "Offline Downloads",
    ],
  },
  {
    id: "coursera",
    name: "Coursera Premium",
    tag: "World-Class Learning from top universities and companies, on your schedule.",
    cat: "learning",
    catLabel: "Learning",
    badge: "Premium",
    duration: "1 YEAR",
    logo: SiCoursera,
    logoColor: "#0056D2",
    features: [
      "Unlimited Access to 7,000+ Courses",
      "Professional Certificates",
      "Degrees Credit Eligible",
      "Job-Ready Skills",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Premium",
    tag: "Grow Your Career Faster with Premium insights, InMail and learning.",
    cat: "career",
    catLabel: "Career",
    badge: "Premium",
    duration: "1 MONTH / 3 MONTHS",
    logo: LinkedInLogo,
    features: [
      "Who Viewed You",
      "InMail Access",
      "Career Growth",
      "Advanced Insights",
    ],
  },
  {
    id: "surfshark",
    name: "Surfshark",
    tag: "Online Privacy Without Limits on unlimited devices with one account.",
    cat: "vpn",
    catLabel: "VPN & Privacy",
    badge: "Premium",
    duration: "2 MONTHS • Private",
    logo: SiSurfshark,
    logoColor: "#1EBFBF",
    features: [
      "Secure VPN",
      "Strict No-Logs Policy",
      "Camouflage Mode",
      "CleanWeb Ad-Block",
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    tag: "Unlimited Entertainment — movies, series and originals on any screen.",
    cat: "streaming",
    catLabel: "Streaming",
    badge: "Premium",
    duration: "1 MONTH",
    logo: SiNetflix,
    logoColor: "#E50914",
    features: ["Premium Screen", "Full HD / 4K", "Private Access"],
  },
  {
    id: "capcut",
    name: "CapCut Pro",
    tag: "Edit Like a Pro with premium effects, templates and cloud storage.",
    cat: "video",
    catLabel: "Video",
    badge: "Premium",
    duration: "1 MONTH",
    logo: CapCutLogo,
    features: ["No Watermark", "All Pro Features", "Premium Access"],
  },
  {
    id: "canva",
    name: "Canva Pro",
    tag: "Design Without Limits with premium templates, brand kits and AI tools.",
    cat: "design",
    catLabel: "Design",
    badge: "Premium",
    duration: "1 YEAR",
    logo: CanvaLogo,
    features: ["No Watermark", "All Pro Features", "Premium Access"],
  },
  {
    id: "primevideo",
    name: "Prime Video",
    tag: "Movies, Shows, Originals — stream and download across all your devices.",
    cat: "streaming",
    catLabel: "Streaming",
    badge: "Premium",
    duration: "1 MONTH",
    logo: PrimeVideoLogo,
    features: ["Premium Access", "All Content", "Private Account"],
  },
  {
    id: "museai",
    name: "MuseAI",
    tag: "Create Without Limits — AI writing, images and creative tools in one suite.",
    cat: "image",
    catLabel: "Image Gen",
    badge: null,
    duration: null,
    logo: MuseAiLogo,
    features: [
      "AI writing & image tools",
      "Creative templates library",
      "Fast content generation",
    ],
  },
  {
    id: "pika",
    name: "Pika",
    tag: "AI Video Generation that turns text and images into striking clips.",
    cat: "video",
    catLabel: "Video",
    badge: null,
    duration: null,
    logo: PikaLogo,
    features: [
      "Text-to-video generation",
      "Image-to-video animation",
      "Cinematic effects & styles",
    ],
  },
  {
    id: "runway",
    name: "Runway",
    tag: "Video Creation powered by Gen AI models, editing and effects.",
    cat: "video",
    catLabel: "Video",
    badge: null,
    duration: null,
    logo: RunwayLogo,
    features: [
      "Gen video models access",
      "AI editing & effects suite",
      "Text & image to video",
    ],
  },
  {
    id: "nordvpn",
    name: "NordVPN",
    tag: "Online Privacy & Security with ultra-fast, encrypted connections worldwide.",
    cat: "vpn",
    catLabel: "VPN & Privacy",
    badge: "Premium",
    duration: "3 MONTHS • Private",
    logo: SiNordvpn,
    logoColor: "#4687FF",
    features: [
      "Ultra-Fast VPN",
      "Secure & Private",
      "Access Global Content",
      "No-Logs Policy",
    ],
  },
  {
    id: "adobecc",
    name: "Adobe Creative Cloud",
    tag: "Creative Cloud & More — Photoshop, Illustrator, Premiere and 20+ apps.",
    cat: "design",
    catLabel: "Design",
    badge: null,
    duration: null,
    logo: AdobeLogo,
    features: [
      "20+ creative apps included",
      "Photoshop, Illustrator & more",
      "Cloud storage & Adobe Fonts",
    ],
  },
  {
    id: "vidiq",
    name: "vidIQ",
    tag: "Grow Your YouTube Channel with keyword research, analytics and AI coaching.",
    cat: "social",
    catLabel: "Social & Growth",
    badge: null,
    duration: null,
    logo: VidIqLogo,
    features: [
      "Keyword & competitor research",
      "Real-time channel analytics",
      "AI video ideas & titles",
    ],
  },
  {
    id: "heygen",
    name: "HeyGen",
    tag: "AI Avatars & Videos — studio-quality presenter videos without a camera.",
    cat: "video",
    catLabel: "Video",
    badge: "Premium",
    duration: "1 MONTH",
    logo: HeyGenLogo,
    features: [
      "AI Video Generation",
      "Realistic Avatars",
      "Text to Video",
      "120+ Languages",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok UK Accounts",
    tag: "Grow Your Presence with ready-to-use UK TikTok accounts for creators and brands.",
    cat: "social",
    catLabel: "Social & Growth",
    badge: null,
    duration: null,
    logo: SiTiktok,
    logoColor: "#111827",
    features: [
      "UK-based accounts",
      "Ready for posting & growth",
      "Setup guidance included",
    ],
  },
  {
    id: "vidiqmax",
    name: "vidIQ Max",
    tag: "Advanced Analytics for serious creators — deeper data, coaching and AI tools.",
    cat: "social",
    catLabel: "Social & Growth",
    badge: "Premium",
    duration: "MAX PLAN",
    logo: VidIqMaxLogo,
    features: [
      "Advanced Keyword Research",
      "Competitor Tracking",
      "Video Performance Insight",
      "Bulk Optimization Tools",
    ],
  },
  {
    id: "premierepro",
    name: "Adobe Premiere Pro",
    tag: "Edit. Create. Inspire. — professional video editing used by filmmakers worldwide.",
    cat: "video",
    catLabel: "Video",
    badge: "Premium",
    duration: "1 MONTH",
    logo: PremiereProLogo,
    features: [
      "Industry Standard Video Editing",
      "Creative Cloud Integration",
      "Pro Level Features",
      "Faster Export Times",
    ],
  },
  {
    id: "workspace",
    name: "Google Workspace",
    tag: "Work Smarter with Gmail, Drive, Docs, Meet and business storage together.",
    cat: "productivity",
    catLabel: "Productivity",
    badge: null,
    duration: null,
    logo: WorkspaceLogo,
    features: ["Business Gmail & Meet", "Drive cloud storage", "Docs, Sheets & Slides"],
  },
  {
    id: "office",
    name: "Microsoft Office",
    tag: "Boost Productivity with Word, Excel, PowerPoint, Outlook and cloud storage.",
    cat: "productivity",
    catLabel: "Productivity",
    badge: "Premium",
    duration: "1 YEAR",
    logo: OfficeLogo,
    features: [
      "Word",
      "Excel",
      "PowerPoint",
      "1TB OneDrive Cloud Storage",
      "Premium Templates",
      "Cross-Device Use",
    ],
  },
  {
    id: "more",
    name: "More Tools & Many More",
    tag: "Looking for something else? We stock 50+ tools and add new ones on request — just ask.",
    cat: "all",
    catLabel: "Everything Else",
    badge: null,
    duration: null,
    logo: MoreToolsLogo,
    more: true,
    features: [
      "50+ tools available on request",
      "New tools added weekly",
      "Tell us what you need",
    ],
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "chat", label: "AI Chat" },
  { id: "image", label: "Image Gen" },
  { id: "coding", label: "Coding" },
  { id: "audio", label: "Audio" },
  { id: "entertainment", label: "Entertainment" },
  { id: "streaming", label: "Streaming" },
  { id: "design", label: "Design" },
  { id: "video", label: "Video" },
  { id: "learning", label: "Learning" },
  { id: "vpn", label: "VPN & Privacy" },
  { id: "social", label: "Social & Growth" },
  { id: "productivity", label: "Productivity" },
  { id: "career", label: "Career" },
];

const NAV_LINKS = [
  { id: "tools", label: "AI Tools" },
  { id: "webdev", label: "Web Dev" },
  { id: "software", label: "Software Dev" },
  { id: "ads", label: "Meta Ads" },
  { id: "pricing", label: "Pricing" },
  { id: "cases", label: "Case Studies" },
];

const SERVICES = [
  {
    id: "webdev",
    icon: Globe,
    title: "Custom Web Development",
    desc: "High-speed, SEO-optimised, animated websites that convert visitors into customers.",
    features: [
      "Next.js / React web apps",
      "E-commerce platforms",
      "Landing pages that sell",
      "Blog setup & uploads",
    ],
    cta: "Start a Website",
    wa: "Hello Feathered Experts Pro! I want a custom website built. Please share the details so we can negotiate on WhatsApp.",
  },
  {
    id: "software",
    icon: Cpu,
    title: "Custom Software Development",
    desc: "Full-stack products and automations that remove manual work from your business.",
    features: [
      "Enterprise software & SaaS MVPs",
      "Custom AI integrations",
      "Automated workflows",
      "APIs & dashboards",
    ],
    cta: "Build Software",
    wa: "Hello Feathered Experts Pro! I want custom software / a SaaS MVP built. Please share the details so we can negotiate on WhatsApp.",
  },
  {
    id: "ads",
    icon: Megaphone,
    title: "Meta Ads & Performance Marketing",
    desc: "Facebook & Instagram campaigns engineered for measurable return, not vanity metrics.",
    features: [
      "AI-driven audience targeting",
      "Creative testing & scaling",
      "Real-time ROAS tracking",
      "Retargeting funnels",
    ],
    cta: "Scale With Ads",
    wa: "Hello Feathered Experts Pro! I want Meta Ads & performance marketing for my brand. Please share the details so we can negotiate on WhatsApp.",
  },
];

const COUNTERS = [
  { value: 50, suffix: "+", decimals: 0, label: "AI tools ready for instant activation, plus new tools added on request." },
  { value: 99.9, suffix: "%", decimals: 1, label: "Uptime target across hosted sites & dashboards." },
  { value: 4.8, suffix: "×", decimals: 1, label: "Average Meta Ads ROAS across managed campaigns." },
];

const COMPARE_ROWS = [
  { label: "Page speed", us: "98 / 100" },
  { label: "Delivery speed", us: "2–3× faster" },
  { label: "Support response", us: "Same day" },
];

const CASES = [
  {
    stat: "+184%",
    title: "E-commerce rebuild",
    desc: "Next.js storefront rebuild + Meta Ads relaunch lifted revenue in one quarter.",
  },
  {
    stat: "38 hrs/wk",
    title: "Automation saved",
    desc: "Custom AI workflow for a services firm replaced manual reporting & follow-ups.",
  },
  {
    stat: "4.8× ROAS",
    title: "Ads scaling",
    desc: "Creative testing system scaled a local brand from small tests to sustained profit.",
  },
];

const TRUST = [
  {
    icon: Check,
    title: "Trusted by 1000+ Happy Clients",
    desc: "Real buyers across AI tools, websites and ads.",
    stars: true,
  },
  {
    icon: Sparkles,
    title: "Private Accounts",
    desc: "Private & Secure — personal use, set up for you only.",
  },
  {
    icon: Zap,
    title: "Fast & Instant Delivery",
    desc: "Activation sent fast once your price is agreed on WhatsApp.",
  },
  {
    icon: Clock,
    title: "24/7 Customer Support",
    desc: "Real human help on WhatsApp, day and night.",
  },
];

const SUB_PLANS = [
  {
    name: "Starter",
    desc: "For solo creators getting AI leverage.",
    features: ["2 AI tool subscriptions", "Setup assistance", "Email support"],
  },
  {
    name: "Pro",
    desc: "For teams who live in AI tools daily.",
    badge: "Most Popular",
    features: [
      "6 AI tool subscriptions",
      "Priority WhatsApp support",
      "Monthly workflow tips",
      "Warranty cover included",
    ],
  },
  {
    name: "Enterprise",
    desc: "For companies standardising on AI.",
    features: ["Unlimited tool requests", "Team onboarding", "Dedicated manager"],
  },
];

const AGENCY_PLANS = [
  {
    name: "Launch Project",
    desc: "A complete website or landing system, delivered fast.",
    features: ["Custom design + build", "SEO foundations", "Blog & CMS setup"],
  },
  {
    name: "Growth Retainer",
    desc: "Dev + Meta Ads + content, one monthly engine.",
    badge: "Best for Growth",
    features: [
      "Meta Ads management",
      "Ongoing web improvements",
      "Blog uploads & content",
      "Weekly performance reports",
    ],
  },
  {
    name: "Scale / Custom",
    desc: "Software, AI integrations and full-funnel growth.",
    features: ["Custom software build", "AI integrations", "SLA & priority delivery"],
  },
];

const TESTIMONIALS = [
  {
    text: "They rebuilt our store and our ROAS jumped within weeks. Fast, honest, and the dashboard alone is worth it.",
    name: "Sarah K.",
    role: "E-commerce Founder",
  },
  {
    text: "Got Claude, Cursor and Gemini set up the same day. The automation workflows saved our ops team hours every week.",
    name: "Ahmed R.",
    role: "SaaS Operator",
  },
  {
    text: "Our Meta Ads finally make sense. Weekly reports, creative tests, real numbers — 4×+ return and climbing.",
    name: "Priya M.",
    role: "D2C Brand Lead",
  },
  {
    text: "Blog uploads, website updates, ads — one team handles our entire digital presence. It feels feather-light for us.",
    name: "Daniel O.",
    role: "Agency Partner",
  },
  {
    text: "The new site loads instantly and looks like a 4K product launch. Clients mention it on almost every call.",
    name: "Lena T.",
    role: "Consultant",
  },
  {
    text: "From MVP idea to launched SaaS in weeks, with AI built in from day one. Exactly the partner we needed.",
    name: "Omar S.",
    role: "Startup Founder",
  },
];

const BRANDS = ["SmartStream", "Feathered NEWS", "NorthPeak", "Lumen Co", "Atlas D2C", "Vertex Labs"];

const SOCIALS = [
  { label: "YouTube", href: "http://www.youtube.com/@SmartSteamAutomation", Icon: FaYoutube },
  { label: "Instagram", href: "https://www.instagram.com/smartstreamsoftwaretools", Icon: FaInstagram },
  { label: "TikTok", href: "https://www.tiktok.com/@smart.steam.autom", Icon: FaTiktok },
  { label: "X", href: "https://x.com/SmartSteamX", Icon: FaXTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-mubashir-483b6b392", Icon: FaLinkedinIn },
  { label: "Facebook", href: "https://www.facebook.com", Icon: FaFacebookF },
];

const HERO_STATS = [
  { value: "50+", label: "AI tools ready" },
  { value: "120+", label: "Projects shipped" },
  { value: "4.8×", label: "Avg. Meta Ads ROAS" },
  { value: "24/7", label: "Support on WhatsApp" },
];

/* ════════════════════════════════════════════════════════════════════
   HOOKS & SHARED PIECES
   ════════════════════════════════════════════════════════════════════ */

/* Light mode is the default on every fresh load: the state starts at
   "light", nothing is read from localStorage and nothing reads
   prefers-color-scheme, so the page can never open dark. The header
   toggle switches to dark for that visit only. */
function useTheme() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }, [theme]);
  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);
  return { theme, toggle, isDark: theme === "dark" };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useEscape(handler, active) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

function useScrollSpy(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* 3D tilt + cursor glare — desktop fine pointers only, disabled when the
   user prefers reduced motion. rAF-throttled so pointer moves stay at
   60fps; rotation is applied to the element while the glare position is
   exposed as --mx/--my custom properties for the .fe-glare overlay. */
function useTilt(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      return undefined;
    }
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let mx = 50;
    let my = 50;
    const apply = () => {
      raf = 0;
      el.style.transform = `perspective(900px) rotateY(${(tx * 7).toFixed(2)}deg) rotateX(${(-ty * 7).toFixed(2)}deg) translateY(-2px)`;
      el.style.setProperty("--mx", `${mx.toFixed(1)}%`);
      el.style.setProperty("--my", `${my.toFixed(1)}%`);
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.style.transform = "";
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, enabled]);
}

/* Animated counter — counts up once when it scrolls into view. */
const Counter = React.memo(function Counter({ value, suffix = "", decimals = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      setVal(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className={className ? `fe-num ${className}` : "fe-num"}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
});

/* Scroll-reveal wrapper (framer-motion, 60fps, respects reduced motion). */
const Reveal = React.memo(function Reveal({ children, delay = 0, className = "", y = 26 }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
});

/* Particle feather-wave canvas — a neural-network particle field with
   three sine "feather" waves that react to the cursor. Theme-aware:
   colours follow the current theme, and it redraws on theme change.
   Renders a single static frame when reduced motion is preferred. */
function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let W = 0;
    let H = 0;
    let pts = [];
    let mx = -999;
    let my = -999;
    let t = 0;
    let raf = 0;

    const seed = () => {
      const n = Math.min(110, Math.max(36, Math.floor((W * H) / 16000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() > 0.5,
      }));
    };

    // DPR-aware sizing: crisp on Retina / 4K (devicePixelRatio capped at 2).
    // All drawing stays in CSS pixels via setTransform; resize is debounced
    // and a static frame is redrawn for reduced-motion users.
    let resizeTimer = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduced) draw();
      }, 120);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      const dark = themeRef.current === "dark";
      const waveA = dark ? "rgba(0,240,255,.20)" : "rgba(8,145,165,.28)";
      const waveB = dark ? "rgba(123,44,191,.16)" : "rgba(123,44,191,.22)";
      const linkRGB = dark ? "0,240,255" : "8,145,165";
      const dotA = dark ? "rgba(0,240,255,.85)" : "rgba(8,145,165,.75)";
      const dotB = dark ? "rgba(157,78,221,.85)" : "rgba(124,58,237,.75)";

      for (let row = 0; row < 3; row += 1) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 14) {
          let y = H * 0.62 + row * 36 + Math.sin(x * 0.008 + t * 2 + row) * 22 + Math.sin(x * 0.02 - t) * 8;
          const dx = x - mx;
          const dy = y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) y -= (140 - d) * 0.35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = row === 0 ? waveA : waveB;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i];
        for (let j = i + 1; j < pts.length; j += 1) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 11000) {
            ctx.strokeStyle = `rgba(${linkRGB},${(0.14 * (1 - d2 / 11000)).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 130 && md > 1) {
          p.x += (mdx / md) * 0.7;
          p.y += (mdy / md) * 0.7;
        }
        ctx.fillStyle = p.hue ? dotA : dotB;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };

    resize();
    draw();
    // Pause the animation loop while the tab is hidden (battery + CPU).
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced) {
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  useEffect(() => {
    // Redraw once on theme change (static frame for reduced motion).
    if (!reduced) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ev = new Event("resize");
    window.dispatchEvent(ev);
    return undefined;
  }, [theme, reduced]);

  return <canvas ref={canvasRef} className="fe-particles" aria-hidden="true" />;
}

/* Link that uses react-router when inside a router, plain <a> otherwise. */
const SmartLink = React.memo(({ to, children, ...props }) => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
});

/* The white feather on black — always inside a black rounded tile. */
const FeatherLogoTile = React.memo(function FeatherLogoTile({ size = "md", className = "" }) {
  const dims = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black shadow-lg shadow-cyan-500/20 ring-1 ring-white/10 ${dims} ${className}`}>
      <img src={featherLogo} alt="Feathered Experts Pro logo" className="h-full w-full object-cover" />
    </span>
  );
});

const SectionHead = React.memo(function SectionHead({ eyebrow, title, sub, align = "center" }) {
  return (
    <Reveal className={`mb-10 ${align === "center" ? "text-center" : "text-left"} 3xl:mb-14`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--cyan-dark)] 3xl:text-sm">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl 3xl:text-5xl">
        {title}
      </h2>
      {sub ? (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] 3xl:text-lg">
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
});

/* One marketplace card — logo tile, badges, features, Price on Request,
   Live Demo + Negotiate on WhatsApp. 3D tilt + cursor glare on hover
   (desktop fine pointers only); the tilt lives on an inner div so it
   never fights framer-motion's reveal transform on the outer article.
   Memoised so filtering/search only re-renders the cards that change.
   Card content is unchanged from the source — same fields (catLabel,
   tag, badge, duration, features), same labels, same handlers. */
const ToolCard = React.memo(function ToolCard({ tool, onDemo, onBuy, index }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useTilt(ref, !reduced);
  const Logo = tool.logo;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      aria-label={tool.name}
      className={`${
        tool.featured ? "sm:col-span-2 lg:col-span-2 3xl:col-span-2" : ""
      }`}
    >
      <div
        ref={ref}
        className="fe-card fe-tilt tilt group relative flex h-full flex-col rounded-3xl p-5"
      >
        <span className="fe-glare" aria-hidden="true" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-md ring-1 ring-black/5">
            <Logo
              className="h-9 w-9 shrink-0"
              style={tool.logoColor ? { color: tool.logoColor } : undefined}
            />
          </span>
          <span className="rounded-full bg-[var(--chip)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
            {tool.catLabel}
          </span>
        </div>

        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-extrabold leading-snug text-[var(--ink)]">{tool.name}</h3>
          {tool.badge ? (
            <span className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              {tool.badge}
            </span>
          ) : null}
        </div>
        {tool.duration ? (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--cyan-dark)]">
            {tool.duration}
          </p>
        ) : null}
        <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">{tool.tag}</p>

        <ul className="mb-5 space-y-1.5">
          {tool.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink2)]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <p className="mb-3 text-base font-extrabold text-[var(--ink)]">
            Price on Request
            <span className="ml-2 text-xs font-semibold text-[var(--muted)]">
              Negotiate on WhatsApp
            </span>
          </p>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => onDemo(tool)}
              aria-label={`Live demo of ${tool.name}`}
              className="btn-ghost min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm font-bold"
            >
              Live Demo
            </button>
            <button
              type="button"
              onClick={() => onBuy(tool)}
              aria-label={tool.more ? "Ask about other tools on WhatsApp" : `Negotiate ${tool.name} on WhatsApp`}
              className="btn-primary min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm font-bold"
            >
              <FaWhatsapp className="mr-1.5 inline h-4 w-4" />
              {tool.more ? "Ask About Other Tools on WhatsApp" : "Negotiate on WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function FeatheredExpertsPro() {
  const { theme, toggle, isDark } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [agency, setAgency] = useState(false);
  const [toast, setToast] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef(null);
  const dashRef = useRef(null);
  const dashWrapRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3400);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Favicon — the feather logo, set once. */
  useLayoutEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = featherLogo;
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dashParallax = useTransform(scrollYProgress, [0, 0.35], [0, -30]);

  const activeSection = useScrollSpy([
    "tools",
    "webdev",
    "software",
    "ads",
    "pricing",
    "cases",
    "contact",
  ]);
  useLockBody(drawerOpen);
  useEscape(useCallback(() => setDrawerOpen(false), []), drawerOpen);

  /* 3D tilt for the hero dashboard (desktop, fine pointer only). */
  useEffect(() => {
    const dash = dashRef.current;
    const wrap = dashWrapRef.current;
    if (!dash || !wrap || reduced) return undefined;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      return undefined;
    }
    const onMove = (e) => {
      const r = dash.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      dash.style.transform = `rotateX(${4 - y * 8}deg) rotateY(${-6 + x * 10}deg)`;
    };
    wrap.addEventListener("pointermove", onMove);
    return () => wrap.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const visibleTools = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (t.more) return true;
      if (filter !== "all" && t.cat !== filter) return false;
      if (q && !(t.name + " " + t.tag).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, deferredQuery]);

  const handleDemo = useCallback(
    (tool) => {
      showToast(
        `Live demo: ${tool.name} — ask for a guided walkthrough in the form below and we'll show it live on a call.`
      );
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    },
    [showToast]
  );

  const handleBuy = useCallback(
    (tool) => {
      if (tool.more) {
        showToast("Opening WhatsApp — just tell us which tool you need.");
        openWhatsApp(
          "Hello Feathered Experts Pro! I am looking for a tool that is not listed on your marketplace. Please tell me what other tools you have available so we can negotiate on WhatsApp."
        );
        return;
      }
      showToast(
        `Opening WhatsApp — your message for ${tool.name} is pre-filled, just press send to negotiate your price.`
      );
      openWhatsApp(buyText(tool.name, tool.duration));
    },
    [showToast]
  );

  const scrollToId = useCallback((id) => {
    setDrawerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div data-theme={theme} className="fe-root min-h-screen overflow-x-clip bg-[var(--bg)] font-sans text-[var(--ink)] antialiased">
        <a href="#main-content" className="fe-skip-link">Skip to main content</a>
        <style>{THEME_CSS}</style>
        <div className="fe-grain" aria-hidden="true" />

        {/* Scroll progress */}
        <motion.div
          className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
          style={{ scaleX: progress }}
        />

        {/* ── STICKY GLASS NAVBAR ─────────────────────────────── */}
        <header
          className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
            scrolled ? "fe-nav-scrolled" : ""
          }`}
        >
          <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 3xl:max-w-[1500px]">
            <a
              href="#main-content"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex min-w-0 items-center gap-2.5"
              aria-label="Feathered Experts Pro — home"
            >
              <FeatherLogoTile />
              <span className="truncate text-lg font-extrabold tracking-tight text-[var(--ink)] sm:text-xl 3xl:text-2xl">
                Feathered Experts <span className="text-[var(--cyan-dark)]">Pro</span>
              </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(l.id);
                  }}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors 3xl:text-base ${
                    activeSection === l.id
                      ? "bg-[var(--chip)] text-[var(--cyan-dark)]"
                      : "text-[var(--muted)] hover:bg-[var(--chip)] hover:text-[var(--ink)]"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="fe-icon-btn"
                aria-pressed={isDark}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="btn-primary hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold sm:inline-flex 3xl:px-6 3xl:py-3 3xl:text-base"
              >
                <Rocket className="h-4 w-4" />
                Get Started
              </a>
              <button
                type="button"
                onClick={() => setDrawerOpen((o) => !o)}
                className="fe-icon-btn lg:hidden"
                aria-expanded={drawerOpen}
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* ── MOBILE DRAWER ───────────────────────────────────── */}
        <AnimatePresence>
          {drawerOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fe-drawer absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[var(--surface)] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Menu"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <FeatherLogoTile size="sm" />
                    <span className="text-base font-extrabold text-[var(--ink)]">
                      Feathered Experts Pro
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="fe-icon-btn"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.id}
                      href={`#${l.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(l.id);
                      }}
                      className="rounded-2xl px-4 py-3 text-base font-bold text-[var(--ink)] hover:bg-[var(--chip)]"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <a
                  href={waLink(
                    "Hello Feathered Experts Pro! I would like to book an agency call. Please share the available times so we can talk on WhatsApp."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-base font-bold"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Book an Agency Call
                </a>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main id="main-content">
          {/* ── HERO ──────────────────────────────────────────── */}
          <section className="fe-hero relative overflow-hidden pb-16 pt-[118px] sm:pt-[136px] 3xl:pt-[160px]">
            <div className="absolute inset-0" aria-hidden="true">
              <ParticleCanvas theme={theme} />
              <div className="fe-hero-glow" />
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] 3xl:max-w-[1500px]">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 flex flex-wrap items-center gap-2"
                >
                  <FeatherLogoTile size="sm" />
                  <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Feathered Experts Pro
                  </span>
                  <span className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    AI Tools • Websites • Meta Ads
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[var(--cyan-dark)]"
                >
                  Marketplace + Agency — One Team
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.04] tracking-tight text-[var(--ink)] 3xl:text-[5rem] 3xl:leading-[1.02]"
                >
                  Lightweight Execution.
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
                    Heavyweight Digital Dominance.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg 3xl:text-xl"
                >
                  Unlock proprietary AI tools to automate your workflow, or partner with
                  our elite engineers and Meta Ads specialists to scale your brand.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  <a
                    href="#tools"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("tools");
                    }}
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold sm:px-6 sm:py-3.5 sm:text-base 3xl:px-8 3xl:py-4 3xl:text-lg"
                  >
                    Explore AI Tools Marketplace
                    <ArrowRight className="h-5 w-5" />
                  </a>
                  <a
                    href={waLink(
                      "Hello Feathered Experts Pro! I would like to book an agency call. Please share the available times so we can talk on WhatsApp."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-bold 3xl:px-8 3xl:py-4 3xl:text-lg"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    Book an Agency Call
                  </a>
                </motion.div>

                <motion.dl
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
                >
                  <div>
                    <dt className="sr-only">AI tools ready</dt>
                    <dd className="text-2xl font-extrabold text-[var(--ink)] 3xl:text-3xl">
                      <Counter value={50} suffix="+" />
                    </dd>
                    <dd className="mt-0.5 text-xs font-semibold text-[var(--muted)]">AI tools ready</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Projects shipped</dt>
                    <dd className="text-2xl font-extrabold text-[var(--ink)] 3xl:text-3xl">
                      <Counter value={120} suffix="+" />
                    </dd>
                    <dd className="mt-0.5 text-xs font-semibold text-[var(--muted)]">Projects shipped</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Average Meta Ads ROAS</dt>
                    <dd className="text-2xl font-extrabold text-[var(--ink)] 3xl:text-3xl">
                      <Counter value={4.8} suffix="×" decimals={1} />
                    </dd>
                    <dd className="mt-0.5 text-xs font-semibold text-[var(--muted)]">Avg. Meta Ads ROAS</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Support</dt>
                    <dd className="flex items-center gap-1.5 text-2xl font-extrabold text-[var(--ink)] 3xl:text-3xl">
                      24/7
                      <Headphones className="h-5 w-5 text-[var(--cyan-dark)]" />
                    </dd>
                    <dd className="mt-0.5 text-xs font-semibold text-[var(--muted)]">Support on WhatsApp</dd>
                  </div>
                </motion.dl>
              </div>

              {/* Floating 3D dashboard mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                ref={dashWrapRef}
                style={{ perspective: "1100px", y: reduced ? 0 : dashParallax }}
              >
                <div ref={dashRef} className="fe-dash relative rounded-[28px] p-5 transition-transform duration-200 will-change-transform sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <FeatherLogoTile size="sm" />
                      <span className="text-sm font-extrabold text-[var(--ink)]">
                        Feathered OS — Live Dashboard
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-500">
                      <span className="fe-live-dot h-2 w-2 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--chip)] p-4">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        <BarChart3 className="h-3.5 w-3.5" /> Revenue Growth
                      </p>
                      <p className="mt-1.5 text-2xl font-extrabold text-[var(--ink)] sm:text-3xl">+184%</p>
                      <div className="mt-3 flex h-12 items-end gap-1.5" aria-hidden="true">
                        {[38, 55, 44, 66, 58, 82, 74, 100].map((h, i) => (
                          <span
                            key={i}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-400 to-violet-500"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[var(--chip)] p-4">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        <TrendingUp className="h-3.5 w-3.5" /> Ad ROAS
                      </p>
                      <p className="mt-1.5 text-2xl font-extrabold text-[var(--ink)] sm:text-3xl">4.8×</p>
                      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                        Meta Ads average across managed campaigns, updated weekly.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink2)] ring-1 ring-[var(--line)]">
                          Next.js • React
                        </span>
                        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink2)] ring-1 ring-[var(--line)]">
                          AI Integrations
                        </span>
                        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink2)] ring-1 ring-[var(--line)]">
                          Meta Ads
                        </span>
                        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink2)] ring-1 ring-[var(--line)]">
                          Blogs &amp; Content
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live metric badges — in normal flow below the dashboard
                    on small screens (never overlapping it); floating only
                    from lg up. */}
                <div className="fe-badges mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:contents">
                <div className="fe-badge flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-3.5 py-2.5 shadow-xl ring-1 ring-[var(--line)] lg:absolute lg:-left-6 lg:top-6">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>
                    <span className="block text-sm font-extrabold leading-none text-[var(--ink)]">99.9% Uptime</span>
                    <span className="fe-badge-sub mt-0.5 block text-[11px] font-semibold text-[var(--muted)]">Always-on delivery</span>
                  </span>
                </div>
                <div className="fe-badge flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-3.5 py-2.5 shadow-xl ring-1 ring-[var(--line)] lg:absolute lg:-right-5 lg:top-1/2" style={{ animationDelay: "1.2s" }}>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>
                    <span className="block text-sm font-extrabold leading-none text-[var(--ink)]">4.8× ROAS</span>
                    <span className="fe-badge-sub mt-0.5 block text-[11px] font-semibold text-[var(--muted)]">Meta Ads average</span>
                  </span>
                </div>
                <div className="fe-badge flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-3.5 py-2.5 shadow-xl ring-1 ring-[var(--line)] lg:absolute lg:-bottom-4 lg:left-8" style={{ animationDelay: "2.1s" }}>
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>
                    <span className="block text-sm font-extrabold leading-none text-[var(--ink)]">50+ AI Tools</span>
                    <span className="fe-badge-sub mt-0.5 block text-[11px] font-semibold text-[var(--muted)]">Instant activation</span>
                  </span>
                </div>
                </div>
              </motion.div>
            </div>

            <div className="relative mx-auto mt-14 flex w-full max-w-7xl justify-center px-4">
              <a
                href="#tools"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("tools");
                }}
                className="flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]"
              >
                Scroll to explore
                <ChevronDown className="fe-bounce h-4 w-4" />
              </a>
            </div>
          </section>

          {/* ── SECTION 1 — AI TOOLS MARKETPLACE ──────────────── */}
          <section id="tools" className="fe-cv scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 3xl:max-w-[1500px]">
              <SectionHead
                eyebrow="AI Tools Marketplace"
                title="Buy the tools. Negotiate your price on WhatsApp."
                sub="Instant purchase or subscription for the AI stack modern teams actually use — every tool is Price on Request, negotiated and paid on WhatsApp, activated fast, with setup help and warranty cover for your plan period."
              />

              {/* Filters + search */}
              <Reveal className="mb-8">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter tools by category">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      aria-pressed={filter === f.id}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                        filter === f.id
                          ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/25"
                          : "bg-[var(--surface)] text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <label className="relative mt-4 block max-w-md">
                  <span className="sr-only">Search tools</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tools — try Gemini, Netflix, VPN…"
                    className="fe-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
                  />
                </label>
                <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
                  Showing {visibleTools.length} of {TOOLS.length} tools
                  {filter !== "all" ? ` in ${FILTERS.find((f) => f.id === filter)?.label}` : ""}
                  {query.trim() ? ` matching "${query.trim()}"` : ""}.
                </p>
              </Reveal>

              {visibleTools.length === 0 ? (
                <div className="fe-card rounded-3xl p-10 text-center">
                  <Bot className="mx-auto mb-3 h-10 w-10 text-[var(--muted)]" />
                  <p className="text-lg font-bold text-[var(--ink)]">No tools match that search.</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Try another keyword, or ask us on WhatsApp — we stock 50+ tools.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                    className="btn-ghost mt-5 rounded-full px-5 py-2.5 text-sm font-bold"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="fe-tools-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:gap-9">
                  {visibleTools.map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      index={i}
                      onDemo={handleDemo}
                      onBuy={handleBuy}
                    />
                  ))}
                </div>
              )}

              <Reveal className="mt-8">
                <p className="fe-card rounded-3xl px-6 py-5 text-center text-sm leading-relaxed text-[var(--muted)]">
                  <FaWhatsapp className="mr-2 inline h-4 w-4 text-emerald-500" />
                  Negotiate on WhatsApp opens a chat with our team on{" "}
                  <strong className="text-[var(--ink)]">{CONFIG.whatsappDisplay}</strong> — your
                  message naming the tool is pre-filled, just press send to negotiate your
                  price. No prices are listed on this site; all payments are agreed on
                  WhatsApp. Also available: blog uploads &amp; publishing, content packages
                  and 50+ more tools on request — ask in the form below. Payments: bank
                  transfer, Easypaisa, JazzCash &amp; crypto.
                </p>
              </Reveal>

              {/* Trust strip */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:gap-6">
                {TRUST.map((t, i) => (
                  <Reveal key={t.title} delay={i * 0.06}>
                    <div className="fe-card flex h-full items-start gap-3.5 rounded-3xl p-5">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-md">
                        {t.title.startsWith("24/7") ? (
                          <span className="text-[13px] font-extrabold leading-none">24</span>
                        ) : (
                          <t.icon className="h-5 w-5" strokeWidth={2.5} />
                        )}
                      </span>
                      <span>
                        <span className="block text-base font-extrabold leading-snug text-[var(--ink)]">
                          {t.title}
                        </span>
                        {t.stars ? (
                          <span className="mt-1 flex items-center gap-0.5 text-amber-500" aria-label="Rated 5 out of 5 stars">
                            {[0, 1, 2, 3, 4].map((s) => (
                              <Star key={s} className="h-4 w-4 fill-current" />
                            ))}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                          {t.desc}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 2 — CORE AGENCY SERVICES ─────────────── */}
          <section id="services" className="fe-cv scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 3xl:max-w-[1500px]">
              <SectionHead
                eyebrow="Core Agency Services"
                title="Three pillars. One growth engine."
                sub="Everything a brand needs to launch, automate and scale — built and run by the same senior team."
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 3xl:gap-9">
                {SERVICES.map((s, i) => (
                  <Reveal key={s.id} delay={i * 0.08} className="h-full">
                    <article
                      id={s.id}
                      className="fe-card tilt flex h-full scroll-mt-28 flex-col rounded-3xl p-6 sm:p-7"
                    >
                      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3.5 text-white shadow-lg">
                        <s.icon className="h-6 w-6" />
                      </span>
                      <h3 className="text-xl font-extrabold leading-snug text-[var(--ink)] 3xl:text-2xl">
                        {s.title}
                      </h3>
                      <p className="mb-5 mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.desc}</p>
                      <ul className="mb-6 space-y-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink2)]">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={waLink(s.wa)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--cyan-dark)] hover:gap-2.5"
                      >
                        {s.cta}
                        <ArrowRight className="h-4 w-4 transition-all" />
                      </a>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 3 — WHY US BENTO ─────────────────────── */}
          <section id="cases" className="fe-cv scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 3xl:max-w-[1500px]">
              <SectionHead
                eyebrow="Why Feathered Experts Pro"
                title="Feather-light process. Heavyweight numbers."
              />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 3xl:gap-9">
                {/* Counters */}
                <Reveal className="lg:col-span-1">
                  <div className="fe-card flex h-full flex-col justify-between gap-6 rounded-3xl p-6 sm:p-7">
                    {COUNTERS.map((c) => (
                      <div key={c.label} className="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0">
                        <p className="text-4xl font-extrabold tracking-tight text-[var(--ink)] 3xl:text-6xl">
                          <Counter value={c.value} suffix={c.suffix} decimals={c.decimals} />
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{c.label}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Performance chart */}
                <Reveal delay={0.08} className="lg:col-span-2">
                  <div className="fe-card h-full rounded-3xl p-6 sm:p-7">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-[var(--ink)]">Performance, visualised</h3>
                      <span className="rounded-full bg-[var(--chip)] px-3 py-1 text-[11px] font-bold text-[var(--muted)]">
                        Last 12 months
                      </span>
                    </div>
                    <p className="mb-5 text-sm text-[var(--muted)]">
                      Cyan: clients with Feathered Experts Pro. Violet dashed: typical agency trajectory.
                    </p>
                    <div className="relative">
                      <svg viewBox="0 0 560 220" className="h-auto w-full" role="img" aria-label="Performance chart: Feathered Experts Pro clients growing faster than a typical agency">
                        <defs>
                          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#00F0FF" stopOpacity="0.25" />
                            <stop offset="1" stopColor="#00F0FF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[40, 90, 140, 190].map((y) => (
                          <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--line)" strokeWidth="1" />
                        ))}
                        <path d="M0 190 L70 176 L140 168 L210 148 L280 132 L350 108 L420 84 L490 52 L560 22 L560 220 L0 220 Z" fill="url(#chartFill)" />
                        <path d="M0 190 L70 176 L140 168 L210 148 L280 132 L350 108 L420 84 L490 52 L560 22" fill="none" stroke="#00C8DC" strokeWidth="3" strokeLinecap="round" />
                        <path d="M0 196 L70 190 L140 184 L210 178 L280 170 L350 162 L420 152 L490 142 L560 130" fill="none" stroke="#7B2CBF" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round" />
                        <circle cx="560" cy="22" r="5" fill="#00C8DC" />
                        <circle cx="560" cy="130" r="5" fill="#7B2CBF" />
                      </svg>
                      <span className="absolute right-1 top-0 rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-extrabold text-[var(--cyan-dark)] ring-1 ring-[var(--line)]">
                        +184% growth
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-5 sm:grid-cols-3">
                      <p className="text-sm font-bold text-[var(--ink)]">
                        Us vs. typical freelancers
                      </p>
                      {COMPARE_ROWS.map((r) => (
                        <div key={r.label} className="flex items-center justify-between gap-2 text-sm">
                          <span className="flex items-center gap-1.5 text-[var(--muted)]">
                            <Gauge className="h-4 w-4 text-[var(--cyan-dark)]" />
                            {r.label}
                          </span>
                          <strong className="text-[var(--ink)]">{r.us}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Case studies */}
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 3xl:gap-9">
                {CASES.map((c, i) => (
                  <Reveal key={c.title} delay={i * 0.08}>
                    <article className="fe-card h-full rounded-3xl p-6">
                      <p className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-3xl font-extrabold text-transparent 3xl:text-4xl">
                        {c.stat}
                      </p>
                      <h3 className="mt-2 text-lg font-extrabold text-[var(--ink)]">{c.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{c.desc}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 4 — PRICING TOGGLE ───────────────────── */}
          <section id="pricing" className="fe-cv scroll-mt-24 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 3xl:max-w-[1500px]">
              <SectionHead
                eyebrow="Pricing & Engagement"
                title="Pick how we work together."
                sub={`Subscribe to tools on your own — or retain the team that builds and grows everything for you. All plans are Price on Request: every payment is negotiated on WhatsApp on ${CONFIG.whatsappDisplay}.`}
              />

              <Reveal className="mb-8 flex justify-center">
                <div className="inline-flex max-w-full rounded-full bg-[var(--surface)] p-1.5 ring-1 ring-[var(--line)]" role="tablist" aria-label="Pricing type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!agency}
                    onClick={() => setAgency(false)}
                    className={`rounded-full px-3 py-2 text-xs font-bold transition-all sm:px-6 sm:py-2.5 sm:text-sm ${
                      !agency
                        ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-lg"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    AI Tool Subscriptions
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={agency}
                    onClick={() => setAgency(true)}
                    className={`rounded-full px-3 py-2 text-xs font-bold transition-all sm:px-6 sm:py-2.5 sm:text-sm ${
                      agency
                        ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-lg"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    Agency Retainers
                  </button>
                </div>
              </Reveal>

              <AnimatePresence mode="wait">
                <motion.div
                  key={agency ? "agency" : "subs"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-3 3xl:gap-9"
                >
                  {(agency ? AGENCY_PLANS : SUB_PLANS).map((p) => (
                    <article
                      key={p.name}
                      className={`fe-card relative flex h-full flex-col rounded-3xl p-6 sm:p-7 ${
                        p.badge ? "fe-card-pop ring-2 ring-cyan-400/60" : ""
                      }`}
                    >
                      {p.badge ? (
                        <span className="absolute -top-3.5 left-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                          {p.badge}
                        </span>
                      ) : null}
                      <h3 className={p.badge ? "text-xl font-extrabold text-white 3xl:text-2xl" : "text-xl font-extrabold text-[var(--ink)] 3xl:text-2xl"}>{p.name}</h3>
                      <p className={p.badge ? "mt-1 text-sm text-white/80" : "mt-1 text-sm text-[var(--muted)]"}>{p.desc}</p>
                      <p className={p.badge ? "mt-5 text-3xl font-extrabold tracking-tight text-white 3xl:text-4xl" : "mt-5 text-3xl font-extrabold tracking-tight text-[var(--ink)] 3xl:text-4xl"}>
                        Price on Request
                      </p>
                      <p className={p.badge ? "mt-1 text-sm font-bold text-cyan-300" : "mt-1 text-sm font-bold text-[var(--cyan-dark)]"}>
                        Negotiate on WhatsApp
                      </p>
                      <ul className="mb-6 mt-5 space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className={p.badge ? "flex items-start gap-2 text-sm text-white/90" : "flex items-start gap-2 text-sm text-[var(--ink2)]"}>
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={waLink(planText(p.name, agency ? "Agency Retainers" : "AI Tool Subscriptions"))}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          showToast(`Opening WhatsApp — your message for the ${p.name} plan is pre-filled, just press send.`)
                        }
                        className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-base font-bold ${
                          p.badge ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        <FaWhatsapp className="h-5 w-5" />
                        Negotiate on WhatsApp
                      </a>
                    </article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* ── SECTION 5 — TESTIMONIALS & LEAD FORM ─────────── */}
          <section id="reviews" className="fe-cv scroll-mt-24 overflow-hidden py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 3xl:max-w-[1500px]">
              <SectionHead
                eyebrow="Client Love"
                title="Brands that fly with us."
              />
            </div>

            {/* Auto-scrolling testimonial marquee */}
            <Reveal>
              <div className="fe-marquee-wrap relative" aria-label="Client testimonials">
                <div className="fe-marquee flex w-max gap-5 pr-5">
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <figure
                      key={`${t.name}-${i}`}
                      aria-hidden={i >= TESTIMONIALS.length ? true : undefined}
                      className="fe-card w-[320px] shrink-0 rounded-3xl p-6 sm:w-[380px]"
                    >
                      <span className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                        {[0, 1, 2, 3, 4].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-current" />
                        ))}
                      </span>
                      <blockquote className="mt-3 text-[15px] leading-relaxed text-[var(--ink2)]">
                        &ldquo;{t.text}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4">
                        <p className="text-sm font-extrabold text-[var(--ink)]">{t.name}</p>
                        <p className="text-xs font-semibold text-[var(--muted)]">— {t.role}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Brand logos */}
              <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
                {BRANDS.map((b) => (
                  <span
                    key={b}
                    className="text-lg font-extrabold tracking-wide text-[var(--muted)] opacity-70 transition-opacity hover:opacity-100 3xl:text-xl"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Lead capture */}
            <div id="contact" className="mx-auto mt-16 w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 3xl:max-w-[1500px]">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <Reveal>
                  <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl 3xl:text-5xl">
                    Start Today
                  </h2>
                  <p className="mt-3 text-base font-bold text-[var(--ink2)]">
                    Tell us what you&apos;re building. We&apos;ll reply with a plan.
                  </p>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    AI tool, website, software, Meta Ads or a full growth retainer — send the
                    brief and get a clear quote, timeline and next step. On send, your brief
                    opens in WhatsApp to our team on {CONFIG.whatsappDisplay}, ready to send.
                  </p>
                  <div className="mt-6 space-y-3">
                    <p className="flex items-start gap-2.5 text-sm text-[var(--ink2)]">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <span>
                        <strong className="text-[var(--ink)]">Fast start</strong> — Most tool
                        activations and project kickoffs begin within 24–48 hours.
                      </span>
                    </p>
                    <p className="flex items-start gap-2.5 text-sm text-[var(--ink2)]">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong className="text-[var(--ink)]">Warranty &amp; support</strong> —
                        Subscriptions covered for the plan period, with real human support.
                      </span>
                    </p>
                    <p className="flex items-start gap-2.5 text-sm text-[var(--ink2)]">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan-dark)]" />
                      <span>
                        <strong className="text-[var(--ink)]">WhatsApp first</strong> — Chat with
                        us on {CONFIG.whatsappDisplay} any time, day or night.
                      </span>
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <LeadForm showToast={showToast} />
                </Reveal>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer className="fe-cv border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 3xl:max-w-[1500px]">
            <div>
              <a href="#main-content" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2.5">
                <FeatherLogoTile />
                <span className="text-lg font-extrabold tracking-tight text-[var(--ink)]">
                  Feathered Experts <span className="text-[var(--cyan-dark)]">Pro</span>
                </span>
              </a>
              <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-[var(--muted)]">
                Hybrid AI Tools Marketplace &amp; Digital Engineering &amp; Growth Agency.
                Selling AI tools, uploading blogs, creating websites, running Meta Ads — and
                everything digital in between.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="fe-icon-btn"
                  >
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Marketplace">
              <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-[var(--ink)]">Marketplace</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["AI Chat Tools", "chat"],
                  ["Coding Tools", "coding"],
                  ["Creative Tools", "image"],
                  ["Subscriptions", "pricing"],
                ].map(([label, id]) => (
                  <li key={label}>
                    <a
                      href={`#${id === "pricing" ? "pricing" : "tools"}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (id === "chat" || id === "coding" || id === "image") {
                          setFilter(id);
                        }
                        scrollToId(id === "pricing" ? "pricing" : "tools");
                      }}
                      className="text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Agency">
              <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-[var(--ink)]">Agency</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["Web Development", "webdev"],
                  ["Software Development", "software"],
                  ["Meta Ads", "ads"],
                  ["Case Studies", "cases"],
                ].map(([label, id]) => (
                  <li key={label}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(id);
                      }}
                      className="text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-[var(--ink)]">Get Started</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={waLink("Hello Feathered Experts Pro! I would like to book an agency call. Please share the available times so we can talk on WhatsApp.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]"
                  >
                    Book an Agency Call
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToId("pricing"); }} className="text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#tools" onClick={(e) => { e.preventDefault(); scrollToId("tools"); }} className="text-[var(--muted)] transition-colors hover:text-[var(--cyan-dark)]">
                    Explore Tools
                  </a>
                </li>
              </ul>
              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-[var(--muted)]">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${CONFIG.supportEmail}`} className="transition-colors hover:text-[var(--cyan-dark)]">
                  {CONFIG.supportEmail}
                </a>
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[var(--muted)]">
                <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <a
                  href={`https://wa.me/${CONFIG.supportNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--cyan-dark)]"
                >
                  WhatsApp support: {CONFIG.supportDisplay}
                </a>
              </p>
              <p className="mt-4 flex items-start gap-2 text-sm text-[var(--muted)]">
                <Landmark className="mt-0.5 h-4 w-4 shrink-0" />
                Payments: Bank Transfer • Easypaisa • JazzCash • Crypto
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <a href={CONFIG.channelUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--cyan-dark)] hover:underline">
                  Join our WhatsApp channel
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--line)]">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-[13px] text-[var(--muted)] sm:px-6 3xl:max-w-[1500px]">
              <span>© 2026 Feathered Experts Pro. All rights reserved.</span>
              <span className="flex items-center gap-4">
                <SmartLink to={CONFIG.privacyUrl} className="transition-colors hover:text-[var(--cyan-dark)]">Privacy</SmartLink>
                <SmartLink to={CONFIG.termsUrl} className="transition-colors hover:text-[var(--cyan-dark)]">Terms</SmartLink>
                <span className="font-mono text-xs font-bold tracking-widest">
                  LIGHTWEIGHT EXECUTION — HEAVYWEIGHT RESULTS
                </span>
              </span>
            </div>
          </div>
        </footer>

        {/* Back to top */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={`btn-primary fe-to-top fixed bottom-5 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full shadow-xl transition-all ${
            scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        {/* Toast */}
        <div
          className={`toast ${toast ? "show" : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>

        <style>{THEME_CSS}</style>
      </div>
    </MotionConfig>
  );
}

/* ── LEAD CAPTURE FORM ────────────────────────────────────────────
   Validates name + email, then opens WhatsApp to 03716804766 with the
   brief pre-filled. Nothing is stored on the page. */
const LeadForm = React.memo(function LeadForm({ showToast }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "AI Tools Subscription",
    budget: "To negotiate on WhatsApp",
    details: "",
  });
  const [sent, setSent] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email || email.indexOf("@") < 1) {
      showToast("Please add your name and a valid email so we can reply.");
      return;
    }
    const text =
      "Hello Feathered Experts Pro! I would like to send my project brief.\n\n" +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Service Needed: ${form.service}\n` +
      `Project Budget: ${form.budget}` +
      (form.details.trim() ? `\n\nProject Details:\n${form.details.trim()}` : "");
    setSent(true);
    openWhatsApp(text);
    showToast("Opening WhatsApp — your brief is pre-filled, just press send.");
  };

  return (
    <form onSubmit={submit} className="fe-card rounded-3xl p-6 sm:p-8" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="fe-label">
          Your Name *
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            autoComplete="name"
            className="fe-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm"
          />
        </label>
        <label className="fe-label">
          Email *
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            autoComplete="email"
            className="fe-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm"
          />
        </label>
        <label className="fe-label">
          Service Needed
          <select value={form.service} onChange={set("service")} className="fe-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm">
            <option>AI Tools Subscription</option>
            <option>Custom Website</option>
            <option>Custom Software / SaaS</option>
            <option>Meta Ads &amp; Marketing</option>
            <option>Blog Uploads &amp; Content</option>
            <option>Full Growth Retainer</option>
            <option>Something Else</option>
          </select>
        </label>
        <label className="fe-label">
          Project Budget / Scale
          <select value={form.budget} onChange={set("budget")} className="fe-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm">
            <option>To negotiate on WhatsApp</option>
            <option>Small project</option>
            <option>Medium project</option>
            <option>Large project</option>
            <option>Enterprise scale</option>
            <option>Not sure yet</option>
          </select>
        </label>
      </div>
      <label className="fe-label mt-4 block">
        Project Details
        <textarea
          value={form.details}
          onChange={set("details")}
          rows={4}
          placeholder="What do you want to build, automate or scale?"
          className="fe-input mt-1.5 w-full resize-y rounded-2xl px-4 py-3 text-sm"
        />
      </label>

      {sent ? (
        <p className="success show mt-5" role="status">
          ✓ Thanks — WhatsApp is opening with your brief pre-filled. Just press send in
          WhatsApp and we&apos;ll reply with your plan.
        </p>
      ) : null}

      <button type="submit" className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-base font-bold">
        Send My Brief on WhatsApp
        <ArrowRight className="h-5 w-5" />
      </button>
      <p className="mt-3 text-center text-xs leading-relaxed text-[var(--muted)]">
        Submitting opens WhatsApp to {CONFIG.whatsappDisplay} with the brief pre-filled —
        nothing is stored on this page.
      </p>
    </form>
  );
});

/* ════════════════════════════════════════════════════════════════════
   THEME CSS — light palette in :root, obsidian dark palette under
   [data-theme="dark"]. Light is the default: the page opens with
   data-theme="light" and nothing ever reads a saved or system theme.
   Glassmorphism cards, glowing gradient borders, marquee/float
   keyframes, and the 1920px / 2560px fluid scaling live here.
   ════════════════════════════════════════════════════════════════════ */
const THEME_CSS = `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap");

/* ══ THEME CSS — light default, dark under [data-theme="dark"] ══
   HD fonts: Sora (display) + Inter (body) via the @import above.
   Font tokens, fluid clamp() type + spacing tokens, film grain,
   tilt glare, glass, focus rings, safe-area and the 1920/2560 scale. */
:root, [data-theme="light"] {
  --bg: #F4F7FB;
  --surface: #FFFFFF;
  --ink: #0B1220;
  --ink2: #1E293B;
  --muted: #5B6B82;
  --muted2: #7A8AA0;
  --line: #E2E8F0;
  --chip: #EDF2F7;
  --cyan: #00F0FF;
  --cyan-dark: #0891A5;
  --violet: #7B2CBF;
  --shadow: 0 18px 45px rgba(11, 18, 32, 0.08);
  --shadow-tilt: 0 24px 55px rgba(0, 180, 210, 0.22);
  --ring: rgba(0, 240, 255, 0.55);
  /* HD font tokens — display stack first, system fallbacks always present */
  --font-display: "Sora", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;
  /* Fluid type + spacing tokens (320px phones → 2560px+ ultra-wide) */
  --fs-display: clamp(2.35rem, 5.8vw + 0.4rem, 4.4rem);
  --fs-h2: clamp(1.8rem, 3.2vw + 0.6rem, 2.9rem);
  --fs-h3: clamp(1.15rem, 1.6vw + 0.5rem, 1.5rem);
  --space-section: clamp(4rem, 7vw, 6rem);
  color-scheme: light;
}
[data-theme="dark"] {
  --bg: #07090E;
  --surface: #0F1420;
  --ink: #EDF2F7;
  --ink2: #CBD5E1;
  --muted: #94A3B8;
  --muted2: #7C8AA0;
  --line: rgba(148, 163, 184, 0.18);
  --chip: rgba(148, 163, 184, 0.12);
  --cyan: #00F0FF;
  --cyan-dark: #00C2D1;
  --violet: #9D4EDD;
  --shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
  --shadow-tilt: 0 24px 60px rgba(0, 240, 255, 0.16);
  --ring: rgba(0, 240, 255, 0.45);
  color-scheme: dark;
}
html, body { overflow-x: clip; }
html { scrollbar-width: thin; scrollbar-color: var(--muted2) transparent; }
.fe-root {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1;
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
.fe-root h1, .fe-root h2, .fe-root h3, .fe-display {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}
.fe-root h1 { letter-spacing: -0.03em; }
.fe-hero h1 { font-size: var(--fs-display); }
.fe-root h2 { font-size: var(--fs-h2); }
.fe-root h3 { font-size: var(--fs-h3); }
.fe-num { font-variant-numeric: tabular-nums; }
.fe-root section:not(.fe-hero) { padding-top: var(--space-section); padding-bottom: var(--space-section); }
.fe-root ::selection { background: var(--violet); color: #fff; }
.fe-root { scrollbar-color: var(--muted2) transparent; }
.fe-root :focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; border-radius: 8px; }
/* SVG film-grain overlay — fixed, pointer-transparent, adds HD depth */
.fe-grain {
  position: fixed; inset: 0; z-index: 5; pointer-events: none;
  opacity: 0.045; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}
[data-theme="dark"] .fe-grain { opacity: 0.07; }
/* Skip link — hidden until keyboard focus */
.fe-skip-link {
  position: fixed; top: -120px; left: 16px; z-index: 100;
  background: #0B1220; color: #fff; font-weight: 700; font-size: 14px;
  padding: 10px 16px; border-radius: 9999px; transition: top 0.2s ease;
}
.fe-skip-link:focus { top: calc(12px + env(safe-area-inset-top, 0px)); color: #fff; }
/* Below-fold sections render lazily (content-visibility) */
.fe-cv { content-visibility: auto; contain-intrinsic-size: auto 900px; }
/* 3D tilt + cursor glare — transform only, will-change on animated el only */
.fe-tilt { will-change: transform; }
.fe-glare {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.28), transparent 55%);
  opacity: 0; transition: opacity 0.25s ease;
}
.fe-tilt:hover .fe-glare { opacity: 1; }
[data-theme="dark"] .fe-glare {
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(0, 240, 255, 0.16), transparent 55%);
}
.fe-card {
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.fe-card.tilt:hover { box-shadow: var(--shadow-tilt); }
.fe-card-pop {
  background: linear-gradient(135deg, #0B1220 0%, #123049 45%, #1E1B4B 100%);
  color: #fff; border-color: rgba(255, 255, 255, 0.12);
}
[data-theme="dark"] .fe-card-pop {
  background: linear-gradient(135deg, #0E1626 0%, #123049 55%, #2B1B4B 100%);
}
.btn-primary {
  background: linear-gradient(120deg, #00C2D1 0%, #0EA5E9 50%, #7B2CBF 115%);
  color: #fff;
  box-shadow: 0 10px 26px rgba(14, 165, 233, 0.32);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.btn-primary:hover { transform: translateY(-2px); filter: brightness(1.06); box-shadow: 0 16px 34px rgba(14, 165, 233, 0.4); }
.btn-primary:active { transform: translateY(0) scale(0.98); }
.btn-ghost {
  background: transparent; border: 1px solid var(--line); color: var(--ink);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.btn-ghost:hover { border-color: var(--cyan-dark); background: var(--chip); transform: translateY(-1px); }
.fe-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; width: 40px; border-radius: 9999px; color: var(--ink);
  transition: background 0.2s ease;
}
.fe-icon-btn:hover { background: var(--chip); }
.fe-root header {
  background: transparent; border-bottom: 1px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
}
.fe-nav-scrolled {
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-bottom: 1px solid var(--line);
}
.fe-drawer {
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
}
.fe-hero {
  background: linear-gradient(180deg, #FFFFFF 0%, #EAF6FF 48%, #F4F7FB 100%);
}
[data-theme="dark"] .fe-hero {
  background: radial-gradient(1100px 500px at 70% -10%, rgba(123, 44, 191, 0.22), transparent 60%),
    radial-gradient(900px 480px at 10% 0%, rgba(0, 240, 255, 0.12), transparent 55%),
    linear-gradient(180deg, #07090E 0%, #0A0F1A 100%);
}
.fe-particles { position: absolute; inset: 0; width: 100%; height: 100%; }
.fe-hero-glow {
  background: radial-gradient(560px 320px at 50% 38%, rgba(0, 240, 255, 0.16), transparent 70%);
}
[data-theme="dark"] .fe-hero-glow {
  background: radial-gradient(560px 320px at 50% 38%, rgba(123, 44, 191, 0.28), transparent 70%);
}
.fe-dash { will-change: transform; }
.fe-badge { animation: fe-float 7s ease-in-out infinite; will-change: transform; }
@keyframes fe-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
.fe-live-dot { animation: fe-pulse 1.6s ease-in-out infinite; }
@keyframes fe-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.8); } }
.fe-bounce { animation: fe-bounce 1.8s ease-in-out infinite; }
@keyframes fe-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.fe-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  font-family: var(--font-display);
}
.fe-input {
  width: 100%; background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  border-radius: 12px; padding: 12px 14px; font-size: 15px; outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.fe-input:focus { border-color: var(--cyan-dark); box-shadow: 0 0 0 3px var(--ring); }
.fe-input::placeholder { color: var(--muted2); }
.success {
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height 0.5s ease, opacity 0.4s ease;
}
.success.show { max-height: 240px; opacity: 1; }
[data-theme="dark"] .success { background: rgba(22, 163, 74, 0.14); border-color: rgba(74, 222, 128, 0.35); }
.fe-marquee-wrap { mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.fe-marquee { animation: fe-marquee 46s linear infinite; will-change: transform; }
.fe-marquee-wrap:hover .fe-marquee { animation-play-state: paused; }
@keyframes fe-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.toast {
  position: fixed; left: 50%; bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  transform: translate(-50%, 80px); z-index: 90;
  background: #0B1220; color: #fff; border-radius: 9999px;
  padding: 11px 18px; font-size: 14px; font-weight: 600;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  opacity: 0; pointer-events: none; transition: transform 0.35s ease, opacity 0.35s ease;
  max-width: calc(100vw - 32px); text-align: center;
}
.toast.show { transform: translate(-50%, 0); opacity: 1; }
@supports (bottom: env(safe-area-inset-bottom)) {
  .fe-to-top {
    bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
    right: calc(1.25rem + env(safe-area-inset-right, 0px));
  }
}
/* ── Responsive scale: 360 / 480 / 640 / 768 / 1024 / 1280 / 1440 / 1920 / 2560 ── */
@media (max-width: 400px) {
  .fe-dash { padding: 0.875rem; border-radius: 22px; }
  .fe-hero { padding-top: 104px; }
}
/* Badges sit in normal flow below lg — no float bobbing while stacked. */
@media (max-width: 1023.5px) {
  .fe-badge { animation: none; }
}
@media (max-width: 767px) {
  .fe-icon-btn { height: 44px; width: 44px; }
  [role="group"] button { min-height: 44px; }
  .fe-input { min-height: 44px; }
}
@media (min-width: 1440px) {
  .fe-root { font-size: 16.5px; }
}
@media (min-width: 1920px) {
  .fe-root { font-size: 17px; }
  :root {
    --fs-display: clamp(3.4rem, 4.6vw, 5rem);
    --fs-h2: clamp(2.4rem, 2.4vw, 3rem);
  }
  .fe-hero { padding-top: 150px; }
  .fe-hero h1 { line-height: 1.03; }
  .fe-root h2 { letter-spacing: -0.02em; }
}
@media (min-width: 2560px) {
  .fe-root { font-size: 18px; }
  .fe-root .max-w-7xl { max-width: 112rem; }
  .fe-tools-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  :root {
    --fs-display: clamp(4rem, 3.6vw, 5.6rem);
    --fs-h2: clamp(2.6rem, 2.2vw, 3.4rem);
  }
}
@media (prefers-reduced-motion: reduce) {
  .fe-marquee, .fe-badge, .fe-bounce, .fe-live-dot { animation: none !important; }
  .fe-card, .btn-primary, .btn-ghost, .fe-tilt { transition: none !important; }
  .fe-tilt { transform: none !important; }
  .fe-glare { display: none; }
  html { scroll-behavior: auto; }
}
`;
