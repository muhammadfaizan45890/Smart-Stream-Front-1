import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Trash2, Edit, Save, X, ArrowLeft, Tag,
  CheckCircle2, AlertCircle, Lock, User, Eye, EyeOff,
  ShieldCheck, LogOut, Loader2, RefreshCw, Upload, Image as ImageIcon,
  Sparkles, Search, ArrowUp, Layers, ExternalLink, TrendingUp,
} from "lucide-react";
import {
  SiGooglegemini, SiYoutube, SiCursor, SiElevenlabs, SiAnthropic,
} from "react-icons/si";

/* ════════════════════════════════════════════════════════════
   CONFIG
   ════════════════════════════════════════════════════════════ */
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/api/tools`;
const UPLOAD_URL = `${API_BASE_URL}/api/upload`;
const ADMIN_SESSION_KEY = "smartstream_admin_session";
const MAX_IMAGE_MB = 5;

const MidjourneyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.36 19.06H1.64a.45.45 0 0 1-.39-.68l.83-1.42a.45.45 0 0 1 .78 0l.56.95h17.16l.56-.95a.45.45 0 0 1 .78 0l.83 1.42a.45.45 0 0 1-.39.68Z"/>
    <path d="M18.15 11.28 12 2.06 5.85 11.28a.45.45 0 0 0 .37.7h11.56a.45.45 0 0 0 .37-.7Zm-6.15-6.4 3.8 5.68H8.2L12 4.88Z"/>
  </svg>
);

const ICON_OPTIONS = [
  { id: "SiGooglegemini", label: "Gemini", component: SiGooglegemini },
  { id: "SiYoutube", label: "YouTube", component: SiYoutube },
  { id: "SiCursor", label: "Cursor", component: SiCursor },
  { id: "SiElevenlabs", label: "ElevenLabs", component: SiElevenlabs },
  { id: "SiAnthropic", label: "Claude", component: SiAnthropic },
  { id: "MidjourneyIcon", label: "Midjourney", component: MidjourneyIcon },
];

const CATEGORY_OPTIONS = ["AI Chat", "Coding", "Image Gen", "Audio & Voice", "Entertainment"];

const resolveImageUrl = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return `${API_BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};

/* ════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════ */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme || localStorage.getItem("ss-theme") || "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

function useToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  return [toast, setToast];
}

const Toast = ({ toast }) => (
  <div className="fixed bottom-6 left-1/2 z-[80] w-full max-w-sm -translate-x-1/2 px-4" role="status" aria-live="polite">
    {toast && (
      <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl ${
        toast.type === "error"
          ? "border border-rose-500/20 bg-rose-500/10 text-rose-200"
          : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
      }`}>
        {toast.type === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
        <span className="truncate">{toast.message}</span>
      </div>
    )}
  </div>
);

/* ════════════════════════════════════════════════════════════
   LOGIN
   ════════════════════════════════════════════════════════════ */
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      if (username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
        onLogin();
      } else {
        setError("Invalid username or password.");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950 px-4 font-sans text-white selection:bg-emerald-500/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md animate-[fadeInUp_0.5s_ease-out]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/70 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Admin Access</h1>
            <p className="mt-2 text-sm text-neutral-400">Enter your credentials to manage the store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter username" required autoComplete="username"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-600 transition-colors focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password" required autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white placeholder-neutral-600 transition-colors focus:border-emerald-500 focus:outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit" disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</> : <><ShieldCheck className="h-4 w-4" /> Sign In to Dashboard</>}
            </button>
          </form>

          <div className="border-t border-white/5 bg-white/[0.02] px-8 py-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IMAGE UPLOADER
   ════════════════════════════════════════════════════════════ */
function ImageUploader({ value, onChange, hue = "#10b981" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) { alert(`Image must be under ${MAX_IMAGE_MB} MB.`); return; }

    setUploading(true);
    setProgress(0);

    // Simulated progress (real progress needs XHR)
    const ticker = setInterval(() => setProgress((p) => Math.min(p + 15, 90)), 100);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Upload failed");
      onChange(data.url);
      setProgress(100);
    } catch (err) {
      alert(`Upload failed: ${err.message}\n\nMake sure the backend is running on ${API_BASE_URL}.`);
    } finally {
      clearInterval(ticker);
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [onChange]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    uploadFile(file);
  };

  const previewSrc = resolveImageUrl(value);

  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
        Tool Image <span className="text-neutral-600">(optional)</span>
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
          dragging ? "border-emerald-500 bg-emerald-500/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
        }`}
      >
        {previewSrc ? (
          <div className="relative flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
              <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{value.split("/").pop()}</p>
              <p className="mt-0.5 text-xs text-neutral-500">Image ready</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-neutral-300 hover:bg-white/5">Replace</button>
                <button type="button" onClick={() => onChange("")} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/20">Remove</button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 py-8 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <p className="text-sm font-semibold">Uploading… {progress}%</p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${hue}15`, color: hue }}>
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">Click or drag & drop</p>
                <p className="text-xs text-neutral-500">PNG, JPG, WebP, SVG · up to {MAX_IMAGE_MB} MB</p>
              </>
            )}
          </button>
        )}

        {uploading && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { uploadFile(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TOOL FORM MODAL
   ════════════════════════════════════════════════════════════ */
function ToolFormModal({ tool, onClose, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: tool?.name || "",
    category: tool?.category || CATEGORY_OPTIONS[0],
    duration: tool?.duration || "1 Month",
    rating: tool?.rating ?? 5.0,
    reviews: tool?.reviews ?? 0,
    icon: tool?.icon || "SiGooglegemini",
    hue: tool?.hue || "#10b981",
    badge: tool?.badge || "",
    desc: tool?.desc || "",
    features: tool?.features ? tool.features.join("\n") : "",
    image: tool?.image || "",
  });

  const set = (patch) => setFormData((p) => ({ ...p, ...patch }));
  const handleChange = (e) => set({ [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      rating: Math.min(5, Math.max(0, parseFloat(formData.rating) || 0)),
      reviews: Math.max(0, parseInt(formData.reviews, 10) || 0),
      features: formData.features.split("\n").map((f) => f.trim()).filter(Boolean),
      image: formData.image || "",
    };
    onSave(processedData);
  };

  const ActiveIcon = ICON_OPTIONS.find((o) => o.id === formData.icon)?.component || Tag;
  const previewSrc = resolveImageUrl(formData.image);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={saving ? undefined : onClose} />
      <div className="relative flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-neutral-950 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl">

        <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${formData.hue}20`, color: formData.hue }}>
              {previewSrc ? <img src={previewSrc} alt="" className="h-full w-full rounded-xl object-cover" /> : <ActiveIcon className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl">{tool ? "Edit Tool" : "Add New Tool"}</h2>
              <p className="text-xs text-neutral-500">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-40">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">

          {/* Image upload */}
          <ImageUploader value={formData.image} onChange={(url) => set({ image: url })} hue={formData.hue} />

          {/* Name / Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Gemini Advanced"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
              </select>
            </div>
          </div>

          {/* Duration / Rating / Reviews */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Duration</label>
              <select name="duration" value={formData.duration} onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
                {["1 Month", "3 Months", "6 Months", "1 Year"].map((d) => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Rating</label>
              <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Reviews</label>
              <input type="number" min="0" name="reviews" value={formData.reviews} onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>

          {/* Icon / Color / Badge */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Fallback Icon</label>
              <select name="icon" value={formData.icon} onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
                {ICON_OPTIONS.map((opt) => <option key={opt.id} value={opt.id} className="bg-neutral-900">{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Accent Color</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5">
                <input type="color" name="hue" value={formData.hue} onChange={handleChange} className="h-8 w-10 cursor-pointer rounded-md border-0 bg-transparent" />
                <span className="text-xs font-mono text-neutral-400">{formData.hue}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Badge</label>
              <input name="badge" value={formData.badge} onChange={handleChange} placeholder="HOT, NEW…"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description *</label>
            <textarea required name="desc" value={formData.desc} onChange={handleChange} rows={3} placeholder="Short description that will appear on the card…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none" />
          </div>

          {/* Features */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">Features (one per line)</label>
              <span className="text-[10px] text-neutral-600">{formData.features.split("\n").filter((f) => f.trim()).length} added</span>
            </div>
            <textarea required name="features" value={formData.features} onChange={handleChange} rows={4}
              placeholder={"Unlimited access\nPriority support\n2TB storage"}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={saving}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-40">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> {tool ? "Update" : "Save"} Tool</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════════════════════ */
export default function Admin() {
  const [theme, toggleTheme] = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tools, setTools] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useToast();

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "true") setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const loadTools = useCallback(async () => {
    setIsFetching(true);
    setApiError("");
    try {
      const res = await fetch(API_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err) {
      setApiError(`Could not connect to server at ${API_BASE_URL}. Make sure the backend is running.`);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { if (isAuthenticated) loadTools(); }, [isAuthenticated, loadTools]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tool permanently? The uploaded image will also be removed.")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
        setToast({ type: "success", message: "Tool deleted" });
      } else throw new Error(data.message);
    } catch (err) {
      setToast({ type: "error", message: "Delete failed. Check server." });
    }
  };

  const handleSave = async (toolData) => {
    setIsSaving(true);
    const payload = editingTool ? { ...toolData, id: editingTool.id } : { ...toolData, id: `tool-${Date.now()}` };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
        setToast({ type: "success", message: editingTool ? "Tool updated" : "Tool added" });
        setIsModalOpen(false);
      } else throw new Error(data.message);
    } catch (err) {
      setToast({ type: "error", message: "Save failed. Check server." });
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = tools.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-white selection:bg-emerald-500/30">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #404040; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">Back to Store</span>
            </Link>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight sm:text-base">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={loadTools} disabled={isFetching} title="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => { setEditingTool(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:text-sm">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Tool</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20 sm:px-4 sm:text-sm">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { icon: Layers, label: "Total Tools", value: tools.length, color: "emerald" },
            { icon: TrendingUp, label: "Categories", value: new Set(tools.map(t => t.category)).size, color: "cyan" },
            { icon: Star, label: "Avg Rating", value: (tools.reduce((s, t) => s + (Number(t.rating) || 0), 0) / (tools.length || 1)).toFixed(1), color: "amber" },
            { icon: Sparkles, label: "With Image", value: tools.filter(t => t.image).length, color: "violet" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-neutral-500">
                <s.icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="mt-1.5 text-2xl font-black tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Status */}
        {apiError ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <div>
              <p className="text-sm font-bold">Server Offline</p>
              <p className="mt-1 text-xs text-neutral-400">{apiError}</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-bold">Connected & Ready</p>
              <p className="mt-1 text-xs text-neutral-400">
                Images upload to <code className="rounded bg-white/5 px-1 text-emerald-300">/public/uploads/</code> · Tools persist to your server's JSON store.
              </p>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name or category…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="mt-4 text-sm text-neutral-400">Loading tools…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                {tools.length === 0 ? <Plus className="h-6 w-6 text-neutral-600" /> : <Search className="h-6 w-6 text-neutral-600" />}
              </div>
              <p className="text-sm font-semibold text-white">{tools.length === 0 ? "No tools yet" : "No matches"}</p>
              <p className="mt-1 text-xs text-neutral-500">{tools.length === 0 ? 'Click "Add Tool" to create your first one.' : "Try a different search."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="px-4 py-3.5 font-bold sm:px-6">Tool</th>
                    <th className="hidden px-4 py-3.5 font-bold md:table-cell sm:px-6">Category</th>
                    <th className="hidden px-4 py-3.5 font-bold sm:table-cell sm:px-6">Duration</th>
                    <th className="px-4 py-3.5 font-bold sm:px-6">Rating</th>
                    <th className="px-4 py-3.5 text-right font-bold sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((tool) => {
                    const Icon = ICON_OPTIONS.find((o) => o.id === tool.icon)?.component || Tag;
                    const img = resolveImageUrl(tool.image);
                    return (
                      <tr key={tool.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-4 py-3.5 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:h-11 sm:w-11"
                              style={!img ? { backgroundColor: `${tool.hue}20`, color: tool.hue } : undefined}>
                              {img ? (
                                <img src={img} alt={tool.name} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center"><Icon className="h-5 w-5" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-bold text-white">{tool.name}</p>
                                {tool.badge && <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">{tool.badge}</span>}
                              </div>
                              <p className="max-w-[220px] truncate text-xs text-neutral-500">{tool.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3.5 text-neutral-400 md:table-cell sm:px-6">{tool.category}</td>
                        <td className="hidden px-4 py-3.5 text-neutral-400 sm:table-cell sm:px-6">{tool.duration}</td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                            ★ {tool.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => { setEditingTool(tool); setIsModalOpen(true); }} title="Edit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(tool.id)} title="Delete"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-neutral-600">
          {filtered.length} of {tools.length} tools · Endpoint: <code className="text-neutral-500">{API_URL}</code>
        </p>
      </main>

      {isModalOpen && (
        <ToolFormModal
          tool={editingTool}
          onClose={() => { if (!isSaving) setIsModalOpen(false); }}
          onSave={handleSave}
          saving={isSaving}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

/* Local icon helper (Star) to avoid extra import */
function Star(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
