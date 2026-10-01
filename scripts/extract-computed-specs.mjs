import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://wwyn.vn/';

async function extract() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });

  const props = [
    'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'color',
    'textTransform', 'backgroundColor', 'padding', 'margin', 'width', 'height',
    'maxWidth', 'minWidth', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
    'borderRadius', 'border', 'borderBottom', 'borderTop', 'boxShadow', 'position', 'top', 'right', 'bottom', 'left',
    'zIndex', 'opacity', 'cursor'
  ];

  const selectors = [
    'body',
    '#menu',
    '.logo img',
    '.main-menu',
    '.main-menu > li',
    '.main-menu > li > a',
    '.main-menu > li > a.active',
    '.menu-bar',
    '.flag-active',
    '.flag-text',
    '.menu-icon',
    '.menu-cuahang',
    '.mega-title',
    '.slideshow',
    '.swiper-slide',
    '.slideshow-ab',
    '.btn-slideshow',
    '.btn-slideshow span',
    '#footer',
    '.footer-top',
    '.footer-tit',
    '.form-dknt',
    '.input-dknt input',
    '.btn-dknt',
    '.dknt-slogan',
    '.footer-mxh',
    '.footer-mxh img',
    '.footer-list li a',
    '.footer-content',
    '.footer-bottom',
    '.copyright',
    '.footer-bottom_right',
    '.footer-bottom_right-item',
    '.footer-bottom_right-item span',
    '.footer-bottom_right-item img'
  ];

  const results = await page.evaluate((props, selectors) => {
    const data = {};
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) {
        data[sel] = null;
        continue;
      }
      const cs = getComputedStyle(el);
      const s = {};
      for (const p of props) {
        s[p] = cs[p];
      }
      data[sel] = s;
    }
    return data;
  }, props, selectors);

  // Also check mobile header
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));

  const mobileSelectors = [
    '#menu-mobile',
    '.menu-bar-res',
    '#hamburger',
    '#hamburger span',
    '#menu-mobile .logo img',
    '.footer-top',
    '.footer-1',
    '.footer-bottom'
  ];

  const mobileResults = await page.evaluate((props, selectors) => {
    const data = {};
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) {
        data[sel] = null;
        continue;
      }
      const cs = getComputedStyle(el);
      const s = {};
      for (const p of props) {
        s[p] = cs[p];
      }
      data[sel] = s;
    }
    return data;
  }, props, mobileSelectors);

  fs.writeFileSync('docs/research/wwyn-vn/root/computed_styles.json', JSON.stringify({ desktop: results, mobile: mobileResults }, null, 2));
  console.log('Saved computed styles!');
  await browser.close();
}

extract().catch(console.error);
