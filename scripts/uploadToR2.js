require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mime = require("mime-types");
const { uploadToR2, bucketName, publicUrl } = require("../server/config/r2");

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const MAPPING_FILE = path.resolve(__dirname, "../docs/r2-mapping.json");

function computeHash(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex").slice(0, 8);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif"].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function run() {
  console.log("=================================================");
  console.log(`🚀 BẮT ĐẦU TẢI ẢNH LÊN CLOUDFLARE R2 (${bucketName})`);
  console.log(`📡 Public CDN: ${publicUrl}`);
  console.log("=================================================\n");

  const targetDirs = [
    path.join(PUBLIC_DIR, "images"),
    path.join(PUBLIC_DIR, "sites"),
  ];

  let filesToUpload = [];
  targetDirs.forEach((dir) => {
    filesToUpload = filesToUpload.concat(getAllFiles(dir));
  });

  console.log(`🔍 Tìm thấy ${filesToUpload.length} tệp ảnh trong thư mục public...\n`);

  let mapping = {};
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf8"));
    } catch (e) {
      mapping = {};
    }
  }
  let successCount = 0;

  for (let i = 0; i < filesToUpload.length; i++) {
    const filePath = filesToUpload[i];
    const relativeLocalPath = "/" + path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/");
    if (mapping[relativeLocalPath]) {
      console.log(`[${i + 1}/${filesToUpload.length}] ⏭ Đã tải: ${relativeLocalPath}`);
      successCount++;
      continue;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const hash = computeHash(fileBuffer);
    const parsed = path.parse(filePath);
    const ext = parsed.ext.toLowerCase();
    const cleanBaseName = parsed.name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

    // Determine clean R2 folder
    let folder = "products";
    if (cleanBaseName.includes("banner") || cleanBaseName.includes("mega-menu")) {
      folder = "banners";
    } else if (cleanBaseName.includes("logo") || cleanBaseName.includes("favicon") || cleanBaseName.includes("icon") || cleanBaseName.includes("cart") || cleanBaseName.includes("user")) {
      folder = "branding";
    }

    const uniqueKey = `${folder}/${cleanBaseName}-${hash}${ext}`;
    const contentType = mime.lookup(filePath) || "image/webp";

    try {
      const r2Url = await uploadToR2({
        key: uniqueKey,
        body: fileBuffer,
        contentType,
      });

      mapping[relativeLocalPath] = r2Url;
      successCount++;
      console.log(`[${i + 1}/${filesToUpload.length}] ✓ ${uniqueKey} -> ${r2Url}`);
    } catch (err) {
      console.error(`[${i + 1}/${filesToUpload.length}] ✗ Lỗi tải ${relativeLocalPath}:`, err.message);
    }
  }

  // Ensure docs dir exists
  const docsDir = path.dirname(MAPPING_FILE);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), "utf8");

  console.log("\n=================================================");
  console.log(`🎉 ĐÃ HOÀN TẤT: Tải thành công ${successCount}/${filesToUpload.length} tệp ảnh lên Cloudflare R2!`);
  console.log(`💾 Bảng đối chiếu đã lưu vào: ${MAPPING_FILE}`);
  console.log("=================================================");
}

run().catch(console.error);
