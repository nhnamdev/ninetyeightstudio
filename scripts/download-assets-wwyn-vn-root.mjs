import fs from 'fs';
import path from 'path';

const assets = [
  { url: 'https://wwyn.vn/thumbs/photo/6-3121.png.webp', file: 'logo.webp' },
  { url: 'https://wwyn.vn/assets/img/iconhaschild.png', file: 'iconhaschild.png' },
  { url: 'https://wwyn.vn/assets/img/ngonngu.png', file: 'ngonngu.png' },
  { url: 'https://wwyn.vn/assets/img/timkiem.png', file: 'timkiem.png' },
  { url: 'https://wwyn.vn/assets/img/user.png', file: 'user.png' },
  { url: 'https://wwyn.vn/assets/img/cart.png', file: 'cart.png' },
  { url: 'https://wwyn.vn/thumbs/1920x1080x1/upload/photo/d144739-compressed-1-64810.jpg.webp', file: 'hero-banner.webp' },
  { url: 'https://wwyn.vn/assets/img/dknticon.png', file: 'dknticon.png' },
  { url: 'https://wwyn.vn/thumbs/photo/facebook-2179.png.webp', file: 'facebook.webp' },
  { url: 'https://wwyn.vn/thumbs/photo/instagram-5749.png.webp', file: 'instagram.webp' },
  { url: 'https://wwyn.vn/thumbs/photo/tiktok-3006.png.webp', file: 'tiktok.webp' },
  { url: 'https://wwyn.vn/assets/img/location.png', file: 'location.png' },
  { url: 'https://wwyn.vn/assets/img/global.png', file: 'global.png' },
  { url: 'https://wwyn.vn/upload/photo/avt-3467.jpg', file: 'favicon.jpg' }
];

const destDir = path.resolve('public/sites/wwyn-vn/root/images');
fs.mkdirSync(destDir, { recursive: true });

async function downloadAll() {
  for (const item of assets) {
    const dest = path.join(destDir, item.file);
    console.log(`Downloading ${item.url} -> ${item.file}...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        console.error(`Failed to download ${item.url}: ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved ${item.file} (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${item.url}:`, e);
    }
  }
}

downloadAll();
