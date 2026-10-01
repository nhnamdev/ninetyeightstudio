import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOCAL_URL = 'http://localhost:3005/';
const screenshotRoot = path.resolve('docs/design-references/wwyn-vn/root');

async function runQA() {
  console.log('Launching Chrome for Visual QA...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to cloned site:', LOCAL_URL);
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing clone desktop viewport...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-desktop-viewport.png'),
    fullPage: false
  });

  console.log('Capturing clone desktop full page...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-desktop-full.png'),
    fullPage: true
  });

  // Test mega menu hover
  console.log('Testing mega menu hover...');
  await page.hover('.cuahang');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-desktop-megamenu.png'),
    fullPage: false
  });

  // Test mobile view
  console.log('Resizing to mobile 390x844...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing clone mobile viewport...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-mobile-viewport.png'),
    fullPage: false
  });

  console.log('Capturing clone mobile full page...');
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-mobile-full.png'),
    fullPage: true
  });

  // Test mobile hamburger click
  console.log('Opening mobile drawer...');
  await page.click('#hamburger');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(screenshotRoot, 'clone-mobile-drawer.png'),
    fullPage: false
  });

  await browser.close();
  console.log('Visual QA screenshots captured successfully!');
}

runQA().catch(err => {
  console.error('Visual QA error:', err);
  process.exit(1);
});
