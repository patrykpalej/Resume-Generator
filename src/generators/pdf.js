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

    // Position GDPR at absolute bottom of page 2
    await page.evaluate(() => {
      // A4 dimensions: 210mm x 297mm
      // 2 pages = 594mm total
      // PDF margins: 20px top + 20px bottom = ~10.6mm per page = ~21.2mm for 2 pages
      // We need body to be exactly 2 pages minus the PDF margins

      // Using mm units for accuracy with A4
      // 2 pages = 594mm, minus ~21mm for PDF margins ≈ 573mm
      // But we also need to account for body padding (40px ≈ 10.6mm)

      const body = document.body;
      const gdprClause = document.querySelector('.gdpr-clause');

      if (gdprClause) {
        // Remove flexbox and set fixed height in mm (2 A4 pages minus margins)
        body.style.display = 'block';
        body.style.minHeight = 'auto';
        body.style.height = '568mm'; // 2 pages (594mm) minus margins, tuned to push GDPR to very bottom
        body.style.position = 'relative';
        body.style.overflow = 'visible';
        body.style.boxSizing = 'border-box';

        // Style content wrapper
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
          contentWrapper.style.display = 'block';
          contentWrapper.style.flex = 'none';
        }

        // Position GDPR at absolute bottom of the 2-page body
        gdprClause.style.position = 'absolute';
        gdprClause.style.bottom = '0';
        gdprClause.style.left = '0';
        gdprClause.style.right = '0';
        gdprClause.style.margin = '0';
        gdprClause.style.paddingTop = '20px';
        gdprClause.style.borderTop = '1px solid #ecf0f1';
        gdprClause.style.backgroundColor = '#fff';
      }
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log(`PDF generated successfully: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

module.exports = { generatePDF };
