const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const SAMPLE_OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'sample-output');
const PREVIEWS_DIR = path.resolve(__dirname, '..', '..', 'previews');

// Define which Resumes to generate previews for
const PREVIEW_CONFIGS = [
  { htmlPath: 'sample-output/classic/html/resume_classic.html', outputName: 'classic-mono.png' },
  { htmlPath: 'sample-output/corpo/html/resume_corpo_green.html', outputName: 'corpo-green.png' },
  { htmlPath: 'sample-output/default/html/resume_default_blue.html', outputName: 'default-blue.png' },
];

async function generatePreview(htmlPath, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Read HTML file
    const fullHtmlPath = path.resolve(__dirname, '..', '..', htmlPath);
    const htmlContent = await fs.readFile(fullHtmlPath, 'utf-8');

    // Set viewport to A4 proportions (210mm x 297mm at 96 DPI)
    await page.setViewport({
      width: 794,  // ~210mm at 96 DPI
      height: 1123, // ~297mm at 96 DPI
      deviceScaleFactor: 2 // Higher quality screenshot
    });

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: false, // Only capture the viewport (first page)
      type: 'png'
    });

    console.log(`Preview generated: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Generating PNG previews from HTML Resumes...\n');

  // Ensure previews directory exists
  await fs.mkdir(PREVIEWS_DIR, { recursive: true });

  for (const { htmlPath, outputName } of PREVIEW_CONFIGS) {
    const outputPath = path.join(PREVIEWS_DIR, outputName);

    try {
      await generatePreview(htmlPath, outputPath);
    } catch (error) {
      console.error(`Failed to generate preview for ${htmlPath}:`, error.message);
    }
  }

  console.log('\n✓ Preview generation complete!');
}

main().catch(error => {
  console.error('Failed to generate previews:', error);
  process.exit(1);
});
