import fs from 'fs';

const html = fs.readFileSync('docs/research/wwyn-vn/root/rendered_page.html', 'utf-8');

// Let's find all script tags, modals, templates, divs directly under body
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const body = bodyMatch[1];
  console.log('=== Body length ===', body.length);
  
  // Find all id attributes
  const idMatches = [...body.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
  console.log('=== IDs in body ===', [...new Set(idMatches)]);

  // Let's extract the header, banner, footer, modals
  // Search for div id="menu"
  const menuMatch = body.match(/<div id="menu"[\s\S]*?<\/div>\s*<\/div>/);
  if (menuMatch) {
    console.log('=== Menu snippet ===', menuMatch[0].slice(0, 500));
  }

  // Look for slides or banners
  const sliderMatch = body.match(/<div[^>]*class="[^"]*(slider|banner|slideshow)[^"]*"[\s\S]*?<\/div>/gi);
  console.log('=== Sliders found ===', sliderMatch ? sliderMatch.length : 0);
  if (sliderMatch) {
    sliderMatch.forEach((s, i) => console.log(`Slider ${i}:`, s.slice(0, 300)));
  }

  // Look for modals
  const modalMatch = body.match(/<div[^>]*class="[^"]*modal[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi);
  console.log('=== Modals found ===', modalMatch ? modalMatch.length : 0);
  if (modalMatch) {
    modalMatch.forEach((m, i) => console.log(`Modal ${i}:`, m.slice(0, 300)));
  }
}
