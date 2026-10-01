import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://wwyn.vn/';
const SITE_KEY = 'wwyn-vn';
const PAGE_KEY = 'root';

const artifactRoot = path.resolve(`docs/research/${SITE_KEY}/${PAGE_KEY}`);
const screenshotRoot = path.resolve(`docs/design-references/${SITE_KEY}/${PAGE_KEY}`);
const componentRoot = path.resolve(`src/components/sites/${SITE_KEY}/${PAGE_KEY}`);
const assetRoot = path.resolve(`public/sites/${SITE_KEY}/${PAGE_KEY}`);

fs.mkdirSync(artifactRoot, { recursive: true });
fs.mkdirSync(path.join(artifactRoot, 'components'), { recursive: true });
fs.mkdirSync(screenshotRoot, { recursive: true });
fs.mkdirSync(componentRoot, { recursive: true });
fs.mkdirSync(assetRoot, { recursive: true });
fs.mkdirSync(path.join(assetRoot, 'images'), { recursive: true });

async function run() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait a few seconds for sliders/carousels to initialize
  await new Promise(r => setTimeout(r, 3000));

  console.log('Capturing desktop full page screenshot...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'desktop-full.png'),
    fullPage: true
  });

  console.log('Capturing desktop viewport screenshot...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'desktop-viewport.png'),
    fullPage: false
  });

  // Extract comprehensive inspection data
  console.log('Extracting page inspection data...');
  const inspectionData = await page.evaluate(() => {
    // 1. Fonts
    const fonts = [...new Set([...document.querySelectorAll('*')].slice(0, 300).map(el => getComputedStyle(el).fontFamily))];

    // 2. Colors
    const colors = new Set();
    [...document.querySelectorAll('*')].slice(0, 400).forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.color) colors.add(cs.color);
      if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(cs.backgroundColor);
      if (cs.borderColor && cs.borderColor !== 'rgba(0, 0, 0, 0)') colors.add(cs.borderColor);
    });

    // 3. Images
    const images = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.getAttribute('src'),
      currentSrc: img.currentSrc,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      className: img.className,
      parentTag: img.parentElement?.tagName,
      parentClass: img.parentElement?.className
    }));

    // 4. Background images
    const backgroundImages = [...document.querySelectorAll('*')].filter(el => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && bg !== 'none' && !bg.includes('gradient');
    }).map(el => ({
      url: getComputedStyle(el).backgroundImage,
      tag: el.tagName,
      className: el.className
    }));

    // 5. Sections and structural outline
    const sections = [...document.querySelectorAll('header, nav, main, section, footer, div[class*="banner"], div[class*="slider"], div[class*="product"], div[id*="menu"], div[class*="footer"], div[class*="container"]')].map(el => ({
      tag: el.tagName.toLowerCase(),
      id: el.id,
      className: el.className,
      rect: {
        top: el.getBoundingClientRect().top,
        height: el.getBoundingClientRect().height,
        width: el.getBoundingClientRect().width
      },
      textSnippet: el.textContent.trim().slice(0, 100)
    }));

    // 6. Header and nav structure
    const menuEl = document.querySelector('#menu, .menu, header, nav');
    const menuHtml = menuEl ? menuEl.outerHTML : null;

    // 7. Products extraction
    const productItems = [...document.querySelectorAll('.box-product, .item-product, .product-item, [class*="product-"]')].map(p => {
      const img = p.querySelector('img');
      const name = p.querySelector('.name-product, .title, .name, h3, a')?.textContent?.trim();
      const price = p.querySelector('.price, .price-new, [class*="price"]')?.textContent?.trim();
      const oldPrice = p.querySelector('.price-old, del, strike')?.textContent?.trim();
      return {
        name,
        price,
        oldPrice,
        image: img ? (img.src || img.getAttribute('src')) : null,
        html: p.outerHTML
      };
    });

    // 8. Footer extraction
    const footerEl = document.querySelector('footer, #footer, .footer');
    const footerHtml = footerEl ? footerEl.outerHTML : null;

    // 9. Full body HTML structure (clean overview)
    const rawHtml = document.documentElement.outerHTML;

    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content,
      fonts: [...fonts],
      colors: [...colors],
      images,
      backgroundImages,
      sections,
      menuHtml,
      productCount: productItems.length,
      productItems: productItems.slice(0, 30),
      footerHtml,
      bodyClasses: document.body.className,
      rawHtmlLength: rawHtml.length
    };
  });

  fs.writeFileSync(
    path.join(artifactRoot, 'inspection_data.json'),
    JSON.stringify(inspectionData, null, 2),
    'utf-8'
  );

  // Save the full rendered HTML
  const fullHtml = await page.content();
  fs.writeFileSync(path.join(artifactRoot, 'rendered_page.html'), fullHtml, 'utf-8');

  // Test mobile view
  console.log('Resizing to mobile 390x844...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing mobile full page screenshot...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'mobile-full.png'),
    fullPage: true
  });

  console.log('Capturing mobile viewport screenshot...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'mobile-viewport.png'),
    fullPage: false
  });

  await browser.close();
  console.log('Inspection completed successfully!');
}

run().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
