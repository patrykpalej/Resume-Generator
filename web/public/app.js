// Global state
const state = {
  resumeData: null,
  photoBase64: null,
  themes: [],
  colors: [],
  selectedTheme: null,
  selectedColor: null,
  currentHtml: null
};

// DOM Elements
const elements = {
  jsonEditor: document.getElementById('jsonEditor'),
  jsonError: document.getElementById('jsonError'),
  themeSelect: document.getElementById('themeSelect'),
  colorSelect: document.getElementById('colorSelect'),
  colorGroup: document.getElementById('colorGroup'),
  generateBtn: document.getElementById('generateBtn'),
  exportPdfBtn: document.getElementById('exportPdfBtn'),
  loadExampleBtn: document.getElementById('loadExampleBtn'),
  fileInput: document.getElementById('fileInput'),
  photoInput: document.getElementById('photoInput'),
  photoStatus: document.getElementById('photoStatus'),
  validateBtn: document.getElementById('validateBtn'),
  previewContainer: document.getElementById('previewContainer'),
  previewStatus: document.getElementById('previewStatus')
};

// Initialize app
async function init() {
  await loadThemes();
  await loadColors();
  setupEventListeners();
  updateButtonStates();
}

// Load available themes
async function loadThemes() {
  try {
    const response = await fetch('/api/themes');
    state.themes = await response.json();

    elements.themeSelect.innerHTML = '<option value="">Select theme...</option>';
    state.themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme.name;
      option.textContent = theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
      option.dataset.monochromatic = theme.monochromatic;
      elements.themeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading themes:', error);
    showStatus('Error loading themes', 'error');
  }
}

// Load available colors
async function loadColors() {
  try {
    const response = await fetch('/api/colors');
    state.colors = await response.json();

    elements.colorSelect.innerHTML = '<option value="">Select color...</option>';
    state.colors.forEach(color => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      elements.colorSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading colors:', error);
    showStatus('Error loading colors', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  elements.loadExampleBtn.addEventListener('click', loadExampleData);
  elements.fileInput.addEventListener('change', handleFileUpload);
  elements.photoInput.addEventListener('change', handlePhotoUpload);
  elements.validateBtn.addEventListener('click', validateJson);
  elements.jsonEditor.addEventListener('input', handleJsonEdit);
  elements.themeSelect.addEventListener('change', handleThemeChange);
  elements.colorSelect.addEventListener('change', handleColorChange);
  elements.generateBtn.addEventListener('click', generatePreview);
  elements.exportPdfBtn.addEventListener('click', exportToPdf);
}

// Load example data
async function loadExampleData() {
  try {
    const response = await fetch('/api/example-data');
    const data = await response.json();
    elements.jsonEditor.value = JSON.stringify(data, null, 2);
    validateJson();
    showStatus('Example data loaded successfully', 'success');
  } catch (error) {
    console.error('Error loading example data:', error);
    showStatus('Error loading example data', 'error');
  }
}

// Handle JSON file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      elements.jsonEditor.value = JSON.stringify(data, null, 2);
      validateJson();
      showStatus('JSON file uploaded successfully', 'success');
    } catch (error) {
      showError('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

// Handle photo upload
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    state.photoBase64 = e.target.result;
    elements.photoStatus.textContent = `Photo uploaded: ${file.name}`;
    elements.photoStatus.className = 'status-message success';
  };
  reader.readAsDataURL(file);
}

// Handle JSON editor input
function handleJsonEdit() {
  hideError();
  state.resumeData = null;
  updateButtonStates();
}

// Validate JSON
function validateJson() {
  hideError();

  const jsonText = elements.jsonEditor.value.trim();
  if (!jsonText) {
    showError('JSON editor is empty');
    state.resumeData = null;
    updateButtonStates();
    return false;
  }

  try {
    state.resumeData = JSON.parse(jsonText);
    showStatus('JSON is valid', 'success');
    updateButtonStates();
    return true;
  } catch (error) {
    showError(`Invalid JSON: ${error.message}`);
    state.resumeData = null;
    updateButtonStates();
    return false;
  }
}

// Handle theme selection
function handleThemeChange(event) {
  const selectedOption = event.target.selectedOptions[0];
  state.selectedTheme = event.target.value;

  if (state.selectedTheme) {
    const isMonochromatic = selectedOption.dataset.monochromatic === 'true';

    if (isMonochromatic) {
      elements.colorGroup.style.display = 'none';
      state.selectedColor = null;
      elements.colorSelect.value = '';
    } else {
      elements.colorGroup.style.display = 'block';
    }
  } else {
    elements.colorGroup.style.display = 'none';
    state.selectedColor = null;
  }

  updateButtonStates();
}

// Handle color selection
function handleColorChange(event) {
  state.selectedColor = event.target.value || null;
  updateButtonStates();
}

// Update button states
function updateButtonStates() {
  const hasData = state.resumeData !== null;
  const hasTheme = state.selectedTheme !== null;
  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;
  const hasColor = state.selectedColor !== null;

  const canGenerate = hasData && hasTheme && (!needsColor || hasColor);

  elements.generateBtn.disabled = !canGenerate;
  elements.exportPdfBtn.disabled = !canGenerate || !state.currentHtml;
}

// Generate preview
async function generatePreview() {
  if (!validateJson()) return;

  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;

  if (needsColor && !state.selectedColor) {
    showError('Please select a color for this theme');
    return;
  }

  showLoading(true);
  elements.previewStatus.textContent = 'Generating preview...';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: state.resumeData,
        themeName: state.selectedTheme,
        colorName: state.selectedColor,
        photoBase64: state.photoBase64
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate preview');
    }

    const data = await response.json();
    state.currentHtml = data.html;

    // Display preview in iframe
    elements.previewContainer.innerHTML = '<iframe id="resumePreview"></iframe>';
    const iframe = document.getElementById('resumePreview');
    iframe.srcdoc = data.html;

    elements.previewStatus.textContent = `Preview: ${state.selectedTheme}${state.selectedColor ? ` (${state.selectedColor})` : ''}`;
    updateButtonStates();
  } catch (error) {
    console.error('Error generating preview:', error);
    showError(error.message);
    elements.previewStatus.textContent = '';
  } finally {
    showLoading(false);
  }
}

// Export to PDF
async function exportToPdf() {
  if (!state.currentHtml) return;

  showLoading(true);
  elements.previewStatus.textContent = 'Generating PDF...';

  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: state.resumeData,
        themeName: state.selectedTheme,
        colorName: state.selectedColor,
        photoBase64: state.photoBase64
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate PDF');
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${state.selectedTheme}${state.selectedColor ? `_${state.selectedColor}` : ''}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showStatus('PDF exported successfully', 'success');
    elements.previewStatus.textContent = `Preview: ${state.selectedTheme}${state.selectedColor ? ` (${state.selectedColor})` : ''}`;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showError(error.message);
    elements.previewStatus.textContent = '';
  } finally {
    showLoading(false);
  }
}

// UI Helper Functions
function showError(message) {
  elements.jsonError.textContent = message;
  elements.jsonError.classList.add('show');
}

function hideError() {
  elements.jsonError.classList.remove('show');
  elements.jsonError.textContent = '';
}

function showStatus(message, type) {
  const statusEl = elements.photoStatus.parentElement.querySelector('.status-message') ||
                   document.createElement('div');
  statusEl.className = `status-message ${type}`;
  statusEl.textContent = message;

  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status-message';
  }, 3000);
}

function showLoading(isLoading) {
  if (isLoading) {
    elements.generateBtn.classList.add('loading');
    elements.exportPdfBtn.classList.add('loading');
    elements.generateBtn.disabled = true;
    elements.exportPdfBtn.disabled = true;
  } else {
    elements.generateBtn.classList.remove('loading');
    elements.exportPdfBtn.classList.remove('loading');
    updateButtonStates();
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
