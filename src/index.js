const fs = require('fs').promises;
const path = require('path');
const { generateHTML } = require('./generators/html');
const { generatePDF } = require('./generators/pdf');
const { DEFAULT_INPUT_PATH, DEFAULT_OUTPUT_DIR, PHOTO_SEARCH_PATHS } = require('./config/constants');
const { getAllThemes, loadTheme } = require('./themes');
const { getAllColors, resolveColor } = require('./colors');

async function loadResumeData(inputPath) {
  const resolvedPath = path.resolve(inputPath);
  const jsonContent = await fs.readFile(resolvedPath, 'utf-8');
  return { resumeData: JSON.parse(jsonContent), resolvedPath };
}

async function loadPhotoBase64(customPhotoPath) {
  const candidates = [];
  if (customPhotoPath) {
    candidates.push(path.resolve(customPhotoPath));
  }
  candidates.push(...PHOTO_SEARCH_PATHS);

  for (const photoPath of candidates) {
    try {
      const photoBuffer = await fs.readFile(photoPath);
      const photoExt = path.extname(photoPath).toLowerCase();
      const mimeType = photoExt === '.png' ? 'image/png' : 'image/jpeg';
      console.log(`Photo loaded from ${photoPath}\n`);
      return `data:${mimeType};base64,${photoBuffer.toString('base64')}`;
    } catch {
      // Continue to next candidate path
    }
  }

  console.log('No photo found - Resume will be generated without photo\n');
  return null;
}

async function ensureOutputDirs(baseOutputDir, themeName) {
  const themeOutputDir = path.join(baseOutputDir, themeName);
  const htmlOutputDir = path.join(themeOutputDir, 'html');
  const pdfOutputDir = path.join(themeOutputDir, 'pdf');

  await fs.mkdir(htmlOutputDir, { recursive: true });
  await fs.mkdir(pdfOutputDir, { recursive: true });

  return { htmlOutputDir, pdfOutputDir };
}

async function generateSingleResume({ outputDir, themeName, colorName, resumeData, photoBase64, htmlOnly = false }) {
  const theme = loadTheme(themeName);
  let resolvedColorName = 'monochromatic';
  let palette;

  if (!theme.monochromatic) {
    const resolvedColor = resolveColor(colorName);
    resolvedColorName = resolvedColor.name;
    palette = resolvedColor.palette;
  }
  const { htmlOutputDir, pdfOutputDir } = await ensureOutputDirs(outputDir, theme.name);

  const displayColor = theme.monochromatic ? 'monochromatic' : resolvedColorName;
  console.log(`Generating: ${theme.name} / ${displayColor}`);

  const htmlContent = generateHTML(resumeData, photoBase64, theme, palette);
  const fileBaseName = theme.monochromatic ? `resume_${theme.name}` : `resume_${theme.name}_${resolvedColorName}`;

  const htmlPath = path.join(htmlOutputDir, `${fileBaseName}.html`);
  await fs.writeFile(htmlPath, htmlContent);

  let pdfPath = null;
  if (!htmlOnly) {
    pdfPath = path.join(pdfOutputDir, `${fileBaseName}.pdf`);
    await generatePDF(htmlContent, pdfPath);
  } else {
    console.log('Skipping PDF generation (html-only mode)');
  }

  return { htmlPath, pdfPath };
}

async function generateResume({
  inputPath = DEFAULT_INPUT_PATH,
  outputDir = DEFAULT_OUTPUT_DIR,
  themeName = null,
  colorName = null,
  generateAll = false,
  photoPath = null,
  htmlOnly = false
}) {
  try {
    const { resumeData, resolvedPath } = await loadResumeData(inputPath);
    console.log(`Using Resume data from ${resolvedPath}\n`);

    const photoBase64 = await loadPhotoBase64(photoPath);
    const resolvedOutputDir = path.resolve(outputDir);
    const generated = [];

    if (generateAll) {
      console.log('Generating all theme/color combinations...\n');

      const themes = getAllThemes();
      const colors = getAllColors();

      if (!themes.length) {
        throw new Error('No themes found. Add a theme file under src/themes.');
      }

      const colorCapableThemes = themes
        .map(name => loadTheme(name))
        .filter(theme => !theme.monochromatic);

      if (colorCapableThemes.length > 0 && colors.length === 0) {
        throw new Error('No colors found. Add a color file under src/colors.');
      }

      for (const themeName of themes) {
        const theme = loadTheme(themeName);
        if (theme.monochromatic) {
          generated.push(
            await generateSingleResume({
              outputDir: resolvedOutputDir,
              themeName,
              colorName: null,
              resumeData,
              photoBase64,
              htmlOnly
            })
          );
        } else {
          for (const color of colors) {
            generated.push(
              await generateSingleResume({
                outputDir: resolvedOutputDir,
                themeName,
                colorName: color,
                resumeData,
                photoBase64,
                htmlOnly
              })
            );
          }
        }
      }

      console.log(`\n✓ Generated ${generated.length} Resume files!`);
    } else {
      if (!themeName) {
        throw new Error('Theme is required when not generating all. Pass --theme <name>.');
      }

      const theme = loadTheme(themeName);
      if (!theme.monochromatic && !colorName) {
        throw new Error(`Color is required for theme "${theme.name}". Pass --color <name> or use --generateAll.`);
      }

      const result = await generateSingleResume({
        outputDir: resolvedOutputDir,
        themeName: theme.name,
        colorName,
        resumeData,
        photoBase64,
        htmlOnly
      });
      generated.push(result);

      console.log('\nResume generation completed successfully!');
      console.log(`- HTML: ${result.htmlPath}`);
      console.log(`- PDF: ${result.pdfPath}`);
    }

    return generated;
  } catch (error) {
    console.error('Error generating Resume:', error.message);
    process.exitCode = 1;
    throw error;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    input: DEFAULT_INPUT_PATH,
    output: DEFAULT_OUTPUT_DIR,
    theme: null,
    color: null,
    photo: null,
    htmlOnly: false,
    hasThemeOrColor: false,
    generateAll: false
  };

  for (let i = 0; i < args.length; i++) {
    const nextValue = args[i + 1];

    if (args[i] === '--theme' && nextValue) {
      parsed.theme = nextValue;
      parsed.hasThemeOrColor = true;
      i++;
    } else if (args[i] === '--input' && nextValue) {
      parsed.input = path.resolve(nextValue);
      i++;
    } else if (args[i] === '--output' && nextValue) {
      parsed.output = path.resolve(nextValue);
      i++;
    } else if (args[i] === '--color' && nextValue) {
      parsed.color = nextValue;
      parsed.hasThemeOrColor = true;
      i++;
    } else if (args[i] === '--photo' && nextValue) {
      parsed.photo = path.resolve(nextValue);
      i++;
    } else if (args[i] === '--generateAll') {
      parsed.generateAll = true;
    } else if (args[i] === '--htmlOnly') {
      parsed.htmlOnly = true;
    } else if (!args[i].startsWith('--') && !args[i - 1]?.startsWith('--')) {
      // Support positional argument for backward compatibility (first non-flag arg is input)
      if (parsed.input === DEFAULT_INPUT_PATH) {
        parsed.input = path.resolve(args[i]);
      }
    }
  }

  if (!parsed.generateAll) {
    parsed.generateAll = !parsed.hasThemeOrColor;
  }
  return parsed;
}

async function runCli() {
  const args = parseArgs();
  await generateResume({
    inputPath: args.input,
    outputDir: args.output,
    themeName: args.theme,
    colorName: args.color,
    generateAll: args.generateAll,
    photoPath: args.photo,
    htmlOnly: args.htmlOnly
  });
}

module.exports = { generateResume, parseArgs, runCli };

if (require.main === module) {
  runCli().catch(() => process.exit(1));
}
