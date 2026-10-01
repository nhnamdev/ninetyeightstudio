import fs from 'fs';

const html = fs.readFileSync('docs/research/wwyn-vn/root/rendered_page.html', 'utf-8');

const start = html.indexOf('<div class="slideshow"');
const end = html.indexOf('<div id="footer"', start);
const slideshowHtml = html.slice(start, end);
fs.writeFileSync('docs/research/wwyn-vn/root/slideshow.html', slideshowHtml, 'utf-8');
console.log('Slideshow extracted, length:', slideshowHtml.length);
