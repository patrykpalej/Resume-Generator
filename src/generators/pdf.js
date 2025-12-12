const puppeteer = require('puppeteer');

async function generatePDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security', // Allow loading fonts from CDN
      '--font-render-hinting=none'
    ]
  });

  try {
    const page = await browser.newPage();

    // Capture console messages from page evaluation
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('GDPR positioning')) {
        console.log(`  ${text}`);
      }
    });

    // Set viewport to match A4 dimensions for consistent rendering
    // A4 at 96 DPI: 794px x 1123px
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2 // Higher resolution for better text rendering
    });

    // Set content and wait for network to be idle
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait for all fonts to load (Font Awesome icons)
    await page.evaluateHandle('document.fonts.ready');

    // Add CSS for emoji images (Twemoji) to ensure proper sizing
    await page.addStyleTag({
      content: `
        img.emoji {
          height: 1em;
          width: 1em;
          margin: 0 0.05em 0 0.1em;
          vertical-align: -0.1em;
          display: inline-block;
        }
      `
    });

    // Convert emojis to SVG using Twemoji for reliable PDF rendering
    try {
      await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js'
      });

      await page.evaluate(() => {
        // Parse emojis and convert to SVG images
        if (window.twemoji) {
          twemoji.parse(document.body, {
            folder: 'svg',
            ext: '.svg',
            base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/',
            className: 'emoji'
          });
        }
      });

      // Wait for emoji SVG images to load
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.warn('Twemoji loading failed, emojis may not render correctly:', err.message);
      // Continue anyway - Font Awesome should still work
    }

    // Dynamic GDPR positioning based on content length
    await page.evaluate(() => {
      // A4 dimensions: 210mm x 297mm
      // Thresholds for detecting which scenario applies (with buffer for variations)
      const ONE_PAGE_THRESHOLD = 280; // mm (detection threshold)
      const TWO_PAGE_THRESHOLD = 590; // mm (detection threshold)

      // Actual body heights to ensure GDPR ends (not starts) at bottom of page
      const ONE_PAGE_BODY_HEIGHT = 277; // mm (1 page minus margins)
      const TWO_PAGE_BODY_HEIGHT = 568; // mm (2 pages minus margins)

      const body = document.body;
      const gdprWrapper = document.querySelector('.gdpr-watermark-wrapper');

      if (!gdprWrapper) {
        return;
      }

      // Prepare body for measurement
      body.style.display = 'block';
      body.style.minHeight = 'auto';
      body.style.height = 'auto';
      body.style.position = 'relative';
      body.style.overflow = 'visible';
      body.style.boxSizing = 'border-box';

      // Style content wrapper
      const contentWrapper = document.querySelector('.content-wrapper');
      if (contentWrapper) {
        contentWrapper.style.display = 'block';
        contentWrapper.style.flex = 'none';
      }

      // Temporarily hide GDPR wrapper to measure content height
      gdprWrapper.style.display = 'none';
      const contentHeight = body.scrollHeight;

      // Show GDPR wrapper and measure total height
      gdprWrapper.style.display = 'block';
      gdprWrapper.style.position = 'relative';
      gdprWrapper.style.margin = '0';

      const totalHeight = body.scrollHeight;
      const gdprHeight = totalHeight - contentHeight;

      // Convert pixels to mm (96 DPI: 1mm ≈ 3.78px)
      const totalHeightMm = totalHeight / 3.78;

      // Determine positioning strategy based on total content height
      if (totalHeightMm <= ONE_PAGE_THRESHOLD) {
        // SCENARIO 1: Content fits on one page - fix GDPR wrapper at bottom of page 1
        console.log(`GDPR positioning: Single page (${totalHeightMm.toFixed(0)}mm)`);
        body.style.height = ONE_PAGE_BODY_HEIGHT + 'mm';
        gdprWrapper.style.position = 'absolute';
        gdprWrapper.style.bottom = '0';
        gdprWrapper.style.left = '0';
        gdprWrapper.style.right = '0';
      } else if (totalHeightMm <= TWO_PAGE_THRESHOLD) {
        // SCENARIO 2: Content fits on two pages - fix GDPR wrapper at bottom of page 2
        console.log(`GDPR positioning: Two pages (${totalHeightMm.toFixed(0)}mm)`);
        body.style.height = TWO_PAGE_BODY_HEIGHT + 'mm';
        gdprWrapper.style.position = 'absolute';
        gdprWrapper.style.bottom = '0';
        gdprWrapper.style.left = '0';
        gdprWrapper.style.right = '0';
      } else {
        // SCENARIO 3: Content exceeds two pages - place GDPR wrapper after content (natural flow)
        console.log(`GDPR positioning: Multi-page (${totalHeightMm.toFixed(0)}mm)`);
        body.style.height = 'auto';
        gdprWrapper.style.position = 'relative';
        // GDPR wrapper will naturally flow after content
      }
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '10px',
        left: '20px'
      }
    });

    console.log(`PDF generated successfully: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

module.exports = { generatePDF };
