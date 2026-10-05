const fs = require('fs');
const path = require('path');

const mappingPath = path.resolve('docs/r2-mapping.json');
const shopProductsPath = path.resolve('src/data/shopProducts.ts');

if (!fs.existsSync(mappingPath) || !fs.existsSync(shopProductsPath)) {
  console.error('File not found!');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
let content = fs.readFileSync(shopProductsPath, 'utf8');

let replaceCount = 0;
for (const [localPath, r2Url] of Object.entries(mapping)) {
  if (content.includes(`"${localPath}"`)) {
    content = content.replaceAll(`"${localPath}"`, `"${r2Url}"`);
    replaceCount++;
  }
}

fs.writeFileSync(shopProductsPath, content, 'utf8');
console.log(`✓ Đã cập nhật ${replaceCount} đường dẫn ảnh trong src/data/shopProducts.ts sang R2!`);
