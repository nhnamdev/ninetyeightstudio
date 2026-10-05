const fs = require('fs');
const path = require('path');

const mappingPath = path.resolve('docs/r2-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

function scanAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['.next', 'node_modules', '.git'].includes(file)) {
        scanAndReplace(fullPath);
      }
    } else if (['.ts', '.tsx', '.js', '.jsx', '.json'].includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [localPath, r2Url] of Object.entries(mapping)) {
        if (content.includes(`"${localPath}"`)) {
          content = content.replaceAll(`"${localPath}"`, `"${r2Url}"`);
          changed = true;
        } else if (content.includes(`'${localPath}'`)) {
          content = content.replaceAll(`'${localPath}'`, `'${r2Url}'`);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Updated R2 URLs in: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

scanAndReplace(path.resolve('src'));
console.log('--- Hoàn tất thay thế URL R2 trên toàn bộ thư mục src ---');
