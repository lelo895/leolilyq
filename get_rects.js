const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1512, height: 739 });
  await page.goto('file:///Users/lelo/Documents/P-L/index.html');
  // click the journal to open it
  await page.click('#journal-trigger');
  await page.waitForTimeout(2000); // wait for animation
  
  const rects = await page.evaluate(() => {
    const getRect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    };
    return {
      canvas: getRect('#canvas-container'),
      notebook: getRect('.notebook'),
      leftPage: getRect('.left-page'),
      wrapper: getRect('.left-page .page-content-wrapper'),
      grid: getRect('.left-page .photos-grid')
    };
  });
  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
