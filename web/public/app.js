// Global state
const state = {
  resumeData: null,
  photoBase64: null,
  themes: [],
  colors: [],
  selectedTheme: null,
  selectedColor: null,
  currentHtml: null,
  codeMirrorEditor: null,
  jsonModified: false,
  enabledSections: {}, // Tracks which sections are enabled/disabled
  currentEditingSection: null // Which section is being edited in modal
};

// Section configuration
const ALL_SECTIONS = ['personalInfo', 'summary', 'skills', 'experience', 'education', 'projects', 'gdprClause'];
const FIXED_SECTIONS = ['personalInfo', 'summary', 'gdprClause']; // Cannot be reordered (fixed positions)
const REQUIRED_SECTIONS = ['personalInfo']; // Cannot be disabled
const REORDERABLE_SECTIONS = ['skills', 'experience', 'education', 'projects']; // Can be reordered

// DOM Elements
const elements = {
  jsonEditor: document.getElementById('jsonEditor'),
  jsonError: document.getElementById('jsonError'),
  themeSelect: document.getElementById('themeSelect'),
  colorSelect: document.getElementById('colorSelect'),
  colorGroup: document.getElementById('colorGroup'),
  generateBtn: document.getElementById('generateBtn'),
  exportPdfBtn: document.getElementById('exportPdfBtn'),
  exportJsonBtn: document.getElementById('exportJsonBtn'),
  loadExampleBtn: document.getElementById('loadExampleBtn'),
  fileInput: document.getElementById('fileInput'),
  photoInput: document.getElementById('photoInput'),
  previewContainer: document.getElementById('previewContainer'),
  previewStatus: document.getElementById('previewStatus'),
  jsonEditorModal: document.getElementById('jsonEditorModal'),
  expandedJsonEditor: document.getElementById('expandedJsonEditor'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  saveModalBtn: document.getElementById('saveModalBtn'),
  formatJsonBtn: document.getElementById('formatJsonBtn'),
  modalSectionTitle: document.getElementById('modalSectionTitle'),
  sectionsPanel: document.getElementById('sectionsPanel'),
  sectionList: document.getElementById('sectionList')
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

    // Sort themes to put 'default' first
    state.themes.sort((a, b) => {
      if (a.name === 'default') return -1;
      if (b.name === 'default') return 1;
      return a.name.localeCompare(b.name);
    });

    elements.themeSelect.innerHTML = '';
    state.themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme.name;
      option.textContent = theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
      option.dataset.monochromatic = theme.monochromatic;
      elements.themeSelect.appendChild(option);
    });

    // Set default theme as selected
    const defaultTheme = state.themes.find(t => t.name === 'default');
    if (defaultTheme) {
      state.selectedTheme = 'default';
      elements.themeSelect.value = 'default';

      // Show color selector if default theme is not monochromatic
      if (!defaultTheme.monochromatic) {
        elements.colorGroup.style.display = 'block';
      }
    }

    // Update button states after theme is set
    updateButtonStates();
  } catch (error) {
    console.error('Error loading themes:', error);
    flashPreviewStatus('Error loading themes', 'status-error');
  }
}

// Load available colors
async function loadColors() {
  try {
    const response = await fetch('/api/colors');
    state.colors = await response.json();

    // Sort colors to put 'blue' first
    state.colors.sort((a, b) => {
      if (a === 'blue') return -1;
      if (b === 'blue') return 1;
      return a.localeCompare(b);
    });

    elements.colorSelect.innerHTML = '';
    state.colors.forEach(color => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      elements.colorSelect.appendChild(option);
    });

    // Set blue as the default selected color
    if (state.colors.includes('blue')) {
      state.selectedColor = 'blue';
      elements.colorSelect.value = 'blue';
    }

    // Update button states after color is set
    updateButtonStates();
  } catch (error) {
    console.error('Error loading colors:', error);
    flashPreviewStatus('Error loading colors', 'status-error');
  }
}

// Setup event listeners
function setupEventListeners() {
  elements.loadExampleBtn.addEventListener('click', loadExampleData);
  elements.fileInput.addEventListener('change', handleFileUpload);
  elements.photoInput.addEventListener('change', handlePhotoUpload);
  elements.themeSelect.addEventListener('change', handleThemeChange);
  elements.colorSelect.addEventListener('change', handleColorChange);
  elements.generateBtn.addEventListener('click', generatePreview);
  elements.exportPdfBtn.addEventListener('click', exportToPdf);
  elements.exportJsonBtn.addEventListener('click', exportToJson);

  // Modal event listeners
  elements.closeModalBtn.addEventListener('click', closeEditorModal);
  elements.cancelModalBtn.addEventListener('click', closeEditorModal);
  elements.saveModalBtn.addEventListener('click', saveEditorChanges);
  elements.formatJsonBtn.addEventListener('click', formatExpandedJson);

  // Close modal when clicking outside
  elements.jsonEditorModal.addEventListener('click', (e) => {
    if (e.target === elements.jsonEditorModal) {
      closeEditorModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.jsonEditorModal.classList.contains('show')) {
      closeEditorModal();
    }
  });
}

// Load example data
async function loadExampleData() {
  try {
    const response = await fetch('/api/example-data');
    const data = await response.json();
    elements.jsonEditor.value = JSON.stringify(data, null, 2);
    state.resumeData = data;

    // Initialize all sections as enabled
    initializeEnabledSections(data);

    flashPreviewStatus('Example data loaded successfully', 'status-success');

    // Update section management UI
    updateSectionManagementUI();

    // Auto-generate preview
    await autoGeneratePreview('json');
  } catch (error) {
    console.error('Error loading example data:', error);
    flashPreviewStatus('Error loading example data', 'status-error');
  }
}

// Handle JSON file upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const meta = parsed._meta || null;
      const data = { ...parsed };
      delete data._meta;

      elements.jsonEditor.value = JSON.stringify(data, null, 2);
      state.resumeData = data;

      // Initialize enabled sections from file data, then apply meta override if present
      initializeEnabledSections(data);
      if (meta?.enabledSections) {
        state.enabledSections = { ...meta.enabledSections };
      }

      // Apply meta settings (theme/color/photo)
      applyMetaSettings(meta);

      flashPreviewStatus('JSON file uploaded successfully', 'status-success');

      // Update section management UI
      updateSectionManagementUI();

      // Auto-generate preview
      await autoGeneratePreview('json');
    } catch (error) {
      showError('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

// Initialize enabled sections based on loaded data
function initializeEnabledSections(data) {
  state.enabledSections = {};
  ALL_SECTIONS.forEach(section => {
    // Enable section if it exists in the data
    state.enabledSections[section] = data[section] !== undefined;
  });
}

// Handle photo upload
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    state.photoBase64 = e.target.result;
    flashPreviewStatus(`Photo uploaded: ${file.name}`, 'status-success');

    // Auto-generate preview
    await autoGeneratePreview('photo');
  };
  reader.readAsDataURL(file);
}

// Validate JSON - internal function
function validateJson() {
  hideError();

  const jsonText = elements.jsonEditor.value.trim();
  if (!jsonText) {
    state.resumeData = null;
    updateButtonStates();
    return false;
  }

  try {
    state.resumeData = JSON.parse(jsonText);
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
async function handleThemeChange(event) {
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

  // Auto-generate preview
  await autoGeneratePreview('theme');
}

// Handle color selection
async function handleColorChange(event) {
  state.selectedColor = event.target.value || null;
  updateButtonStates();

  // Auto-generate preview
  await autoGeneratePreview('color');
}

// Update button states
function updateButtonStates() {
  const hasTheme = state.selectedTheme !== null;
  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;
  const hasColor = state.selectedColor !== null;
  const hasJsonText = elements.jsonEditor.value.trim().length > 0;

  // Generate Preview is only needed when JSON has been modified
  const canGenerate = hasJsonText && hasTheme && (!needsColor || hasColor) && state.jsonModified;

  elements.generateBtn.disabled = !canGenerate;
  elements.exportPdfBtn.disabled = !state.currentHtml;
  elements.exportJsonBtn.disabled = !state.resumeData;
}

// Generate preview
async function generatePreview() {
  // Auto-validate JSON before generating
  if (!validateJson()) {
    return;
  }

  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;

  if (needsColor && !state.selectedColor) {
    showError('Please select a color for this theme');
    return;
  }

  showLoading(true);
  setPreviewStatus('Generating preview...', 'status-info');

  try {
    // Filter resume data to only include enabled sections
    const filteredData = getFilteredResumeData();

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: filteredData,
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

    // Mark JSON as no longer modified since we just generated
    state.jsonModified = false;

    // Display preview in iframe
    elements.previewContainer.innerHTML = '<iframe id="resumePreview"></iframe>';
    const iframe = document.getElementById('resumePreview');
    iframe.srcdoc = data.html;

    resetPreviewStatus();
    updateButtonStates();
  } catch (error) {
    console.error('Error generating preview:', error);
    showError(error.message);
    setPreviewStatus(error.message, 'status-error');
  } finally {
    showLoading(false);
  }
}

// Export current configuration to JSON
function exportToJson() {
  if (!validateJson()) {
    return;
  }

  const exportPayload = {
    ...state.resumeData,
    _meta: {
      enabledSections: state.enabledSections,
      selectedTheme: state.selectedTheme,
      selectedColor: state.selectedColor,
      photoBase64: state.photoBase64
    }
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume_config.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  flashPreviewStatus('Configuration exported as JSON', 'status-success');
}

// Get filtered resume data with only enabled sections
function getFilteredResumeData() {
  if (!state.resumeData) return null;

  const filtered = {};

  Object.keys(state.resumeData).forEach(section => {
    if (ALL_SECTIONS.includes(section) &&
        state.enabledSections[section] &&
        state.resumeData[section] !== undefined) {
      filtered[section] = state.resumeData[section];
    }
  });

  return filtered;
}

// Apply meta settings from imported JSON (_meta)
function applyMetaSettings(meta) {
  if (!meta) return;

  // Apply theme/color if available and valid
  if (meta.selectedTheme) {
    const theme = state.themes.find(t => t.name === meta.selectedTheme);
    if (theme) {
      state.selectedTheme = meta.selectedTheme;
      elements.themeSelect.value = meta.selectedTheme;

      const isMonochromatic = theme.monochromatic;
      elements.colorGroup.style.display = isMonochromatic ? 'none' : 'block';

      if (!isMonochromatic && meta.selectedColor && state.colors.includes(meta.selectedColor)) {
        state.selectedColor = meta.selectedColor;
        elements.colorSelect.value = meta.selectedColor;
      } else if (isMonochromatic) {
        state.selectedColor = null;
        elements.colorSelect.value = '';
      }
    }
  }

  // Apply photo (or clear to null if not provided)
  state.photoBase64 = meta.photoBase64 || null;

  updateButtonStates();
}

// Export to PDF
async function exportToPdf() {
  // Auto-validate JSON before exporting
  if (!validateJson()) {
    return;
  }

  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;

  if (needsColor && !state.selectedColor) {
    showError('Please select a color for this theme');
    return;
  }

  showLoading(true);
  setPreviewStatus('Generating PDF...', 'status-info');

  try {
    // Filter resume data to only include enabled sections
    const filteredData = getFilteredResumeData();

    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: filteredData,
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

    flashPreviewStatus('PDF exported successfully', 'status-success');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showError(error.message);
    setPreviewStatus(error.message, 'status-error');
  } finally {
    showLoading(false);
  }
}

// Smart JSON Fixer - Auto-corrects common JSON errors
function fixCommonJsonErrors(jsonString) {
  let fixed = jsonString;

  // Remove trailing commas before closing braces/brackets
  // Match: , followed by optional whitespace and then } or ]
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Remove comments (// style)
  fixed = fixed.replace(/\/\/.*$/gm, '');

  // Remove comments (/* */ style)
  fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');

  // Replace single quotes with double quotes for property names only
  // Be more conservative to avoid false positives
  fixed = fixed.replace(/([{,]\s*)('([^'\\]*(?:\\.[^'\\]*)*)')\s*:/g, function(match, prefix, quoted, key) {
    // Only replace if it looks like a property name
    return prefix + '"' + key + '":';
  });

  // Fix numbers with leading zeros (invalid in JSON), but not in strings
  fixed = fixed.replace(/:\s*0+(\d+)([,}\]\s])/g, ': $1$2');

  return fixed;
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

let previewStatusTimeout = null;

function buildPreviewLabel() {
  if (!state.currentHtml) return '';
  return `Preview: ${state.selectedTheme}${state.selectedColor ? ` (${state.selectedColor})` : ''}`;
}

function setPreviewStatus(message, type = '') {
  elements.previewStatus.textContent = message;
  elements.previewStatus.className = `preview-status${type ? ` ${type}` : ''}`;
}

function resetPreviewStatus() {
  clearTimeout(previewStatusTimeout);
  setPreviewStatus(buildPreviewLabel());
}

function flashPreviewStatus(message, type = 'status-info', duration = 3000) {
  clearTimeout(previewStatusTimeout);
  setPreviewStatus(message, type);

  if (duration) {
    previewStatusTimeout = setTimeout(() => {
      resetPreviewStatus();
    }, duration);
  }
}

function showPreviewNotification(message) {
  flashPreviewStatus(message, 'status-success success-notification', 2500);
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

// Auto-generate preview if all conditions are met
async function autoGeneratePreview(changeType) {
  // Check if we have all necessary data
  const hasJsonText = elements.jsonEditor.value.trim().length > 0;
  const hasTheme = state.selectedTheme !== null;
  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;
  const hasColor = state.selectedColor !== null;

  if (hasJsonText && hasTheme && (!needsColor || hasColor)) {
    await generatePreview();

    // Show user-friendly notification based on what changed
    let message = '';
    switch (changeType) {
      case 'theme':
        message = `✓ Preview updated with ${state.selectedTheme} theme`;
        break;
      case 'color':
        message = `✓ Preview updated with ${state.selectedColor} color`;
        break;
      case 'photo':
        message = '✓ Preview updated with your photo';
        break;
      case 'json':
        message = '✓ Preview generated with your resume data';
        break;
      case 'section-reorder':
        message = '✓ Preview updated with new section order';
        break;
      case 'section-edit':
        message = '✓ Preview updated with section changes';
        break;
      case 'section-toggle':
        message = '✓ Preview updated with section visibility';
        break;
      default:
        message = '✓ Preview regenerated';
    }

    showPreviewNotification(message);
  }
}

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Real-time JSON validation
const validateJsonRealtime = debounce(() => {
  if (!state.codeMirrorEditor) return;

  const jsonText = state.codeMirrorEditor.getValue().trim();

  if (!jsonText) {
    clearJsonErrors();
    hideError();
    return;
  }

  try {
    // Try to parse JSON
    JSON.parse(jsonText);

    // If successful, clear any errors
    clearJsonErrors();
    hideError();
  } catch (error) {
    // If there's an error, highlight it
    clearJsonErrors();
    highlightJsonError(jsonText, error);
    showError(`JSON Error: ${error.message}`);
  }
}, 500); // Wait 500ms after user stops typing

// Section Editor Modal Functions
function openSectionEditor(sectionKey) {
  state.currentEditingSection = sectionKey;

  // Initialize CodeMirror if not already done
  if (!state.codeMirrorEditor) {
    state.codeMirrorEditor = CodeMirror(elements.expandedJsonEditor, {
      mode: { name: 'javascript', json: true },
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      matchBrackets: true,
      autoCloseBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      theme: 'default'
    });

    // Add real-time validation on change
    state.codeMirrorEditor.on('change', validateJsonRealtime);
  }

  // Clear any previous errors
  clearJsonErrors();
  hideError();

  // Update modal title
  elements.modalSectionTitle.textContent = `Edit ${getSectionDisplayName(sectionKey)}`;

  // Get section-specific JSON
  const sectionData = state.resumeData[sectionKey];

  if (sectionData !== undefined) {
    try {
      // Format the section JSON
      state.codeMirrorEditor.setValue(JSON.stringify(sectionData, null, 2));
    } catch (error) {
      state.codeMirrorEditor.setValue('');
      showError(`Error loading section data: ${error.message}`);
    }
  } else {
    state.codeMirrorEditor.setValue('');
  }

  // Show modal
  elements.jsonEditorModal.classList.add('show');

  // Refresh CodeMirror and focus
  setTimeout(() => {
    state.codeMirrorEditor.refresh();
    state.codeMirrorEditor.focus();
  }, 100);
}

function closeEditorModal() {
  elements.jsonEditorModal.classList.remove('show');
  state.currentEditingSection = null;
}

function saveEditorChanges() {
  if (!state.currentEditingSection || !state.codeMirrorEditor) {
    closeEditorModal();
    return;
  }

  const sectionKey = state.currentEditingSection;
  const sectionJson = state.codeMirrorEditor.getValue().trim();

  // Validate the section JSON
  try {
    const sectionData = JSON.parse(sectionJson);

    // Update the section in resume data
    state.resumeData[sectionKey] = sectionData;

    // Update the hidden JSON editor
    elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);

    // Mark as modified
    state.jsonModified = true;
    updateButtonStates();

    // Close modal
    closeEditorModal();

    // Show success message
    flashPreviewStatus(`${getSectionDisplayName(sectionKey)} updated successfully`, 'status-success');

    // Auto-generate preview
    autoGeneratePreview('section-edit');
  } catch (error) {
    showError(`Invalid JSON for ${getSectionDisplayName(sectionKey)}: ${error.message}`);
    highlightJsonError(sectionJson, error);
  }
}

function formatExpandedJson() {
  if (!state.codeMirrorEditor) return;

  // Clear any previous error markers
  clearJsonErrors();

  const jsonText = state.codeMirrorEditor.getValue().trim();

  if (!jsonText) {
    showError('No JSON to format');
    return;
  }

  try {
    // First, try to fix common JSON errors
    const fixedJson = fixCommonJsonErrors(jsonText);

    // Then parse and format
    const parsed = JSON.parse(fixedJson);
    const formatted = JSON.stringify(parsed, null, 2);

    // Update CodeMirror value
    state.codeMirrorEditor.setValue(formatted);

    // Clear errors on success
    hideError();

    // Show temporary success message
    const originalText = elements.formatJsonBtn.innerHTML;

    // Check if we made any fixes
    if (fixedJson !== jsonText) {
      elements.formatJsonBtn.innerHTML = '<i class="fas fa-magic"></i> Fixed & Formatted!';
    } else {
      elements.formatJsonBtn.innerHTML = '<i class="fas fa-check"></i> Formatted!';
    }

    elements.formatJsonBtn.disabled = true;

    setTimeout(() => {
      elements.formatJsonBtn.innerHTML = originalText;
      elements.formatJsonBtn.disabled = false;
    }, 1500);
  } catch (error) {
    // Try to highlight the error location
    highlightJsonError(jsonText, error);

    // Show the error
    showError(`JSON Error: ${error.message}`);
  }
}

// Helper function to parse error location from JSON parse error
function getErrorPosition(jsonText, error) {
  const message = error.message;

  // Try to extract position from error message
  // Chrome/V8: "Unexpected token } in JSON at position 123"
  // Firefox: "JSON.parse: unexpected character at line 5 column 10"

  let line = null;
  let column = null;

  // Try Firefox format first (most specific)
  const firefoxMatch = message.match(/line (\d+) column (\d+)/);
  if (firefoxMatch) {
    line = parseInt(firefoxMatch[1]) - 1; // 0-indexed
    column = parseInt(firefoxMatch[2]) - 1;
    return { line, column };
  }

  // Try Chrome format
  const chromeMatch = message.match(/position (\d+)/);
  if (chromeMatch) {
    const position = parseInt(chromeMatch[1]);
    let currentPos = 0;
    const lines = jsonText.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= position) {
        line = i;
        column = position - currentPos;
        return { line, column };
      }
      currentPos += lines[i].length + 1; // +1 for newline
    }
  }

  return { line: 0, column: 0 };
}

// Clear JSON error markers
function clearJsonErrors() {
  if (!state.codeMirrorEditor) return;

  // Clear all marks
  const marks = state.codeMirrorEditor.getAllMarks();
  marks.forEach(mark => mark.clear());
}

// Highlight JSON error in CodeMirror
function highlightJsonError(jsonText, error) {
  if (!state.codeMirrorEditor) return;

  const { line, column } = getErrorPosition(jsonText, error);

  // Highlight the line with the error
  state.codeMirrorEditor.addLineClass(line, 'background', 'json-error-line');

  // Scroll to the error line
  state.codeMirrorEditor.scrollIntoView({ line, ch: column }, 100);

  // Set cursor to error position
  state.codeMirrorEditor.setCursor({ line, ch: column });
  state.codeMirrorEditor.focus();
}

// Section Management Functions
function updateSectionManagementUI() {
  if (!state.resumeData) {
    elements.sectionsPanel.style.display = 'none';
    return;
  }

  elements.sectionsPanel.style.display = 'block';
  elements.sectionList.innerHTML = '';

  // Get current section order from the resume data
  const currentSections = Object.keys(state.resumeData).filter(key => ALL_SECTIONS.includes(key));

  currentSections.forEach((sectionKey) => {
    const item = document.createElement('div');
    item.className = 'section-item';
    item.dataset.section = sectionKey;

    // Determine if section is fixed (non-draggable)
    const isFixed = FIXED_SECTIONS.includes(sectionKey);
    const isRequired = REQUIRED_SECTIONS.includes(sectionKey);
    const isEnabled = state.enabledSections[sectionKey];

    if (isFixed) {
      item.classList.add('section-item-fixed');
      item.draggable = false;
    } else {
      item.draggable = true;
    }

    if (!isEnabled) {
      item.classList.add('section-item-disabled');
    }

    // Build section HTML
    const sectionIcon = getSectionIcon(sectionKey);
    const sectionName = getSectionDisplayName(sectionKey);
    const badge = isFixed ? '<span class="section-item-badge">Fixed Position</span>' : '';

    item.innerHTML = `
      <i class="fas fa-grip-vertical section-item-grip"></i>
      <div class="section-item-info">
        <div class="section-item-name">
          <i class="${sectionIcon}"></i>
          ${sectionName}
        </div>
        ${badge}
      </div>
      <div class="section-item-controls">
        <label class="section-item-toggle">
          <input type="checkbox"
                 ${isEnabled ? 'checked' : ''}
                 ${isRequired ? 'disabled' : ''}
                 data-section="${sectionKey}">
          <span class="section-item-toggle-slider"></span>
        </label>
        <button class="btn-edit-section" data-section="${sectionKey}">
          <i class="fas fa-edit"></i> Edit
        </button>
      </div>
    `;

    // Add event listeners
    const toggleCheckbox = item.querySelector('input[type="checkbox"]');
    const editBtn = item.querySelector('.btn-edit-section');

    toggleCheckbox.addEventListener('change', (e) => handleSectionToggle(sectionKey, e.target.checked));
    editBtn.addEventListener('click', () => openSectionEditor(sectionKey));

    // Add drag-and-drop event listeners only for reorderable sections
    if (!isFixed) {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
    }

    elements.sectionList.appendChild(item);
  });
}

// Handle section enable/disable toggle
function handleSectionToggle(sectionKey, enabled) {
  state.enabledSections[sectionKey] = enabled;
  state.jsonModified = true;
  updateButtonStates();
  updateSectionManagementUI();

  // Auto-regenerate preview
  autoGeneratePreview('section-toggle');
}

// Get icon for section
function getSectionIcon(section) {
  const icons = {
    personalInfo: 'fas fa-user',
    summary: 'fas fa-align-left',
    skills: 'fas fa-code',
    experience: 'fas fa-briefcase',
    education: 'fas fa-graduation-cap',
    projects: 'fas fa-project-diagram',
    gdprClause: 'fas fa-shield-alt'
  };
  return icons[section] || 'fas fa-file';
}

// Get display name for section
function getSectionDisplayName(section) {
  const names = {
    personalInfo: 'Personal Information',
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    projects: 'Hobby Projects',
    gdprClause: 'GDPR Clause'
  };
  return names[section] || section;
}

// Drag-and-drop handlers for section reordering
let draggedItem = null;

function handleDragStart(e) {
  // Only allow dragging non-fixed sections
  const sectionKey = this.dataset.section;
  if (FIXED_SECTIONS.includes(sectionKey)) {
    e.preventDefault();
    return;
  }

  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  if (!draggedItem) return false;

  e.dataTransfer.dropEffect = 'move';

  // Only allow dropping in reorderable section area
  const afterElement = getDragAfterElement(elements.sectionList, e.clientY);

  if (afterElement == null) {
    // Find the last reorderable section to insert before gdprClause
    const allItems = elements.sectionList.querySelectorAll('.section-item');
    const gdprItem = Array.from(allItems).find(item => item.dataset.section === 'gdprClause');

    if (gdprItem) {
      elements.sectionList.insertBefore(draggedItem, gdprItem);
    }
  } else {
    elements.sectionList.insertBefore(draggedItem, afterElement);
  }

  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (!draggedItem) return false;

  // Update JSON based on new order
  updateJsonOrder();

  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  draggedItem = null;
}

function getDragAfterElement(container, y) {
  // Only consider reorderable sections (exclude all fixed sections)
  const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')].filter(item => {
    const sectionKey = item.dataset.section;
    return REORDERABLE_SECTIONS.includes(sectionKey);
  });

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateJsonOrder() {
  try {
    const data = state.resumeData;
    const items = elements.sectionList.querySelectorAll('.section-item');
    const currentOrder = Array.from(items).map(item => item.dataset.section);

    // Extract only reorderable sections from current order
    const reorderableSectionsOrder = currentOrder.filter(key => REORDERABLE_SECTIONS.includes(key));

    // Build new data object with proper fixed positions
    const newData = {};

    // 1. Always put personalInfo first if it exists
    if (data.personalInfo !== undefined) {
      newData.personalInfo = data.personalInfo;
    }

    // 2. Always put summary second if it exists
    if (data.summary !== undefined) {
      newData.summary = data.summary;
    }

    // 3. Add reorderable sections in their new order
    reorderableSectionsOrder.forEach(key => {
      if (data[key] !== undefined) {
        newData[key] = data[key];
      }
    });

    // 4. Add any other non-fixed, non-reorderable keys
    Object.keys(data).forEach(key => {
      if (!newData[key] && key !== 'gdprClause') {
        newData[key] = data[key];
      }
    });

    // 5. Always put gdprClause last if it exists
    if (data.gdprClause !== undefined) {
      newData.gdprClause = data.gdprClause;
    }

    // Update state and editor
    state.resumeData = newData;
    elements.jsonEditor.value = JSON.stringify(newData, null, 2);
    state.jsonModified = true;
    updateButtonStates();

    // Refresh UI to show correct order
    updateSectionManagementUI();

    // Auto-generate preview immediately
    autoGeneratePreview('section-reorder');
  } catch (error) {
    console.error('Error updating JSON order:', error);
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
