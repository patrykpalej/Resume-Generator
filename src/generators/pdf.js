const puppeteer = require('puppeteer');

async function generatePDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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
