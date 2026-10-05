const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { uploadToR2 } = require("../config/r2");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Memory storage to stream buffer directly to Cloudflare R2
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new Error("Chỉ chấp nhận các định dạng ảnh: JPEG, JPG, PNG, WEBP, GIF, SVG!"));
  },
});

// Helper to compute 8-char MD5 hash
function computeHash(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex").slice(0, 8);
}

// POST /api/upload - Single file upload
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn tệp ảnh cần tải lên!" });
    }

    const { folder = "products" } = req.body;
    const parsed = path.parse(req.file.originalname);
    const cleanBaseName = parsed.name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    const ext = parsed.ext.toLowerCase();
    const hash = computeHash(req.file.buffer);

    // Unique filename with hash and folder
    const uniqueKey = `${folder}/${cleanBaseName}-${hash}${ext}`;

    const r2Url = await uploadToR2({
      key: uniqueKey,
      body: req.file.buffer,
      contentType: req.file.mimetype || "image/webp",
    });

    return res.json({
      success: true,
      message: "Tải ảnh lên Cloudflare R2 thành công!",
      data: {
        url: r2Url,
        key: uniqueKey,
        originalName: req.file.originalname,
        size: req.file.size,
        contentType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi tải ảnh lên Cloudflare R2",
      error: error.message,
    });
  }
});

// POST /api/upload/multiple - Multiple files upload
router.post("/multiple", verifyToken, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ít nhất một tệp ảnh!" });
    }

    const { folder = "products" } = req.body;
    const results = [];

    for (const file of req.files) {
      const parsed = path.parse(file.originalname);
      const cleanBaseName = parsed.name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
      const ext = parsed.ext.toLowerCase();
      const hash = computeHash(file.buffer);

      const uniqueKey = `${folder}/${cleanBaseName}-${hash}${ext}`;

      const r2Url = await uploadToR2({
        key: uniqueKey,
        body: file.buffer,
        contentType: file.mimetype || "image/webp",
      });

      results.push({
        url: r2Url,
        key: uniqueKey,
        originalName: file.originalname,
      });
    }

    return res.json({
      success: true,
      message: `Tải thành công ${results.length} ảnh lên Cloudflare R2!`,
      data: results,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi tải danh sách ảnh lên Cloudflare R2",
      error: error.message,
    });
  }
});

module.exports = router;
