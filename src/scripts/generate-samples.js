const fs = require('fs').promises;
const path = require('path');
const { generateResume } = require('../index');

const SAMPLE_INPUT = path.resolve(__dirname, '..', '..', 'data', 'resume-data-example.json');
const SAMPLE_PHOTO = path.resolve(__dirname, '..', '..', 'assets', 'photo-example.jpg');
const SAMPLE_OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'sample-output');

const SAMPLE_CONFIGS = [
  { theme: 'modern', color: 'red' },
  { theme: 'corpo', color: 'green' },
  { theme: 'default', color: 'violet' },
  { theme: 'minimalist', color: null }
];

function escapePdfText(text) {
  return text.replace(/[()\\]/g, char => `\\${char}`);
}

async function writePlaceholderPdf(targetPath) {
  const message = 'Sample PDF placeholder – see HTML file for full rendering.';
  const content = `BT /F1 18 Tf 72 720 Td (${escapePdfText(message)}) Tj ET`;
  const pdf = [
    '%PDF-1.4',
    '1 0 obj',
    '<< /Type /Catalog /Pages 2 0 R >>',
    'endobj',
    '2 0 obj',
    '<< /Type /Pages /Count 1 /Kids [3 0 R] >>',
    'endobj',
    '3 0 obj',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    'endobj',
    '4 0 obj',
    `<< /Length ${content.length} >>`,
    'stream',
    content,
    'endstream',
    'endobj',
    '5 0 obj',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    'endobj',
    'trailer',
    '<< /Root 1 0 R /Size 6 >>',
    '%%EOF'
  ].join('\n');

  await fs.writeFile(targetPath, pdf, 'utf-8');
  console.log(`Placeholder PDF written: ${targetPath}`);
}

async function main() {
  console.log('Generating sample Resumes using example data and photo...\n');

  await fs.mkdir(SAMPLE_OUTPUT_DIR, { recursive: true });
  // Copy example assets for easy inspection alongside generated HTML
  await fs.copyFile(SAMPLE_INPUT, path.join(SAMPLE_OUTPUT_DIR, 'resume-data-example.json'));
  await fs.copyFile(SAMPLE_PHOTO, path.join(SAMPLE_OUTPUT_DIR, 'photo-example.jpg'));

  for (const { theme, color } of SAMPLE_CONFIGS) {
    const results = await generateResume({
      inputPath: SAMPLE_INPUT,
      outputDir: SAMPLE_OUTPUT_DIR,
      themeName: theme,
      colorName: color,
      photoPath: SAMPLE_PHOTO,
      htmlOnly: true,
      generateAll: false
    });

    for (const result of results) {
      const htmlDir = path.dirname(result.htmlPath);
      const baseName = path.basename(result.htmlPath, '.html');
      const pdfDir = path.join(path.dirname(htmlDir), 'pdf');
      await fs.mkdir(pdfDir, { recursive: true });
      const pdfPath = path.join(pdfDir, `${baseName}.pdf`);
      await writePlaceholderPdf(pdfPath);
    }
  }

  console.log('\n✓ Sample Resumes written to sample-output/');
}

main().catch(error => {
  console.error('Failed to generate sample Resumes:', error);
  process.exit(1);
});
