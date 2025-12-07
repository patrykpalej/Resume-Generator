const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const { generateHTML } = require('../src/generators/html');
const { generatePDF } = require('../src/generators/pdf');
const { getAllThemes, loadTheme } = require('../src/themes');
const { getAllColors, resolveColor } = require('../src/colors');

const app = express();
const PORT = 8003;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get all available themes
app.get('/api/themes', (req, res) => {
  try {
    const themes = getAllThemes();
    const themeDetails = themes.map(themeName => {
      const theme = loadTheme(themeName);
      return {
        name: theme.name,
        monochromatic: theme.monochromatic
      };
    });
    res.json(themeDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get all available colors
app.get('/api/colors', (req, res) => {
  try {
    const colors = getAllColors();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get example resume data
app.get('/api/example-data', async (req, res) => {
  try {
    const examplePath = path.join(__dirname, '../data/resume-data-example.json');
    const data = await fs.readFile(examplePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to generate HTML preview
app.post('/api/generate', async (req, res) => {
  try {
    const { resumeData, themeName, colorName, photoBase64 } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    if (!themeName) {
      return res.status(400).json({ error: 'Theme name is required' });
    }

    const theme = loadTheme(themeName);
    let palette = null;

    if (!theme.monochromatic) {
      if (!colorName) {
        return res.status(400).json({ error: 'Color is required for non-monochromatic themes' });
      }
      const color = resolveColor(colorName);
      palette = color.palette;
    }

    const htmlContent = generateHTML(resumeData, photoBase64, theme, palette);
    res.json({ html: htmlContent });
  } catch (error) {
    console.error('Error generating HTML:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to export PDF
app.post('/api/export-pdf', async (req, res) => {
  try {
    const { resumeData, themeName, colorName, photoBase64 } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    if (!themeName) {
      return res.status(400).json({ error: 'Theme name is required' });
    }

    const theme = loadTheme(themeName);
    let palette = null;

    if (!theme.monochromatic) {
      if (!colorName) {
        return res.status(400).json({ error: 'Color is required for non-monochromatic themes' });
      }
      const color = resolveColor(colorName);
      palette = color.palette;
    }

    const htmlContent = generateHTML(resumeData, photoBase64, theme, palette);

    // Generate temporary PDF file
    const tempPdfPath = path.join(__dirname, 'temp', `resume_${Date.now()}.pdf`);
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });
    await generatePDF(htmlContent, tempPdfPath);

    // Send PDF file
    res.download(tempPdfPath, 'resume.pdf', async (err) => {
      // Clean up temp file after sending
      try {
        await fs.unlink(tempPdfPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Resume Generator Demo running at http://localhost:${PORT}`);
});
