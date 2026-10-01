import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function check() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://wwyn.vn/', { waitUntil: 'networkidle2' });
  const logoInfo = await page.evaluate(() => {
    const el = document.querySelector('#menu .logo img');
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    return {
      src: el.src,
      currentSrc: el.currentSrc,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      width: cs.width,
      height: cs.height,
      rect,
      parentRect
    };
  });
  console.log('Logo info on live site:', logoInfo);
  await browser.close();
}

check();
