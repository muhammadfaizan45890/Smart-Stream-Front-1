// server/index.js
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ════════════════════════════════════════════════════════════
   PATHS
   ════════════════════════════════════════════════════════════ */
const TOOLS_FILE = path.join(__dirname, "..", "tools.json");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");

// Make sure the uploads directory exists before anything else
await fs.mkdir(UPLOADS_DIR, { recursive: true });

/* ════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════ */
const app = express();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000").split(",");

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests without an origin (curl, server-to-server) and any localhost port in dev
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// Serve uploaded images at /uploads/<filename>
app.use("/uploads", express.static(UPLOADS_DIR, {
  maxAge: "7d",
  setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=604800, immutable"),
}));

/* ════════════════════════════════════════════════════════════
   MULTER — image uploads
   ════════════════════════════════════════════════════════════ */
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : ".png";
    cb(null, `tool-${randomUUID()}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, WebP, GIF, or SVG images are allowed"));
    }
    cb(null, true);
  },
});

/* ════════════════════════════════════════════════════════════
   DEFAULT TOOLS (used only on very first run)
   ════════════════════════════════════════════════════════════ */
const DEFAULT_TOOLS = [
  {
    id: "gemini-pro", name: "Gemini Advanced (Pro)", category: "AI Chat",
    duration: "1 Month", rating: 4.9, reviews: 1240,
    icon: "SiGooglegemini", hue: "#3b82f6", badge: "HOT",
    desc: "Unlock Google's most capable AI model. Includes 2TB of Google One storage and integration with Gmail, Docs, and more.",
    features: ["Gemini 1.5 Pro Access", "2TB Cloud Storage", "Google Workspace Integration", "Priority Support"],
    image: "",
  },
  {
    id: "youtube-premium", name: "YouTube Premium", category: "Entertainment",
    duration: "1 Month", rating: 4.8, reviews: 3890,
    icon: "SiYoutube", hue: "#ef4444", badge: "POPULAR",
    desc: "Ad-free YouTube, YouTube Music Premium, offline downloads, and background play on all your devices.",
    features: ["Ad-free Video", "YouTube Music Premium", "Background Play", "Offline Downloads"],
    image: "",
  },
  {
    id: "cursor-pro", name: "Cursor AI Pro", category: "Coding",
    duration: "1 Month", rating: 5.0, reviews: 850,
    icon: "SiCursor", hue: "#10b981", badge: "DEV FAV",
    desc: "The AI-first code editor. Built for pair programming with an AI that deeply understands your codebase.",
    features: ["Unlimited AI Completions", "Claude 3.5 Sonnet Access", "GPT-4o Access", "Multi-file Edits"],
    image: "",
  },
  {
    id: "midjourney", name: "Midjourney Basic", category: "Image Gen",
    duration: "1 Month", rating: 4.9, reviews: 2100,
    icon: "MidjourneyIcon", hue: "#d946ef", badge: "",
    desc: "Generate stunning, high-resolution images from simple text prompts using one of the best AI image models.",
    features: ["~200 Generations/Month", "Standard Resolution", "Web App Access", "Commercial Use"],
    image: "",
  },
  {
    id: "elevenlabs", name: "ElevenLabs Creator", category: "Audio & Voice",
    duration: "1 Month", rating: 4.8, reviews: 940,
    icon: "SiElevenlabs", hue: "#f59e0b", badge: "NEW",
    desc: "A realistic AI text-to-speech engine. Clone your voice or use thousands of studio-quality voices.",
    features: ["100k Characters/Month", "Voice Cloning", "Commercial License", "29 Languages"],
    image: "",
  },
  {
    id: "claude-pro", name: "Claude Pro", category: "AI Chat",
    duration: "1 Month", rating: 4.9, reviews: 1670,
    icon: "SiAnthropic", hue: "#f97316", badge: "",
    desc: "Anthropic's Claude. Exceptional at coding, reasoning, and analyzing massive documents.",
    features: ["Latest Claude models", "5x more usage", "Priority access", "Early features"],
    image: "",
  },
];

/* ════════════════════════════════════════════════════════════
   STORAGE — atomic reads/writes + write mutex
   ════════════════════════════════════════════════════════════ */
let writeChain = Promise.resolve();
const withWriteLock = (fn) => {
  const run = writeChain.then(fn, fn);
  writeChain = run.catch(() => {});
  return run;
};

async function readTools() {
  try {
    const raw = await fs.readFile(TOOLS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("tools.json is not an array");
    return parsed;
  } catch (err) {
    if (err.code === "ENOENT") {
      // First run — seed with defaults
      await atomicWrite(DEFAULT_TOOLS);
      return DEFAULT_TOOLS;
    }
    throw err; // corruption / permission error → surface it
  }
}

async function atomicWrite(tools) {
  const tmp = `${TOOLS_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(tools, null, 2), "utf-8");
  await fs.rename(tmp, TOOLS_FILE); // atomic on same filesystem
}

/* ════════════════════════════════════════════════════════════
   VALIDATION
   ════════════════════════════════════════════════════════════ */
const CATEGORIES = new Set(["AI Chat", "Coding", "Image Gen", "Audio & Voice", "Entertainment"]);
const DURATIONS = new Set(["1 Month", "3 Months", "6 Months", "1 Year"]);

function validateTool(input, { partial = false } = {}) {
  const errors = [];
  const out = {};

  const need = (field) => !partial || input[field] !== undefined;

  if (need("name")) {
    if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
    else out.name = input.name.trim().slice(0, 120);
  }
  if (need("category")) {
    if (!CATEGORIES.has(input.category)) errors.push(`category must be one of: ${[...CATEGORIES].join(", ")}`);
    else out.category = input.category;
  }
  if (need("duration")) {
    if (!DURATIONS.has(input.duration)) errors.push(`duration must be one of: ${[...DURATIONS].join(", ")}`);
    else out.duration = input.duration;
  }
  if (need("rating")) {
    const n = Number(input.rating);
    if (!Number.isFinite(n) || n < 0 || n > 5) errors.push("rating must be 0–5");
    else out.rating = Math.round(n * 10) / 10;
  }
  if (need("reviews")) {
    const n = Number(input.reviews);
    if (!Number.isInteger(n) || n < 0) errors.push("reviews must be a non-negative integer");
    else out.reviews = n;
  }
  if (need("hue")) {
    if (typeof input.hue !== "string" || !/^#[0-9a-fA-F]{6}$/.test(input.hue)) errors.push("hue must be a hex color like #3b82f6");
    else out.hue = input.hue;
  }
  if (input.icon !== undefined) {
    if (typeof input.icon !== "string" || input.icon.length > 40) errors.push("icon must be a short string");
    else out.icon = input.icon;
  }
  if (input.badge !== undefined) out.badge = String(input.badge || "").slice(0, 24);
  if (need("desc")) {
    if (typeof input.desc !== "string" || !input.desc.trim()) errors.push("desc is required");
    else out.desc = input.desc.trim().slice(0, 2000);
  }
  if (need("features")) {
    if (!Array.isArray(input.features)) errors.push("features must be an array");
    else out.features = input.features.map((f) => String(f).trim()).filter(Boolean).slice(0, 20);
  }
  if (input.image !== undefined) {
    const img = String(input.image || "").trim();
    // Accept /uploads/…, http(s)://…, or data:image/… ; reject anything else
    const ok = !img || img.startsWith("/uploads/") || /^https?:\/\//i.test(img) || img.startsWith("data:image/");
    if (!ok) errors.push("image must be a /uploads/ path or absolute URL");
    else out.image = img.slice(0, 500);
  }

  return { ok: errors.length === 0, errors, value: out };
}

/* ════════════════════════════════════════════════════════════
   IMAGE CLEANUP
   ════════════════════════════════════════════════════════════ */
async function deleteUploadedImage(imagePath) {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;
  const filename = path.basename(imagePath);
  const full = path.join(UPLOADS_DIR, filename);
  // Guard against path traversal
  if (!full.startsWith(UPLOADS_DIR)) return;
  await fs.unlink(full).catch(() => {});
}

/* ════════════════════════════════════════════════════════════
   ROUTES
   ════════════════════════════════════════════════════════════ */

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

// GET all tools
app.get("/api/tools", async (_req, res) => {
  try {
    const tools = await readTools();
    res.json({ success: true, tools });
  } catch (err) {
    console.error("[GET /api/tools]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD or UPDATE a tool
app.post("/api/tools", async (req, res) => {
  const { ok, errors, value } = validateTool(req.body || {});
  if (!ok) return res.status(400).json({ success: false, message: errors.join("; "), errors });

  try {
    const toolId = (req.body.id || `tool-${randomUUID()}`).slice(0, 80);

    const result = await withWriteLock(async () => {
      const tools = await readTools();
      const idx = tools.findIndex((t) => t.id === toolId);
      let previousImage = "";

      if (idx >= 0) {
        previousImage = tools[idx].image || "";
        tools[idx] = { ...tools[idx], ...value, id: toolId };
      } else {
        tools.unshift({ ...value, id: toolId });
      }

      await atomicWrite(tools);

      // If the image changed, clean up the old file
      const newImage = idx >= 0 ? tools[idx].image : value.image;
      if (previousImage && previousImage !== newImage) {
        await deleteUploadedImage(previousImage);
      }
      return tools;
    });

    res.json({ success: true, tools: result });
  } catch (err) {
    console.error("[POST /api/tools]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a tool (and its uploaded image)
app.delete("/api/tools/:id", async (req, res) => {
  try {
    const result = await withWriteLock(async () => {
      const tools = await readTools();
      const target = tools.find((t) => t.id === req.params.id);
      if (!target) return { found: false };

      const filtered = tools.filter((t) => t.id !== req.params.id);
      await atomicWrite(filtered);
      await deleteUploadedImage(target.image);
      return { found: true, tools: filtered };
    });

    if (!result.found) {
      return res.status(404).json({ success: false, message: "Tool not found" });
    }
    res.json({ success: true, tools: result.tools });
  } catch (err) {
    console.error("[DELETE /api/tools/:id]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload an image → returns { success, url: "/uploads/tool-<uuid>.png" }
app.post("/api/upload", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({ success: false, message: err.message });
    }
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded (expected field 'image')" });

    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

// 404 fallback for unknown /api routes
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

/* ════════════════════════════════════════════════════════════
   ERROR HANDLER
   ════════════════════════════════════════════════════════════ */
app.use((err, _req, res, _next) => {
  console.error("[UNHANDLED]", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

/* ════════════════════════════════════════════════════════════
   START
   ════════════════════════════════════════════════════════════ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("\n✅ SmartStream Tools API running");
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   Data file:     ${TOOLS_FILE}`);
  console.log(`   Uploads dir:   ${UPLOADS_DIR}`);
  console.log(`   Allowed CORS:  ${ALLOWED_ORIGINS.join(", ")}`);
  console.log(`   Health check:  http://localhost:${PORT}/api/health\n`);
});
