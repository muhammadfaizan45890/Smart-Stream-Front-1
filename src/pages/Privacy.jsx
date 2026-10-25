import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUp, 
  Layers, 
  ShieldCheck, 
  MessageCircle, 
  Mail,
  FileText
} from "lucide-react";

const Privacy = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");
  const contentRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sections = [
        "intro", "collection", "use", "whatsapp", 
        "thirdparty", "cookies", "rights", "security", 
        "contact", "changes"
      ];
      
      const scrollPos = window.scrollY + 150;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const toc = [
    { id: "intro", label: "Introduction" },
    { id: "collection", label: "Information We Collect" },
    { id: "use", label: "How We Use Information" },
    { id: "whatsapp", label: "WhatsApp Orders" },
    { id: "thirdparty", label: "Third-Party Services" },
    { id: "cookies", label: "Cookies & Storage" },
    { id: "rights", label: "Your Rights" },
    { id: "security", label: "Data Security" },
    { id: "contact", label: "Contact Us" },
    { id: "changes", label: "Changes to Policy" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black" ref={contentRef}>
      
      {/* Font Import matching home.jsx */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .font-sans {
          font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* ─── Hero Header ────────────────────────────────────── */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tighter uppercase">SmartStream</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Legal Document
            </span>
          </div>
          
          {/* Matching home.jsx heading weight */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-neutral-900 dark:text-white">
            Privacy Policy
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-medium">
            Last updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ─── Table of Contents (Sidebar) ──────────────── */}
          <aside className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-neutral-900 dark:text-white">
                <FileText className="h-5 w-5" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  On this page
                </h2>
              </div>
              <nav className="space-y-1 border-l border-neutral-200 dark:border-neutral-800">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-[13px] py-2.5 px-4 border-l-2 -ml-[1px] transition-all duration-200 ${
                      activeSection === item.id
                        ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-bold bg-neutral-50 dark:bg-neutral-900/50"
                        : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        const offset = 100;
                        const top = el.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ─── Content ────────────────────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
            <div className="space-y-12 text-neutral-600 dark:text-neutral-300 leading-relaxed text-[15px]">
              
              {/* Introduction */}
              <section id="intro" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to <strong className="text-neutral-900 dark:text-white">SmartStream Software</strong> ("we", "our", or "us"). We are committed to protecting your privacy and ensuring you have a safe experience when purchasing premium AI tools and subscriptions from our website.
                </p>
                <p>
                  This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using our website or purchasing our products, you agree to the practices described here.
                </p>
              </section>

              {/* Information We Collect */}
              <section id="collection" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">2. Information We Collect</h2>
                <p className="mb-4">We only collect the minimum information required to fulfill your order and provide support:</p>
                <ul className="list-disc pl-6 space-y-3 mb-4 marker:text-neutral-400">
                  <li>
                    <strong className="text-neutral-900 dark:text-white">Contact Data:</strong> When you click "Buy via WhatsApp" or contact support, we receive your WhatsApp phone number and your name (as set on your WhatsApp profile).
                  </li>
                  <li>
                    <strong className="text-neutral-900 dark:text-white">Order Data:</strong> Details about the AI tools you purchase, subscription duration, and any specific account requirements (e.g., email address for activation).
                  </li>
                  <li>
                    <strong className="text-neutral-900 dark:text-white">Usage Data:</strong> We may collect anonymous analytics data (like page views, browser type, and device type) to improve our website performance. We do not track you across other websites.
                  </li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section id="use" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use your data solely for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-3 mb-4 marker:text-neutral-400">
                  <li>To process and deliver your subscription activation details.</li>
                  <li>To provide customer support and warranty replacements.</li>
                  <li>To send you important updates regarding your subscription (e.g., renewal reminders).</li>
                  <li>To prevent fraud and ensure secure transactions.</li>
                </ul>
                <p>
                  <strong className="text-neutral-900 dark:text-white">We do not sell your personal data to third parties.</strong>
                </p>
              </section>

              {/* WhatsApp Orders */}
              <section id="whatsapp" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">4. WhatsApp Orders & Payment</h2>
                <div className="p-6 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20 mb-4">
                  <div className="flex items-start gap-4">
                    <MessageCircle className="h-6 w-6 text-[#25D366] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white mb-2">Our checkout process happens on WhatsApp.</p>
                      <p className="text-sm">
                        When you click "Checkout" or "Buy Now," you are redirected to the official WhatsApp app. Your order message is pre-filled. 
                        All communication is end-to-end encrypted by WhatsApp. We do not process or store your credit card or bank details on this website.
                      </p>
                    </div>
                  </div>
                </div>
                <p>
                  Payment details (Bank Transfer, Easypaisa, JazzCash, or Crypto) are shared directly by our support team on WhatsApp, and you complete the transaction through your trusted banking app.
                </p>
              </section>

              {/* Third-Party Services */}
              <section id="thirdparty" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">5. Third-Party Services</h2>
                <p className="mb-4">We use the following third-party platforms to operate our business:</p>
                <ul className="list-disc pl-6 space-y-3 mb-4 marker:text-neutral-400">
                  <li>
                    <strong className="text-neutral-900 dark:text-white">WhatsApp (Meta):</strong> For communication, order delivery, and support. Subject to WhatsApp's Privacy Policy.
                  </li>
                  <li>
                    <strong className="text-neutral-900 dark:text-white">Vercel / Netlify:</strong> Our website is hosted on these secure platforms to ensure uptime and speed.
                  </li>
                  <li>
                    <strong className="text-neutral-900 dark:text-white">Payment Processors:</strong> We do not integrate with Stripe/PayPal directly. All payments are manual and verified by our team.
                  </li>
                </ul>
              </section>

              {/* Cookies & Storage */}
              <section id="cookies" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">6. Cookies & Local Storage</h2>
                <p className="mb-4">
                  We use basic browser storage (Local Storage) to remember your preferences, such as:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-4 marker:text-neutral-400">
                  <li>Your selected theme (Dark or Light mode).</li>
                  <li>Items in your shopping cart (so you don't lose them if you refresh).</li>
                  <li>Your saved wishlist items.</li>
                </ul>
                <p>
                  This data is stored locally on your device and can be cleared by clearing your browser cache. We do not use tracking cookies for advertising.
                </p>
              </section>

              {/* Your Rights */}
              <section id="rights" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">7. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-3 mb-4 marker:text-neutral-400">
                  <li>Request a copy of the personal data we hold about you.</li>
                  <li>Request correction of any inaccurate data.</li>
                  <li>Request deletion of your data (once your subscription has ended and no pending disputes exist).</li>
                  <li>Opt-out of non-essential communications.</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us using the details below.
                </p>
              </section>

              {/* Data Security */}
              <section id="security" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">8. Data Security</h2>
                <p className="mb-4">
                  We take the security of your data seriously. We use secure HTTPS connections, and all sensitive communication (like account credentials for your AI tools) is handled directly via WhatsApp's end-to-end encryption.
                </p>
                <p>
                  We retain your order details only for as long as your subscription is active, plus a reasonable period for warranty and tax purposes.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-28">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">9. Contact Us</h2>
                <p className="mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <a href="https://wa.me/923716837122" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-[#25D366] dark:hover:border-[#25D366] transition-colors group bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WhatsApp</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">+92 371 6837122</p>
                    </div>
                  </a>
                  <a href="mailto:smartstreamsoftware@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email</p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white break-all">smartstreamsoftware@gmail.com</p>
                    </div>
                  </a>
                </div>
              </section>

              {/* Changes to Policy */}
              <section id="changes" className="scroll-mt-28 pb-12">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The latest version will always be posted on this page, with the "Last updated" date at the top. We encourage you to review this page periodically.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* ─── Back to Top Button ────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xl transition-all duration-300 hover:scale-110 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

    </div>
  );
};

export default Privacy;
