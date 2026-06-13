const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");

function resolveStoragePath(value, fallback) {
  if (!value) return fallback;
  return path.isAbsolute(value) ? value : path.join(ROOT, value);
}

const UPLOAD_DIR = resolveStoragePath(process.env.UPLOAD_DIR, path.join(ROOT, "uploads"));
const DATA_DIR = resolveStoragePath(process.env.DATA_DIR, path.join(ROOT, "data"));
const DATA_FILE = path.join(DATA_DIR, "images.json");

for (const dir of [UPLOAD_DIR, DATA_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ images: [] }, null, 2));
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}

function ensureAnonymousId(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  req.anonId = cookies.anon_id;

  if (!req.anonId) {
    req.anonId = crypto.randomUUID();
    res.cookie("anon_id", req.anonId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
  }

  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("只能上传图片文件"));
      return;
    }
    cb(null, true);
  }
});

app.use(express.json());
app.use(ensureAnonymousId);
app.use(express.static(PUBLIC_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/images", (req, res) => {
  const data = readData();
  const images = data.images
    .map((image) => ({
      id: image.id,
      title: image.title,
      url: image.url,
      createdAt: image.createdAt,
      votes: image.votes.length,
      voted: image.votes.includes(req.anonId)
    }))
    .sort((a, b) => b.votes - a.votes || new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ images });
});

app.post("/api/images", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "请先选择一张图片" });
    return;
  }

  const data = readData();
  const image = {
    id: crypto.randomUUID(),
    title: String(req.body.title || "未命名图片").trim().slice(0, 60),
    url: `/uploads/${req.file.filename}`,
    createdAt: new Date().toISOString(),
    votes: []
  };

  data.images.push(image);
  writeData(data);
  res.status(201).json({ image });
});

app.post("/api/images/:id/vote", (req, res) => {
  const data = readData();
  const image = data.images.find((item) => item.id === req.params.id);

  if (!image) {
    res.status(404).json({ message: "图片不存在" });
    return;
  }

  const voteIndex = image.votes.indexOf(req.anonId);
  const voted = voteIndex === -1;

  if (voted) {
    image.votes.push(req.anonId);
  } else {
    image.votes.splice(voteIndex, 1);
  }

  writeData(data);
  res.json({ votes: image.votes.length, voted });
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || "请求处理失败" });
});

app.listen(PORT, () => {
  console.log(`图片投票网站已启动：http://localhost:${PORT}`);
});
