import fs from 'fs';

const html = fs.readFileSync('docs/research/wwyn-vn/root/rendered_page.html', 'utf-8');

function extractTag(html, startTag, endTag) {
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) return null;
  const endIdx = html.indexOf(endTag, startIdx);
  if (endIdx === -1) return null;
  return html.slice(startIdx, endIdx + endTag.length);
}

// Write out all individual pieces to inspection files
const menuDesktop = html.match(/<div id="menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0] || 'not found';
fs.writeFileSync('docs/research/wwyn-vn/root/menu_desktop.html', menuDesktop);

const menuMobile = html.match(/<div id="menu-mobile"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0] || 'not found';
fs.writeFileSync('docs/research/wwyn-vn/root/menu_mobile.html', menuMobile);

const mmenu = html.match(/<nav id="mmenu"[\s\S]*?<\/nav>/)?.[0] || 'not found';
fs.writeFileSync('docs/research/wwyn-vn/root/mmenu.html', mmenu);

const slideshow = html.match(/<div class="slideshow"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/)?.[0] || 'not found';
fs.writeFileSync('docs/research/wwyn-vn/root/slideshow.html', slideshow);

const footer = html.match(/<div id="footer"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/)?.[0] || 'not found';
fs.writeFileSync('docs/research/wwyn-vn/root/footer.html', footer);

console.log('Saved section HTML files successfully!');
