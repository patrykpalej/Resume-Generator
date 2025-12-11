// Global state
const state = {
  resumeData: null,
  photoBase64: null,
  themes: [],
  colors: [],
  selectedTheme: null,
  selectedColor: null,
  currentHtml: null,
  pdfPreviewUrl: null,
  codeMirrorEditor: null,
  jsonModified: false,
  enabledSections: {}, // Tracks which sections are enabled/disabled
  currentEditingSection: null, // Which section is being edited in modal
  sectionErrors: {}, // Tracks which sections have JSON errors
  customSectionNames: {} // Tracks custom section names (e.g., "experience" -> "Work History")
};

// Section configuration
const ALL_SECTIONS = ['personalInfo', 'summary', 'skills', 'experience', 'education', 'projects', 'gdprClause'];
const FIXED_SECTIONS = ['personalInfo', 'summary', 'gdprClause']; // Cannot be reordered (fixed positions)
const REQUIRED_SECTIONS = ['personalInfo']; // Cannot be disabled
const REORDERABLE_SECTIONS = ['skills', 'experience', 'education', 'projects']; // Can be reordered
const MIN_SKILL_FRACTION = 0.5;
const MAX_SKILL_FRACTION = 5;
const SKILL_FRACTION_STEP = 0.5;
const MAX_SKILL_GROUPS = 4; // Limit skills groups shown/edited

// DOM Elements
const elements = {
  jsonEditor: document.getElementById('jsonEditor'),
  themeSelect: document.getElementById('themeSelect'),
  colorSelect: document.getElementById('colorSelect'),
  colorGroup: document.getElementById('colorGroup'),
  previewPdfBtn: document.getElementById('previewPdfBtn'),
  exportPdfBtn: document.getElementById('exportPdfBtn'),
  exportJsonBtn: document.getElementById('exportJsonBtn'),
  loadExampleBtn: document.getElementById('loadExampleBtn'),
  pdfPreviewModal: document.getElementById('pdfPreviewModal'),
  pdfPreviewContainer: document.getElementById('pdfPreviewContainer'),
  closePdfPreviewBtn: document.getElementById('closePdfPreviewBtn'),
  fileInput: document.getElementById('fileInput'),
  photoInput: document.getElementById('photoInput'),
  photoUploadBtn: document.getElementById('photoUploadBtn'),
  photoRemoveBtn: document.getElementById('photoRemoveBtn'),
  photoUploadLabel: document.getElementById('photoUploadLabel'),
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
  sectionList: document.getElementById('sectionList'),
  projectsModal: document.getElementById('projectsModal'),
  projectsList: document.getElementById('projectsList'),
  addProjectBtn: document.getElementById('addProjectBtn'),
  closeProjectsModalBtn: document.getElementById('closeProjectsModalBtn'),
  closeProjectsModalFooterBtn: document.getElementById('closeProjectsModalFooterBtn'),
  projectFormModal: document.getElementById('projectFormModal'),
  projectFormTitle: document.getElementById('projectFormTitle'),
  projectForm: document.getElementById('projectForm'),
  projectFormError: document.getElementById('projectFormError'),
  projectName: document.getElementById('projectName'),
  projectDescription: document.getElementById('projectDescription'),
  projectTechnologies: document.getElementById('projectTechnologies'),
  projectLink: document.getElementById('projectLink'),
  closeProjectFormBtn: document.getElementById('closeProjectFormBtn'),
  cancelProjectFormBtn: document.getElementById('cancelProjectFormBtn'),
  saveProjectFormBtn: document.getElementById('saveProjectFormBtn'),
  // Skills Modal
  skillsModal: document.getElementById('skillsModal'),
  skillsList: document.getElementById('skillsList'),
  addSkillBtn: document.getElementById('addSkillBtn'),
  closeSkillsModalBtn: document.getElementById('closeSkillsModalBtn'),
  closeSkillsModalFooterBtn: document.getElementById('closeSkillsModalFooterBtn'),
  renameSkillsSectionBtn: document.getElementById('renameSkillsSectionBtn'),
  skillsLimitPill: document.getElementById('skillsLimitPill'),
  // Skill Form Modal
  skillFormModal: document.getElementById('skillFormModal'),
  skillFormTitle: document.getElementById('skillFormTitle'),
  skillForm: document.getElementById('skillForm'),
  skillFormError: document.getElementById('skillFormError'),
  skillCategoryName: document.getElementById('skillCategoryName'),
  skillFraction: document.getElementById('skillFraction'),
  skillItemsList: document.getElementById('skillItemsList'),
  skillsWeightsPanel: document.getElementById('skillsWeightsPanel'),
  addSkillItemBtn: document.getElementById('addSkillItemBtn'),
  closeSkillFormBtn: document.getElementById('closeSkillFormBtn'),
  cancelSkillFormBtn: document.getElementById('cancelSkillFormBtn'),
  saveSkillFormBtn: document.getElementById('saveSkillFormBtn'),
  experienceModal: document.getElementById('experienceModal'),
  experienceList: document.getElementById('experienceList'),
  addExperienceBtn: document.getElementById('addExperienceBtn'),
  closeExperienceModalBtn: document.getElementById('closeExperienceModalBtn'),
  closeExperienceModalFooterBtn: document.getElementById('closeExperienceModalFooterBtn'),
  experienceFormModal: document.getElementById('experienceFormModal'),
  experienceFormTitle: document.getElementById('experienceFormTitle'),
  experienceForm: document.getElementById('experienceForm'),
  experienceFormError: document.getElementById('experienceFormError'),
  expPosition: document.getElementById('expPosition'),
  expCompany: document.getElementById('expCompany'),
  expStartDate: document.getElementById('expStartDate'),
  expEndDate: document.getElementById('expEndDate'),
  responsibilitiesList: document.getElementById('responsibilitiesList'),
  addResponsibilityBtn: document.getElementById('addResponsibilityBtn'),
  closeExperienceFormBtn: document.getElementById('closeExperienceFormBtn'),
  cancelExperienceFormBtn: document.getElementById('cancelExperienceFormBtn'),
  saveExperienceFormBtn: document.getElementById('saveExperienceFormBtn'),
  // Education Modal
  educationModal: document.getElementById('educationModal'),
  educationList: document.getElementById('educationList'),
  addEducationBtn: document.getElementById('addEducationBtn'),
  closeEducationModalBtn: document.getElementById('closeEducationModalBtn'),
  closeEducationModalFooterBtn: document.getElementById('closeEducationModalFooterBtn'),
  renameEducationSectionBtn: document.getElementById('renameEducationSectionBtn'),
  educationFormModal: document.getElementById('educationFormModal'),
  educationFormTitle: document.getElementById('educationFormTitle'),
  educationForm: document.getElementById('educationForm'),
  educationFormError: document.getElementById('educationFormError'),
  edDegree: document.getElementById('edDegree'),
  edLevel: document.getElementById('edLevel'),
  edInstitution: document.getElementById('edInstitution'),
  edStartDate: document.getElementById('edStartDate'),
  edGraduationDate: document.getElementById('edGraduationDate'),
  closeEducationFormBtn: document.getElementById('closeEducationFormBtn'),
  cancelEducationFormBtn: document.getElementById('cancelEducationFormBtn'),
  saveEducationFormBtn: document.getElementById('saveEducationFormBtn'),
  // Personal Info Modal
  personalInfoModal: document.getElementById('personalInfoModal'),
  personalInfoForm: document.getElementById('personalInfoForm'),
  personalInfoFormError: document.getElementById('personalInfoFormError'),
  closePersonalInfoModalBtn: document.getElementById('closePersonalInfoModalBtn'),
  cancelPersonalInfoBtn: document.getElementById('cancelPersonalInfoBtn'),
  savePersonalInfoBtn: document.getElementById('savePersonalInfoBtn'),
  piName: document.getElementById('piName'),
  piTitle: document.getElementById('piTitle'),
  piEmail: document.getElementById('piEmail'),
  piPhone: document.getElementById('piPhone'),
  piWebsite: document.getElementById('piWebsite'),
  piLinkedin: document.getElementById('piLinkedin'),
  piGithub: document.getElementById('piGithub'),
  piLocation: document.getElementById('piLocation'),
  // Summary Modal
  summaryModal: document.getElementById('summaryModal'),
  summaryTextarea: document.getElementById('summaryTextarea'),
  summaryFormError: document.getElementById('summaryFormError'),
  closeSummaryModalBtn: document.getElementById('closeSummaryModalBtn'),
  cancelSummaryBtn: document.getElementById('cancelSummaryBtn'),
  saveSummaryBtn: document.getElementById('saveSummaryBtn'),
  // GDPR Modal
  gdprModal: document.getElementById('gdprModal'),
  gdprTextarea: document.getElementById('gdprTextarea'),
  gdprFormError: document.getElementById('gdprFormError'),
  closeGdprModalBtn: document.getElementById('closeGdprModalBtn'),
  cancelGdprBtn: document.getElementById('cancelGdprBtn'),
  saveGdprBtn: document.getElementById('saveGdprBtn'),
  // Modal section icon
  modalSectionIcon: document.getElementById('modalSectionIcon')
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
  elements.photoRemoveBtn.addEventListener('click', handlePhotoRemove);
  elements.themeSelect.addEventListener('change', handleThemeChange);
  elements.colorSelect.addEventListener('change', handleColorChange);
  elements.previewPdfBtn.addEventListener('click', showPdfPreview);
  elements.exportPdfBtn.addEventListener('click', exportToPdf);
  elements.exportJsonBtn.addEventListener('click', exportToJson);
  elements.closePdfPreviewBtn.addEventListener('click', closePdfPreview);

  // Modal event listeners
  elements.closeModalBtn.addEventListener('click', closeEditorModal);
  elements.cancelModalBtn.addEventListener('click', closeEditorModal);
  elements.saveModalBtn.addEventListener('click', saveEditorChanges);
  elements.formatJsonBtn.addEventListener('click', formatExpandedJson);

  // Projects modal event listeners
  elements.closeProjectsModalBtn.addEventListener('click', closeProjectsManagementModal);
  elements.closeProjectsModalFooterBtn.addEventListener('click', closeProjectsManagementModal);
  elements.addProjectBtn.addEventListener('click', addNewProject);
  // Note: renameProjectsSectionBtn listener is attached dynamically when modal opens

  // Skills modal event listeners
  elements.closeSkillsModalBtn.addEventListener('click', closeSkillsManagementModal);
  elements.closeSkillsModalFooterBtn.addEventListener('click', closeSkillsManagementModal);
  elements.addSkillBtn.addEventListener('click', addNewSkill);
  if (elements.renameSkillsSectionBtn) {
    elements.renameSkillsSectionBtn.addEventListener('click', () => renameSectionPrompt('skills'));
  }

  // Skill form modal event listeners
  elements.closeSkillFormBtn.addEventListener('click', () => closeSkillFormModal());
  elements.cancelSkillFormBtn.addEventListener('click', () => closeSkillFormModal());
  elements.saveSkillFormBtn.addEventListener('click', saveSkillForm);
  elements.addSkillItemBtn.addEventListener('click', () => addSkillItemField());
  if (elements.skillFraction) {
    elements.skillFraction.addEventListener('input', (e) => syncSkillFraction(Number(e.target.value)));
    elements.skillFraction.addEventListener('change', (e) => syncSkillFraction(Number(e.target.value)));
  }

  // Project form modal event listeners
  elements.closeProjectFormBtn.addEventListener('click', closeProjectFormModal);
  elements.cancelProjectFormBtn.addEventListener('click', closeProjectFormModal);
  elements.saveProjectFormBtn.addEventListener('click', saveProjectForm);

  // Experience modal event listeners
  elements.closeExperienceModalBtn.addEventListener('click', closeExperienceManagementModal);
  elements.closeExperienceModalFooterBtn.addEventListener('click', closeExperienceManagementModal);
  elements.addExperienceBtn.addEventListener('click', addNewExperience);
  // Note: renameExperienceSectionBtn listener is attached dynamically when modal opens

  // Experience form modal event listeners
  elements.closeExperienceFormBtn.addEventListener('click', closeExperienceFormModal);
  elements.cancelExperienceFormBtn.addEventListener('click', closeExperienceFormModal);
  elements.saveExperienceFormBtn.addEventListener('click', saveExperienceForm);
  elements.addResponsibilityBtn.addEventListener('click', () => addResponsibilityField());

  // Education modal event listeners
  elements.closeEducationModalBtn.addEventListener('click', closeEducationManagementModal);
  elements.closeEducationModalFooterBtn.addEventListener('click', closeEducationManagementModal);
  elements.addEducationBtn.addEventListener('click', addNewEducation);
  if (elements.renameEducationSectionBtn) {
    elements.renameEducationSectionBtn.addEventListener('click', () => renameSectionPrompt('education'));
  }

  // Education form modal event listeners
  elements.closeEducationFormBtn.addEventListener('click', closeEducationFormModal);
  elements.cancelEducationFormBtn.addEventListener('click', closeEducationFormModal);
  elements.saveEducationFormBtn.addEventListener('click', saveEducationForm);

  // Personal info modal event listeners
  elements.closePersonalInfoModalBtn.addEventListener('click', closePersonalInfoModal);
  elements.cancelPersonalInfoBtn.addEventListener('click', closePersonalInfoModal);
  elements.savePersonalInfoBtn.addEventListener('click', savePersonalInfoForm);

  // Summary modal event listeners
  elements.closeSummaryModalBtn.addEventListener('click', closeSummaryModal);
  elements.cancelSummaryBtn.addEventListener('click', closeSummaryModal);
  elements.saveSummaryBtn.addEventListener('click', saveSummaryForm);

  // GDPR modal event listeners
  elements.closeGdprModalBtn.addEventListener('click', closeGdprModal);
  elements.cancelGdprBtn.addEventListener('click', closeGdprModal);
  elements.saveGdprBtn.addEventListener('click', saveGdprForm);

  // Close modal when clicking outside
  elements.jsonEditorModal.addEventListener('click', (e) => {
    if (e.target === elements.jsonEditorModal) {
      closeEditorModal();
    }
  });

  elements.projectsModal.addEventListener('click', (e) => {
    if (e.target === elements.projectsModal) {
      closeProjectsManagementModal();
    }
  });

  elements.skillsModal.addEventListener('click', (e) => {
    if (e.target === elements.skillsModal) {
      closeSkillsManagementModal();
    }
  });

  elements.skillFormModal.addEventListener('click', (e) => {
    if (e.target === elements.skillFormModal) {
      closeSkillFormModal();
    }
  });

  elements.projectFormModal.addEventListener('click', (e) => {
    if (e.target === elements.projectFormModal) {
      closeProjectFormModal();
    }
  });

  elements.experienceModal.addEventListener('click', (e) => {
    if (e.target === elements.experienceModal) {
      closeExperienceManagementModal();
    }
  });

  elements.educationModal.addEventListener('click', (e) => {
    if (e.target === elements.educationModal) {
      closeEducationManagementModal();
    }
  });

  elements.educationFormModal.addEventListener('click', (e) => {
    if (e.target === elements.educationFormModal) {
      closeEducationFormModal();
    }
  });

  // Keep experience badges positioned on scroll
  elements.experienceList.addEventListener('scroll', () => {
    // Use rAF to avoid thrashing layout
    requestAnimationFrame(renderExperienceBadges);
  });

  if (elements.educationList) {
    elements.educationList.addEventListener('scroll', () => {
      requestAnimationFrame(renderEducationBadges);
    });
  }

  elements.experienceFormModal.addEventListener('click', (e) => {
    if (e.target === elements.experienceFormModal) {
      closeExperienceFormModal();
    }
  });

  elements.personalInfoModal.addEventListener('click', (e) => {
    if (e.target === elements.personalInfoModal) {
      closePersonalInfoModal();
    }
  });

  elements.summaryModal.addEventListener('click', (e) => {
    if (e.target === elements.summaryModal) {
      closeSummaryModal();
    }
  });

  elements.gdprModal.addEventListener('click', (e) => {
    if (e.target === elements.gdprModal) {
      closeGdprModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.jsonEditorModal.classList.contains('show')) {
      closeEditorModal();
    }
    if (e.key === 'Escape' && elements.projectsModal.classList.contains('show')) {
      closeProjectsManagementModal();
    }
    if (e.key === 'Escape' && elements.skillsModal.classList.contains('show')) {
      closeSkillsManagementModal();
    }
    if (e.key === 'Escape' && elements.skillFormModal.classList.contains('show')) {
      closeSkillFormModal();
    }
    if (e.key === 'Escape' && elements.projectFormModal.classList.contains('show')) {
      closeProjectFormModal();
    }
    if (e.key === 'Escape' && elements.experienceModal.classList.contains('show')) {
      closeExperienceManagementModal();
    }
    if (e.key === 'Escape' && elements.educationModal.classList.contains('show')) {
      closeEducationManagementModal();
    }
    if (e.key === 'Escape' && elements.educationFormModal.classList.contains('show')) {
      closeEducationFormModal();
    }
    if (e.key === 'Escape' && elements.experienceFormModal.classList.contains('show')) {
      closeExperienceFormModal();
    }
    if (e.key === 'Escape' && elements.personalInfoModal.classList.contains('show')) {
      closePersonalInfoModal();
    }
    if (e.key === 'Escape' && elements.summaryModal.classList.contains('show')) {
      closeSummaryModal();
    }
    if (e.key === 'Escape' && elements.gdprModal.classList.contains('show')) {
      closeGdprModal();
    }
    if (e.key === 'Escape' && elements.educationModal.classList.contains('show')) {
      closeEducationManagementModal();
    }
    if (e.key === 'Escape' && elements.educationFormModal.classList.contains('show')) {
      closeEducationFormModal();
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

      // Apply meta settings (theme/color/photo/customSectionNames)
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

    // Update UI to show remove button
    updatePhotoButtonState(true);

    // Auto-generate preview
    await autoGeneratePreview('photo');
  };
  reader.readAsDataURL(file);
}

// Handle photo removal
async function handlePhotoRemove() {
  state.photoBase64 = null;

  // Clear the file input
  elements.photoInput.value = '';

  // Update UI to show upload button
  updatePhotoButtonState(false);

  flashPreviewStatus('Photo removed', 'status-success');

  // Auto-generate preview
  await autoGeneratePreview('photo');
}

// Update photo button state (show upload or remove button)
function updatePhotoButtonState(hasPhoto) {
  if (hasPhoto) {
    // Hide upload button and label, show remove button
    elements.photoUploadBtn.style.display = 'none';
    elements.photoUploadLabel.style.display = 'none';
    elements.photoRemoveBtn.style.display = 'flex';
  } else {
    // Show upload button and label, hide remove button
    elements.photoUploadBtn.style.display = 'flex';
    elements.photoUploadLabel.style.display = 'block';
    elements.photoRemoveBtn.style.display = 'none';
  }
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
      // Default to blue when switching from mono to colorful themes
      if (!state.selectedColor && state.colors.includes('blue')) {
        state.selectedColor = 'blue';
        elements.colorSelect.value = 'blue';
      }
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

  // Update export button states
  elements.previewPdfBtn.disabled = !state.currentHtml;
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
        photoBase64: state.photoBase64,
        customSectionNames: state.customSectionNames
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
      photoBase64: state.photoBase64,
      customSectionNames: state.customSectionNames
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

  // Update photo button state based on loaded photo
  updatePhotoButtonState(!!state.photoBase64);

  // Apply custom section names if available
  if (meta.customSectionNames) {
    state.customSectionNames = { ...meta.customSectionNames };
  }

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
        photoBase64: state.photoBase64,
        customSectionNames: state.customSectionNames
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
  setPreviewStatus(message, 'status-error');
}

function hideError() {
  resetPreviewStatus();
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
    elements.exportPdfBtn.classList.add('loading');
    elements.exportPdfBtn.disabled = true;
  } else {
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

// Debounced preview after skill weight tweaks to avoid spamming renders
const debouncedSkillPreview = debounce(() => {
  autoGeneratePreview('section-edit');
}, 400);

// Section Editor Modal Functions
function openSectionEditor(sectionKey) {
  state.currentEditingSection = sectionKey;

  // Initialize CodeMirror if not already done
  if (!state.codeMirrorEditor) {
    state.codeMirrorEditor = CodeMirror(elements.expandedJsonEditor, {
      mode: { name: 'javascript', json: true },
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: false,
      gutters: ['CodeMirror-linenumbers'],
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

  // Update modal icon to match section icon
  const sectionIcon = getSectionIcon(sectionKey);
  elements.modalSectionIcon.textContent = '';
  elements.modalSectionIcon.className = sectionIcon;

  // Sections that have visible headers in the CV
  const sectionsWithHeaders = ['experience', 'education', 'skills', 'projects'];
  const hasHeader = sectionsWithHeaders.includes(sectionKey);

  // Update modal title - use CV header name for sections with headers, sidebar name otherwise
  const sectionName = hasHeader ? getCVHeaderName(sectionKey) : getSectionDisplayName(sectionKey);

  const spanElement = document.createElement('span');
  spanElement.textContent = sectionName;

  elements.modalSectionTitle.innerHTML = '';
  elements.modalSectionTitle.appendChild(spanElement);

  // Only add rename button for sections that have headers in the CV
  if (hasHeader) {
    const btnElement = document.createElement('button');
    btnElement.className = 'btn-rename-section-modal';
    btnElement.title = 'Rename CV section header';
    btnElement.innerHTML = '<i class="fas fa-pen"></i>';

    elements.modalSectionTitle.appendChild(btnElement);

    // Add click listener for rename button in modal
    btnElement.addEventListener('click', () => {
      renameSectionPrompt(sectionKey);
    });
  }

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
  // Check if we're editing a single project
  if (currentEditingProjectIndex !== null) {
    const projectJson = state.codeMirrorEditor.getValue().trim();

    try {
      const projectData = JSON.parse(projectJson);

      // Update the specific project
      state.resumeData.projects[currentEditingProjectIndex] = projectData;

      // Update the hidden JSON editor
      elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);

      // Mark as modified
      state.jsonModified = true;
      updateButtonStates();

      // Close modal and reopen projects management
      closeEditorModal();
      currentEditingProjectIndex = null;
      openProjectsManagementModal();

      // Show success message
      flashPreviewStatus('Project updated successfully', 'status-success');

    } catch (error) {
      showError(`Invalid JSON for project: ${error.message}`);
      highlightJsonError(projectJson, error);
    }
    return;
  }

  // Regular section editing
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

    // Clear any error state for this section
    state.sectionErrors[sectionKey] = false;

    // Mark as modified
    state.jsonModified = true;
    updateButtonStates();

    // Close modal
    closeEditorModal();

    // Update section UI to remove error indicator
    updateSectionManagementUI();

    // Show success message
    flashPreviewStatus(`${getSectionDisplayName(sectionKey)} updated successfully`, 'status-success');

    // Auto-generate preview
    autoGeneratePreview('section-edit');
  } catch (error) {
    // Mark this section as having an error
    state.sectionErrors[sectionKey] = true;

    // Update section UI to show error indicator
    updateSectionManagementUI();

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
    const hasError = state.sectionErrors[sectionKey] === true;

    if (isFixed) {
      item.classList.add('section-item-fixed');
      item.draggable = false;
    } else {
      item.draggable = true;
    }

    if (!isEnabled) {
      item.classList.add('section-item-disabled');
    }

    if (hasError) {
      item.classList.add('section-item-error');
    }

    // Build section HTML
    const sectionIcon = getSectionIcon(sectionKey);
    const sectionIconMarkup = `<i class="${sectionIcon}" aria-hidden="true"></i>`;
    const sectionName = getDefaultSectionName(sectionKey); // Always use default name in sidebar
    const badge = isFixed ? '<span class="section-item-badge">Fixed Position</span>' : '';
    const errorWarning = hasError ? '<i class="fas fa-exclamation-triangle section-error-icon" title="This section has a JSON error"></i>' : '';

    item.innerHTML = `
      <i class="fas fa-grip-vertical section-item-grip"></i>
      <div class="section-item-info">
        <div class="section-item-name">
          ${sectionIconMarkup}
          ${sectionName}
          ${errorWarning}
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
    editBtn.addEventListener('click', () => {
      if (sectionKey === 'skills') {
        openSkillsManagementModal();
      } else if (sectionKey === 'projects') {
        openProjectsManagementModal();
      } else if (sectionKey === 'experience') {
        openExperienceManagementModal();
      } else if (sectionKey === 'personalInfo') {
        openPersonalInfoModal();
      } else if (sectionKey === 'summary') {
        openSummaryModal();
      } else if (sectionKey === 'gdprClause') {
        openGdprModal();
      } else if (sectionKey === 'education') {
        openEducationManagementModal();
      } else {
        openSectionEditor(sectionKey);
      }
    });

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
    skills: 'fas fa-lightbulb',
    experience: 'fas fa-briefcase',
    education: 'fas fa-graduation-cap',
    projects: 'fas fa-rocket',
    gdprClause: 'fas fa-shield-alt'
  };
  return icons[section] || 'fas fa-file';
}

// Get display name for section (sidebar names)
function getSectionDisplayName(section) {
  // Check if there's a custom name first
  if (state.customSectionNames && state.customSectionNames[section]) {
    return state.customSectionNames[section];
  }

  // Fall back to default names
  const names = {
    personalInfo: 'Personal Information',
    summary: 'Summary',
    skills: 'Skills & Languages',
    experience: 'Experience',
    education: 'Education',
    projects: 'Hobby Projects',
    gdprClause: 'GDPR Clause'
  };
  return names[section] || section;
}

// Get CV header name for section (what appears in the actual CV)
function getCVHeaderName(section) {
  // Check if there's a custom name first
  if (state.customSectionNames && state.customSectionNames[section]) {
    return state.customSectionNames[section];
  }

  // Default CV header names in title case (first letter upper, rest lower)
  const cvHeaders = {
    skills: '💡 Skills',
    experience: '💼 Experience',
    education: '🎓 Education',
    projects: '🚀 Projects'
  };
  return cvHeaders[section] || section;
}

// Rename a section with inline editing
function renameSectionPrompt(sectionKey) {
  const currentName = getCVHeaderName(sectionKey);
  const defaultName = getDefaultCVHeaderName(sectionKey);

  // Find which modal title to use based on section
  let titleElement;
  let containerElement;
  let existingRenameBtn = null;

  if (state.currentEditingSection === sectionKey) {
    titleElement = elements.modalSectionTitle.querySelector('span');
    containerElement = elements.modalSectionTitle;
    existingRenameBtn = elements.modalSectionTitle.querySelector('.btn-rename-section-modal');
  } else if (sectionKey === 'skills') {
    titleElement = document.getElementById('skillsModalTitle');
    containerElement = titleElement?.parentElement;
    existingRenameBtn = document.getElementById('renameSkillsSectionBtn');
  } else if (sectionKey === 'projects') {
    titleElement = document.getElementById('projectsModalTitle');
    containerElement = titleElement.parentElement;
    existingRenameBtn = document.getElementById('renameProjectsSectionBtn');
  } else if (sectionKey === 'experience') {
    titleElement = document.getElementById('experienceModalTitle');
    containerElement = titleElement.parentElement;
    existingRenameBtn = document.getElementById('renameExperienceSectionBtn');
  } else if (sectionKey === 'education') {
    titleElement = document.getElementById('educationModalTitle');
    containerElement = titleElement.parentElement;
    existingRenameBtn = document.getElementById('renameEducationSectionBtn');
  }

  if (!titleElement) return;

  // Store original HTML of the span
  const originalSpanHTML = titleElement.outerHTML;

  // IMPORTANT: Hide the existing rename button while editing
  if (existingRenameBtn) {
    existingRenameBtn.style.display = 'none';
  }

  // Create editing container
  const editingDiv = document.createElement('div');
  editingDiv.className = 'section-name-editing';

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'section-name-input';
  input.value = currentName;

  // Create controls container
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'section-name-edit-controls';

  // Create save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn-save-section-name';
  saveBtn.innerHTML = '<i class="fas fa-check"></i> Save';

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-cancel-section-name';
  cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';

  // Assemble the elements
  controlsDiv.appendChild(saveBtn);
  controlsDiv.appendChild(cancelBtn);
  editingDiv.appendChild(input);
  editingDiv.appendChild(controlsDiv);

  // Replace title span with input
  titleElement.replaceWith(editingDiv);

  // Save function
  const saveName = () => {
    console.log('Save button clicked');
    const trimmedName = input.value.trim();
    console.log('New name:', trimmedName);

    if (!trimmedName) {
      alert('Section name cannot be empty.');
      input.focus();
      return;
    }

    // If the new name is the same as the default, remove the custom name
    if (trimmedName === defaultName) {
      delete state.customSectionNames[sectionKey];
      console.log('Removed custom name (reverting to default)');
    } else {
      state.customSectionNames[sectionKey] = trimmedName;
      console.log('Set custom name:', sectionKey, '=', trimmedName);
    }

    console.log('Current customSectionNames:', state.customSectionNames);

    // Close edit mode by restoring the normal view
    const displayName = trimmedName;

    // Create the restored span with proper ID
    const spanElement = document.createElement('span');
    spanElement.textContent = displayName;

    // Restore the proper ID for Projects/Experience modal titles
    if (sectionKey === 'projects') {
      spanElement.id = 'projectsModalTitle';
    } else if (sectionKey === 'experience') {
      spanElement.id = 'experienceModalTitle';
    } else if (sectionKey === 'education') {
      spanElement.id = 'educationModalTitle';
    } else if (sectionKey === 'skills') {
      spanElement.id = 'skillsModalTitle';
    }

    // Replace the editing div with the restored span
    editingDiv.replaceWith(spanElement);

    // Show the existing rename button again and reattach its listener
    if (existingRenameBtn) {
      existingRenameBtn.style.display = '';

      // Clone and replace to remove old listeners, then add fresh one
      const newBtn = existingRenameBtn.cloneNode(true);
      existingRenameBtn.parentNode.replaceChild(newBtn, existingRenameBtn);
      if (sectionKey === 'skills') {
        elements.renameSkillsSectionBtn = newBtn;
      }

      newBtn.addEventListener('click', () => {
        console.log('Pen icon clicked for section:', sectionKey);
        renameSectionPrompt(sectionKey);
      });

      console.log('Edit mode closed, existing pen icon restored and clickable');
    }

    // Regenerate preview with new section name
    autoGeneratePreview('section-edit');

    flashPreviewStatus(`CV section header renamed to "${displayName}"`, 'status-success');
  };

  // Cancel function
  const cancelEdit = () => {
    // Create a temp div to parse the original HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalSpanHTML;
    const restoredElement = tempDiv.firstChild;

    // Replace editing div with original span element
    editingDiv.replaceWith(restoredElement);

    // Show the existing rename button again and reattach its listener
    if (existingRenameBtn) {
      existingRenameBtn.style.display = '';

      // Clone and replace to remove old listeners, then add fresh one
      const newBtn = existingRenameBtn.cloneNode(true);
      existingRenameBtn.parentNode.replaceChild(newBtn, existingRenameBtn);
      if (sectionKey === 'skills') {
        elements.renameSkillsSectionBtn = newBtn;
      }

      newBtn.addEventListener('click', () => {
        console.log('Pen icon clicked for section (after cancel):', sectionKey);
        renameSectionPrompt(sectionKey);
      });
    }
  };

  // Event listeners
  saveBtn.addEventListener('click', saveName);
  cancelBtn.addEventListener('click', cancelEdit);

  // Enter to save, Escape to cancel
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });

  // Focus and select input
  setTimeout(() => {
    input.focus();
    input.select();
  }, 10);
}

// Helper function to update section names in all open modals
function updateSectionNameInModals(sectionKey, newName) {
  console.log('Updating section name in modals:', sectionKey, newName);

  // Update regular section editor modal
  if (state.currentEditingSection === sectionKey) {
    console.log('Updating modal section title');
    const spanElement = document.createElement('span');
    spanElement.textContent = newName;

    const btnElement = document.createElement('button');
    btnElement.className = 'btn-rename-section-modal';
    btnElement.title = 'Rename section';
    btnElement.innerHTML = '<i class="fas fa-pen"></i>';

    elements.modalSectionTitle.innerHTML = '';
    elements.modalSectionTitle.appendChild(spanElement);
    elements.modalSectionTitle.appendChild(btnElement);

    // Re-attach event listener
    btnElement.addEventListener('click', () => {
      renameSectionPrompt(sectionKey);
    });
  }

  // Update Projects modal title if open
  if (sectionKey === 'projects') {
    const titleEl = document.getElementById('projectsModalTitle');
    if (titleEl) {
      titleEl.textContent = newName;
      console.log('Updated projects modal title to:', newName);

      // Reattach event listener to rename button
      const renameBtn = document.getElementById('renameProjectsSectionBtn');
      if (renameBtn) {
        const newRenameBtn = renameBtn.cloneNode(true);
        renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);
        newRenameBtn.addEventListener('click', () => {
          console.log('Projects rename button clicked (after save)');
          renameSectionPrompt('projects');
        });
      }
    }
  }

  // Update Skills modal title if open
  if (sectionKey === 'skills') {
    const titleEl = document.getElementById('skillsModalTitle');
    if (titleEl) {
      titleEl.textContent = newName;

      const renameBtn = document.getElementById('renameSkillsSectionBtn');
      if (renameBtn) {
        const newBtn = renameBtn.cloneNode(true);
        renameBtn.parentNode.replaceChild(newBtn, renameBtn);
        elements.renameSkillsSectionBtn = newBtn;
        newBtn.addEventListener('click', () => {
          renameSectionPrompt('skills');
        });
      }
    }
  }

  // Update Experience modal title if open
  if (sectionKey === 'experience') {
    const titleEl = document.getElementById('experienceModalTitle');
    if (titleEl) {
      titleEl.textContent = newName;
      console.log('Updated experience modal title to:', newName);

      // Reattach event listener to rename button
      const renameBtn = document.getElementById('renameExperienceSectionBtn');
      if (renameBtn) {
        const newRenameBtn = renameBtn.cloneNode(true);
        renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);
        newRenameBtn.addEventListener('click', () => {
          console.log('Experience rename button clicked (after save)');
          renameSectionPrompt('experience');
        });
      }
    }
  }

  // Update Education modal title if open
  if (sectionKey === 'education') {
    const titleEl = document.getElementById('educationModalTitle');
    if (titleEl) {
      titleEl.textContent = newName;

      const renameBtn = document.getElementById('renameEducationSectionBtn');
      if (renameBtn) {
        const newBtn = renameBtn.cloneNode(true);
        renameBtn.parentNode.replaceChild(newBtn, renameBtn);
        newBtn.addEventListener('click', () => {
          renameSectionPrompt('education');
        });
      }
    }
  }
}

// Get default section name for sidebar (without custom overrides)
function getDefaultSectionName(section) {
  const names = {
    personalInfo: 'Personal Information',
    summary: 'Summary',
    skills: 'Skills & Languages',
    experience: 'Experience',
    education: 'Education',
    projects: 'Hobby Projects',
    gdprClause: 'GDPR Clause'
  };
  return names[section] || section;
}

// Get default CV header name (without custom overrides)
function getDefaultCVHeaderName(section) {
  const cvHeaders = {
    skills: '💡 Skills',
    experience: '💼 Experience',
    education: '🎓 Education',
    projects: '🚀 Projects'
  };
  return cvHeaders[section] || section;
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

// Skills Management Functions
let currentEditingSkillIndex = null;

function clampSkillFraction(value) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_SKILL_FRACTION, Math.max(MIN_SKILL_FRACTION, value));
}

function syncSkillFraction(value) {
  const clamped = clampSkillFraction(value);
  if (elements.skillFraction) {
    elements.skillFraction.value = clamped;
  }
  return clamped;
}

function sanitizeSkillsArray(skills) {
  if (!Array.isArray(skills)) return [];

  const sanitized = skills.map(category => {
    const name = category?.name ? String(category.name).trim() : '';
    const rawFraction = Number(category?.fraction);
    const fraction = clampSkillFraction(Number.isFinite(rawFraction) && rawFraction > 0 ? parseFloat(rawFraction.toFixed(2)) : 1);
    const items = Array.isArray(category?.items)
      ? category.items.map(item => String(item).trim()).filter(Boolean)
      : [];

    return { name, fraction, items };
  });

  if (sanitized.length > MAX_SKILL_GROUPS) {
    flashPreviewStatus('Skills are limited to the first 3 groups.', 'status-info');
  }

  return sanitized.slice(0, MAX_SKILL_GROUPS);
}

function openSkillsManagementModal() {
  if (!state.resumeData) return;

  // Ensure skills array exists and is sanitized
  if (!Array.isArray(state.resumeData.skills)) {
    state.resumeData.skills = [];
  }

  const cleanedSkills = sanitizeSkillsArray(state.resumeData.skills);
  const lengthChanged = cleanedSkills.length !== (state.resumeData.skills?.length || 0);
  state.resumeData.skills = cleanedSkills;

  if (lengthChanged) {
    elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
    state.jsonModified = true;
    updateButtonStates();
  }

  populateSkillsList();

  const sectionName = getCVHeaderName('skills');
  const titleElement = document.getElementById('skillsModalTitle');
  if (titleElement) {
    titleElement.textContent = sectionName;
  }

  const renameBtnRef = elements.renameSkillsSectionBtn || document.getElementById('renameSkillsSectionBtn');
  if (renameBtnRef && renameBtnRef.parentNode) {
    const newRenameBtn = renameBtnRef.cloneNode(true);
    renameBtnRef.parentNode.replaceChild(newRenameBtn, renameBtnRef);
    newRenameBtn.addEventListener('click', () => renameSectionPrompt('skills'));
    elements.renameSkillsSectionBtn = newRenameBtn;
  }

  elements.skillsModal.classList.add('show');
}

function closeSkillsManagementModal() {
  elements.skillsModal.classList.remove('show');
  updateSectionManagementUI();
  debouncedSkillPreview();
}

function updateSkillsLimitUI(count) {
  const atLimit = count >= MAX_SKILL_GROUPS;
  if (elements.addSkillBtn) {
    elements.addSkillBtn.disabled = atLimit;
    elements.addSkillBtn.title = atLimit ? 'You can keep up to 4 skill groups' : '';
  }

  if (elements.skillsLimitPill) {
    elements.skillsLimitPill.style.display = atLimit ? 'inline-flex' : 'none';
  }
}

function populateSkillsList() {
  const skills = sanitizeSkillsArray(state.resumeData?.skills || []);
  const previousJson = elements.jsonEditor.value;
  state.resumeData.skills = skills;
  const newJson = JSON.stringify(state.resumeData, null, 2);
  elements.jsonEditor.value = newJson;
  if (newJson !== previousJson) {
    state.jsonModified = true;
    updateButtonStates();
  }

  updateSkillsLimitUI(skills.length);

  if (!skills.length) {
    elements.skillsList.innerHTML = '<p class="skill-list-empty">No skills yet. Click "Add Skill Group" to start.</p>';
    return;
  }

  const totalFraction = skills.reduce((sum, skill) => sum + (Number(skill.fraction) || 1), 0) || skills.length || 1;

  elements.skillsList.innerHTML = skills.map((skill, index) => {
    const fraction = Number(skill.fraction) || 1;
    const share = Math.round((fraction / totalFraction) * 100);
    const itemsMarkup = skill.items && skill.items.length
      ? skill.items.map(item => `<span class="skill-tag">${item}</span>`).join('')
      : '<span class="skill-tag" style="opacity: 0.7;">Add at least one item</span>';

    return `
    <div class="skill-list-item-row" data-skill-index="${index}" style="flex: 0 0 ${share}%; max-width: ${share}%;">
      <div class="skill-list-item">
        <div class="skill-list-header">
          <div class="skill-list-title">
            <div class="skill-list-name">${skill.name || 'Untitled group'}</div>
          </div>
          <div class="skill-list-meta">${skill.items?.length || 0} item${(skill.items?.length || 0) === 1 ? '' : 's'}</div>
        </div>
        <div class="skill-tags">
          ${itemsMarkup}
        </div>
        <div class="experience-list-item-controls">
          <button class="btn btn-secondary btn-small" onclick="openSkillEditor(${index})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteSkill(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  renderSkillWeightsPanel(skills, totalFraction);

}

function openSkillEditor(skillIndex) {
  currentEditingSkillIndex = skillIndex;
  const skill = state.resumeData.skills[skillIndex];

  elements.skillFormTitle.textContent = `Edit Skill Group: ${skill.name || 'Untitled'}`;
  elements.skillCategoryName.value = skill.name || '';

  populateSkillItems(skill.items || []);

  elements.skillsModal.classList.remove('show');
  elements.skillFormModal.classList.add('show');
}

function addNewSkill() {
  const skillsCount = Array.isArray(state.resumeData?.skills) ? state.resumeData.skills.length : 0;
  if (skillsCount >= MAX_SKILL_GROUPS) {
    flashPreviewStatus('You can keep up to 4 skill groups. Remove one to add another.', 'status-error');
    return;
  }

  if (!Array.isArray(state.resumeData.skills)) {
    state.resumeData.skills = [];
  }

  currentEditingSkillIndex = null;
  elements.skillFormTitle.textContent = 'Add Skill Group';
  elements.skillCategoryName.value = '';
  populateSkillItems([]);
  hideSkillFormError();

  elements.skillsModal.classList.remove('show');
  elements.skillFormModal.classList.add('show');
}

function deleteSkill(skillIndex) {
  if (!confirm('Are you sure you want to delete this skill group?')) return;

  state.resumeData.skills.splice(skillIndex, 1);
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;

  populateSkillsList();
  flashPreviewStatus('Skill group deleted', 'status-success');
  debouncedSkillPreview();
}

function closeSkillFormModal(reopenList = true) {
  elements.skillFormModal.classList.remove('show');
  currentEditingSkillIndex = null;
  elements.skillForm.reset();
  elements.skillItemsList.innerHTML = '';
  hideSkillFormError();

  if (reopenList) {
    elements.skillsModal.classList.add('show');
  }
}

function showSkillFormError(message) {
  elements.skillFormError.textContent = message;
  elements.skillFormError.classList.add('show');
}

function hideSkillFormError() {
  elements.skillFormError.textContent = '';
  elements.skillFormError.classList.remove('show');
}

function saveSkillForm() {
  hideSkillFormError();

  const name = elements.skillCategoryName.value.trim();

  // Keep existing fraction if editing, otherwise default to 1
  let fraction = 1;
  if (currentEditingSkillIndex !== null && state.resumeData.skills[currentEditingSkillIndex]) {
    fraction = state.resumeData.skills[currentEditingSkillIndex].fraction || 1;
  }

  if (!name) {
    showSkillFormError('Please provide a group name.');
    return;
  }

  const items = [];
  elements.skillItemsList.querySelectorAll('.skill-item input[type="text"]').forEach(input => {
    const value = input.value.trim();
    if (value) items.push(value);
  });

  if (items.length === 0) {
    showSkillFormError('Add at least one item to this group.');
    return;
  }

  const skills = Array.isArray(state.resumeData.skills) ? state.resumeData.skills : [];
  if (currentEditingSkillIndex === null && skills.length >= MAX_SKILL_GROUPS) {
    showSkillFormError('You can keep up to 4 skill groups. Remove one to add another.');
    return;
  }

  const skillData = {
    name,
    fraction: parseFloat(fraction.toFixed(2)),
    items
  };

  if (currentEditingSkillIndex !== null) {
    state.resumeData.skills[currentEditingSkillIndex] = skillData;
    flashPreviewStatus('Skill group updated', 'status-success');
  } else {
    state.resumeData.skills.push(skillData);
    flashPreviewStatus('Skill group added', 'status-success');

    // Automatically enable skills section when creating the first group
    if (state.enabledSections && state.enabledSections.skills === false) {
      state.enabledSections.skills = true;
    } else if (state.enabledSections && state.enabledSections.skills === undefined) {
      state.enabledSections.skills = true;
    }
  }

  state.sectionErrors.skills = false;
  state.resumeData.skills = sanitizeSkillsArray(state.resumeData.skills);
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  closeSkillFormModal(false);
  populateSkillsList();
  elements.skillsModal.classList.add('show');
  debouncedSkillPreview();
}

function populateSkillItems(items) {
  elements.skillItemsList.innerHTML = '';

  if (!items || items.length === 0) {
    addSkillItemField();
    addSkillItemField();
    return;
  }

  items.forEach(item => addSkillItemField(item));
}

function addSkillItemField(text = '') {
  const safeValue = text
    ? text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    : '';
  const item = document.createElement('div');
  item.className = 'skill-item';
  item.innerHTML = `
    <input type="text" value="${safeValue}" placeholder="e.g., React, Docker, English (C1)">
    <button type="button" class="btn-icon" onclick="removeSkillItem(this)" title="Remove">
      <i class="fas fa-trash"></i>
    </button>
  `;
  elements.skillItemsList.appendChild(item);
}

function removeSkillItem(button) {
  const item = button.closest('.skill-item');
  if (item) {
    item.remove();
  }
}

function updateSkillFractionInline(index, value, showStatus = false) {
  if (!Array.isArray(state.resumeData.skills)) return;
  const clamped = clampSkillFraction(value);
  if (!state.resumeData.skills[index]) return;

  state.resumeData.skills[index].fraction = clamped;
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  // Sync slider and pill text
  const slider = elements.skillsWeightsPanel?.querySelector(`.skill-weight-slider[data-skill-index="${index}"]`);
  if (slider) slider.value = clamped;
  refreshSkillFractionPills();
  updateSkillCardWidths();

  if (showStatus) {
    flashPreviewStatus('Updated column weights for skills', 'status-success');
  }

  debouncedSkillPreview();
}

function refreshSkillFractionPills() {
  const skills = state.resumeData?.skills || [];
  if (!skills.length) return;
  const totalFraction = skills.reduce((sum, skill) => sum + (Number(skill.fraction) || 1), 0) || skills.length || 1;

  skills.forEach((skill, index) => {
    const fraction = Number(skill.fraction) || 1;
    const share = Math.round((fraction / totalFraction) * 100);
    const pill = elements.skillsWeightsPanel?.querySelector(`.skill-weight-pill[data-skill-index="${index}"]`);
    if (pill) {
      pill.innerHTML = `<i class="fas fa-ruler-horizontal"></i> ${fraction}x • ${share}% width`;
    }
  });
}

function renderSkillWeightsPanel(skills, totalFraction) {
  if (!elements.skillsWeightsPanel) return;
  if (!skills.length) {
    elements.skillsWeightsPanel.innerHTML = '';
    return;
  }

  const rows = skills.map((skill, index) => {
    const fraction = Number(skill.fraction) || 1;
    const share = Math.round((fraction / totalFraction) * 100);
    return `
      <div class="skill-weight-row">
        <div class="skill-weight-name" title="${skill.name || 'Untitled group'}">${skill.name || 'Untitled group'}</div>
        <input class="skill-weight-slider" type="range"
               min="${MIN_SKILL_FRACTION}" max="${MAX_SKILL_FRACTION}" step="${SKILL_FRACTION_STEP}"
               value="${fraction}" data-skill-index="${index}">
        <span class="skill-weight-pill" data-skill-index="${index}"><i class="fas fa-ruler-horizontal"></i> ${fraction}x • ${share}% width</span>
      </div>
    `;
  }).join('');

  elements.skillsWeightsPanel.innerHTML = `
    <div class="skills-weights-panel-title">Adjust column widths</div>
    ${rows}
  `;

  // Attach handlers
  const sliders = elements.skillsWeightsPanel.querySelectorAll('.skill-weight-slider');
  sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.skillIndex, 10);
      const val = parseFloat(e.target.value);
      updateSkillFractionInline(idx, val, false);
    });
    slider.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.skillIndex, 10);
      const val = parseFloat(e.target.value);
      updateSkillFractionInline(idx, val, true);
    });
  });

  updateSkillCardWidths();
}

function updateSkillCardWidths() {
  const skills = state.resumeData?.skills || [];
  if (!skills.length || !elements.skillsList) return;
  const totalFraction = skills.reduce((sum, skill) => sum + (Number(skill.fraction) || 1), 0) || skills.length || 1;

  skills.forEach((skill, index) => {
    const fraction = Number(skill.fraction) || 1;
    const share = Math.round((fraction / totalFraction) * 100);
    const row = elements.skillsList.querySelector(`.skill-list-item-row[data-skill-index="${index}"]`);
    if (row) {
      row.style.flex = `0 0 ${share}%`;
      row.style.maxWidth = `${share}%`;
    }
  });
}

// Projects Management Functions
let currentEditingProjectIndex = null;

function openProjectsManagementModal() {
  populateProjectsList();

  // Update modal title with CV header name
  const sectionName = getCVHeaderName('projects');
  const titleElement = document.getElementById('projectsModalTitle');
  titleElement.textContent = sectionName;

  // Make sure the rename button event listener is attached
  const renameBtn = document.getElementById('renameProjectsSectionBtn');
  if (renameBtn) {
    // Remove old listeners by cloning and replacing
    const newRenameBtn = renameBtn.cloneNode(true);
    renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);

    // Add fresh event listener
    newRenameBtn.addEventListener('click', () => {
      console.log('Projects rename button clicked');
      renameSectionPrompt('projects');
    });
  }

  elements.projectsModal.classList.add('show');
}

function closeProjectsManagementModal() {
  elements.projectsModal.classList.remove('show');
  updateSectionManagementUI();
  autoGeneratePreview('section-edit');
}

function populateProjectsList() {
  if (!state.resumeData || !state.resumeData.projects) {
    elements.projectsList.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No projects yet. Click "Add New Project" to create one.</p>';
    return;
  }

  const projects = state.resumeData.projects;
  elements.projectsList.innerHTML = projects.map((project, index) => `
    <div class="project-list-item">
      <div class="project-list-item-info">
        <div class="project-list-item-name">${project.name || 'Untitled Project'}</div>
        <div class="project-list-item-desc">${project.description || 'No description'}</div>
      </div>
      <div class="project-list-item-controls">
        <button class="btn btn-secondary btn-small" onclick="openProjectEditor(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger btn-small" onclick="deleteProject(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openProjectEditor(projectIndex) {
  currentEditingProjectIndex = projectIndex;
  state.currentEditingSection = null; // Clear section editing state
  const project = state.resumeData.projects[projectIndex];

  // Populate form fields
  elements.projectFormTitle.textContent = `Edit Project: ${project.name || 'Untitled'}`;
  elements.projectName.value = project.name || '';
  elements.projectDescription.value = project.description || '';
  elements.projectTechnologies.value = project.technologies ? project.technologies.join(', ') : '';
  elements.projectLink.value = project.link || '';
  hideProjectFormError();

  // Close list modal, open form modal
  elements.projectsModal.classList.remove('show');
  elements.projectFormModal.classList.add('show');
}

function addNewProject() {
  currentEditingProjectIndex = null;
  elements.projectFormTitle.textContent = 'Add New Project';
  elements.projectName.value = '';
  elements.projectDescription.value = '';
  elements.projectTechnologies.value = '';
  elements.projectLink.value = '';
  hideProjectFormError();

  elements.projectsModal.classList.remove('show');
  elements.projectFormModal.classList.add('show');
}

function deleteProject(projectIndex) {
  if (!confirm('Are you sure you want to delete this project?')) {
    return;
  }

  state.resumeData.projects.splice(projectIndex, 1);
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;

  populateProjectsList();
  flashPreviewStatus('Project deleted', 'status-success');
  autoGeneratePreview('section-edit');
}

function closeProjectFormModal() {
  elements.projectFormModal.classList.remove('show');
  currentEditingProjectIndex = null;
  elements.projectForm.reset();
  hideProjectFormError();

  // Reopen list modal
  elements.projectsModal.classList.add('show');
}

function showProjectFormError(message) {
  elements.projectFormError.textContent = message;
  elements.projectFormError.classList.add('show');
}

function hideProjectFormError() {
  elements.projectFormError.textContent = '';
  elements.projectFormError.classList.remove('show');
}

function saveProjectForm() {
  hideProjectFormError();

  const name = elements.projectName.value.trim();
  const description = elements.projectDescription.value.trim();
  const technologiesText = elements.projectTechnologies.value.trim();
  const link = elements.projectLink.value.trim();

  if (!name || !description) {
    showProjectFormError('Please provide both project name and description');
    return;
  }

  const technologies = technologiesText
    ? technologiesText.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const projectData = {
    name,
    description,
    technologies,
    link: link || ''
  };

  if (!state.resumeData.projects) {
    state.resumeData.projects = [];
  }

  if (currentEditingProjectIndex !== null) {
    state.resumeData.projects[currentEditingProjectIndex] = projectData;
    flashPreviewStatus('Project updated successfully', 'status-success');
  } else {
    state.resumeData.projects.push(projectData);
    flashPreviewStatus('Project added successfully', 'status-success');
  }

  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  closeProjectFormModal();
  populateProjectsList();
  autoGeneratePreview('section-edit');
}

// Experience Management Functions
let currentEditingExperienceIndex = null;

function openExperienceManagementModal() {
  populateExperienceList();

  // Update modal title with CV header name
  const sectionName = getCVHeaderName('experience');
  const titleElement = document.getElementById('experienceModalTitle');
  titleElement.textContent = sectionName;

  // Make sure the rename button event listener is attached
  const renameBtn = document.getElementById('renameExperienceSectionBtn');
  if (renameBtn) {
    // Remove old listeners by cloning and replacing
    const newRenameBtn = renameBtn.cloneNode(true);
    renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);

    // Add fresh event listener
    newRenameBtn.addEventListener('click', () => {
      console.log('Experience rename button clicked');
      renameSectionPrompt('experience');
    });
  }

  elements.experienceModal.classList.add('show');

  // Position badges after initial render
  requestAnimationFrame(renderExperienceBadges);
}

function closeExperienceManagementModal() {
  elements.experienceModal.classList.remove('show');
  updateSectionManagementUI();
  autoGeneratePreview('section-edit');
}

// Education Management Functions
let currentEditingEducationIndex = null;

function openEducationManagementModal() {
  populateEducationList();

  // Update modal title with CV header name
  const sectionName = getCVHeaderName('education');
  const titleElement = document.getElementById('educationModalTitle');
  titleElement.textContent = sectionName;

  // Attach rename button listener fresh
  const renameBtn = document.getElementById('renameEducationSectionBtn');
  if (renameBtn) {
    const newRenameBtn = renameBtn.cloneNode(true);
    renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);
    newRenameBtn.addEventListener('click', () => {
      renameSectionPrompt('education');
    });
  }

  elements.educationModal.classList.add('show');

  requestAnimationFrame(renderEducationBadges);
}

function closeEducationManagementModal() {
  elements.educationModal.classList.remove('show');
  removeEducationBadges();
  updateSectionManagementUI();
  autoGeneratePreview('section-edit');
}

function populateEducationList() {
  if (!state.resumeData || !state.resumeData.education) {
    elements.educationList.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No education yet. Click "Add Education" to create one.</p>';
    removeEducationBadges();
    return;
  }

  const education = state.resumeData.education;
  const total = education.length;

  elements.educationList.innerHTML = education.map((edu, index) => {
    const startDate = edu.startDate ? formatDateForDisplay(edu.startDate) : '';
    const gradDate = edu.graduationDate ? formatDateForDisplay(edu.graduationDate) : 'Present';
    const dateRange = startDate ? `${startDate} - ${gradDate}` : gradDate;

    return `
    <div class="experience-list-item-row" data-edu-index="${index}">
      <div class="experience-list-item">
        <div class="experience-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="experience-list-item-info">
          <div class="experience-list-item-position">${edu.degree || 'Untitled Degree'}</div>
          <div class="experience-list-item-company">${edu.institution || 'No institution'}</div>
          <div class="experience-list-item-date">${dateRange}</div>
          <div class="experience-list-item-company" style="margin-top: 2px;">${edu.level || ''}</div>
        </div>
        <div class="experience-list-item-controls">
          <button class="btn btn-secondary btn-small" onclick="openEducationEditor(${index})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteEducation(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  // Attach drag-and-drop handlers for reordering
  const rows = elements.educationList.querySelectorAll('.experience-list-item-row');
  rows.forEach(row => {
    if (total < 2) return;
    const handle = row.querySelector('.experience-drag-handle');
    if (!handle) return;

    handle.draggable = true;
    handle.addEventListener('dragstart', handleEducationDragStart);
    handle.addEventListener('dragend', handleEducationDragEnd);

    row.addEventListener('dragover', handleEducationDragOver);
    row.addEventListener('drop', handleEducationDrop);
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
  });

  renderEducationBadges();
}
function populateExperienceList() {
  if (!state.resumeData || !state.resumeData.experience) {
    elements.experienceList.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No experience yet. Click "Add New Experience" to create one.</p>';
    return;
  }

  const experiences = state.resumeData.experience;
  const total = experiences.length;

  elements.experienceList.innerHTML = experiences.map((exp, index) => {
    const startDate = exp.startDate ? formatDateForDisplay(exp.startDate) : '';
    const endDate = exp.endDate ? formatDateForDisplay(exp.endDate) : 'Present';
    const dateRange = startDate ? `${startDate} - ${endDate}` : endDate;

    return `
    <div class="experience-list-item-row" data-index="${index}">
      <div class="experience-list-item">
        <div class="experience-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="experience-list-item-info">
          <div class="experience-list-item-position">${exp.position || 'Untitled Position'}</div>
          <div class="experience-list-item-company">${exp.company || 'No company'}</div>
          <div class="experience-list-item-date">${dateRange}</div>
        </div>
        <div class="experience-list-item-controls">
          <button class="btn btn-secondary btn-small" onclick="openExperienceEditor(${index})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteExperience(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  // Attach drag-and-drop handlers for reordering (handle initiates drag, rows are drop targets)
  const rows = elements.experienceList.querySelectorAll('.experience-list-item-row');
  rows.forEach(row => {
    if (total < 2) return;
    const handle = row.querySelector('.experience-drag-handle');
    if (!handle) return;

    handle.draggable = true;
    handle.addEventListener('dragstart', handleExperienceDragStart);
    handle.addEventListener('dragend', handleExperienceDragEnd);

    row.addEventListener('dragover', handleExperienceDragOver);
    row.addEventListener('drop', handleExperienceDrop);
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
  });

  renderExperienceBadges();
}

function formatDateForDisplay(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}.${year}`;
}

// Experience drag-and-drop for reordering
let draggedExperienceRow = null;
let draggedExperienceIndex = null;

function handleExperienceDragStart(e) {
  draggedExperienceRow = e.currentTarget.closest('.experience-list-item-row');
  if (!draggedExperienceRow) return;
  draggedExperienceIndex = parseInt(draggedExperienceRow.dataset.index, 10);
  draggedExperienceRow.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');

  // Use the full card as the drag image for clearer feedback
  const card = draggedExperienceRow.querySelector('.experience-list-item');
  if (card) {
    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setDragImage(card, offsetX, offsetY);
  }
}

function handleExperienceDragOver(e) {
  if (!draggedExperienceRow) return;
  e.preventDefault();
  elements.experienceList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  const overRow = e.currentTarget.closest('.experience-list-item-row');
  if (overRow) overRow.classList.add('drag-over');

  const afterElement = getExperienceDragAfterElement(elements.experienceList, e.clientY);
  if (afterElement == null) {
    elements.experienceList.appendChild(draggedExperienceRow);
  } else {
    elements.experienceList.insertBefore(draggedExperienceRow, afterElement);
  }
}

function handleExperienceDrop(e) {
  e.preventDefault();
  elements.experienceList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  applyExperienceReorder();
}

function handleExperienceDragEnd() {
  if (draggedExperienceRow) {
    draggedExperienceRow.classList.remove('dragging');
  }
  elements.experienceList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  applyExperienceReorder();

  draggedExperienceRow = null;
  draggedExperienceIndex = null;

  renderExperienceBadges();
}

function getExperienceDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.experience-list-item-row:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderExperienceBadges() {
  requestAnimationFrame(() => {
    const rows = elements.experienceList.querySelectorAll('.experience-list-item-row');
    const total = rows.length;

    if (total < 2) {
      removeExperienceBadges();
      return;
    }

    const newestRow = rows[0];
    const oldestRow = rows[rows.length - 1];

    const newestBadge = getOrCreateExperienceBadge('experienceBadgeNewest', 'Most recent', 'age-newest');
    const oldestBadge = getOrCreateExperienceBadge('experienceBadgeOldest', 'Oldest', 'age-oldest');

    positionExperienceBadge(newestBadge, newestRow);
    positionExperienceBadge(oldestBadge, oldestRow);
  });
}

function getOrCreateExperienceBadge(id, label, extraClass) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('span');
    el.id = id;
    el.className = `experience-age-pill ${extraClass}`;
    el.textContent = label;
    el.setAttribute('aria-hidden', 'true');
    elements.experienceList.appendChild(el);
  } else {
    el.className = `experience-age-pill ${extraClass}`;
    el.textContent = label;
  }
  return el;
}

function positionExperienceBadge(badgeEl, rowEl) {
  if (!badgeEl || !rowEl) return;
  const top = rowEl.offsetTop - elements.experienceList.scrollTop + rowEl.offsetHeight / 2;
  badgeEl.style.top = `${top}px`;
  badgeEl.style.display = 'inline-flex';
}

function removeExperienceBadges() {
  ['experienceBadgeNewest', 'experienceBadgeOldest'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function applyExperienceReorder() {
  const existing = state.resumeData.experience || [];
  if (existing.length < 2) return;

  const rows = [...elements.experienceList.querySelectorAll('.experience-list-item-row')];
  const newOrder = [];

  rows.forEach(row => {
    const originalIndex = parseInt(row.dataset.index, 10);
    if (!isNaN(originalIndex) && existing[originalIndex] !== undefined) {
      newOrder.push(existing[originalIndex]);
    }
  });

  if (newOrder.length !== existing.length) return;

  state.resumeData.experience = newOrder;
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  // Refresh list to reset data-index and badges
  populateExperienceList();

  autoGeneratePreview('section-reorder');

  draggedExperienceIndex = null;
}

// Education drag-and-drop for reordering
let draggedEducationRow = null;
let draggedEducationIndex = null;

function handleEducationDragStart(e) {
  draggedEducationRow = e.currentTarget.closest('.experience-list-item-row');
  if (!draggedEducationRow) return;
  draggedEducationIndex = parseInt(draggedEducationRow.dataset.eduIndex, 10);
  draggedEducationRow.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');

  const card = draggedEducationRow.querySelector('.experience-list-item');
  if (card) {
    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setDragImage(card, offsetX, offsetY);
  }
}

function handleEducationDragOver(e) {
  if (!draggedEducationRow) return;
  e.preventDefault();
  elements.educationList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  const overRow = e.currentTarget.closest('.experience-list-item-row');
  if (overRow) overRow.classList.add('drag-over');

  const afterElement = getEducationDragAfterElement(elements.educationList, e.clientY);
  if (afterElement == null) {
    elements.educationList.appendChild(draggedEducationRow);
  } else {
    elements.educationList.insertBefore(draggedEducationRow, afterElement);
  }

  renderEducationBadges();
}

function handleEducationDrop(e) {
  e.preventDefault();
  elements.educationList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  applyEducationReorder();
}

function handleEducationDragEnd() {
  if (draggedEducationRow) {
    draggedEducationRow.classList.remove('dragging');
  }
  elements.educationList.querySelectorAll('.experience-list-item-row').forEach(row => row.classList.remove('drag-over'));
  applyEducationReorder();

  draggedEducationRow = null;
  draggedEducationIndex = null;
}

function getEducationDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.experience-list-item-row:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function applyEducationReorder() {
  const existing = state.resumeData.education || [];
  if (existing.length < 2) return;

  const rows = [...elements.educationList.querySelectorAll('.experience-list-item-row')];
  const newOrder = [];

  rows.forEach(row => {
    const originalIndex = parseInt(row.dataset.eduIndex, 10);
    if (!isNaN(originalIndex) && existing[originalIndex] !== undefined) {
      newOrder.push(existing[originalIndex]);
    }
  });

  if (newOrder.length !== existing.length) return;

  state.resumeData.education = newOrder;
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  populateEducationList();
  autoGeneratePreview('section-reorder');
}

function renderEducationBadges() {
  requestAnimationFrame(() => {
    const rows = elements.educationList.querySelectorAll('.experience-list-item-row');
    const total = rows.length;

    if (total < 2) {
      removeEducationBadges();
      return;
    }

    const newestRow = rows[0];
    const oldestRow = rows[rows.length - 1];

    const newestBadge = getOrCreateEducationBadge('educationBadgeNewest', 'Most recent', 'age-newest');
    const oldestBadge = getOrCreateEducationBadge('educationBadgeOldest', 'Oldest', 'age-oldest');

    positionEducationBadge(newestBadge, newestRow);
    positionEducationBadge(oldestBadge, oldestRow);
  });
}

function getOrCreateEducationBadge(id, label, extraClass) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('span');
    el.id = id;
    el.className = `experience-age-pill ${extraClass}`;
    el.textContent = label;
    el.setAttribute('aria-hidden', 'true');
    elements.educationList.appendChild(el);
  } else {
    el.className = `experience-age-pill ${extraClass}`;
    el.textContent = label;
  }
  return el;
}

function positionEducationBadge(badgeEl, rowEl) {
  if (!badgeEl || !rowEl) return;
  const top = rowEl.offsetTop - elements.educationList.scrollTop + rowEl.offsetHeight / 2;
  badgeEl.style.top = `${top}px`;
  badgeEl.style.display = 'inline-flex';
}

function removeEducationBadges() {
  ['educationBadgeNewest', 'educationBadgeOldest'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function openExperienceEditor(experienceIndex) {
  currentEditingExperienceIndex = experienceIndex;
  const experience = state.resumeData.experience[experienceIndex];

  // Populate form fields
  elements.experienceFormTitle.textContent = `Edit Experience: ${experience.position || 'Untitled'}`;
  elements.expPosition.value = experience.position || '';
  elements.expCompany.value = experience.company || '';
  elements.expStartDate.value = experience.startDate || '';
  elements.expEndDate.value = experience.endDate || '';

  // Populate responsibilities
  populateResponsibilities(experience.responsibilities || []);

  // Close experience list modal and open form modal
  elements.experienceModal.classList.remove('show');
  elements.experienceFormModal.classList.add('show');
}

function addNewExperience() {
  currentEditingExperienceIndex = null; // Indicate this is a new experience

  // Clear form fields
  elements.experienceFormTitle.textContent = 'Add New Experience';
  elements.expPosition.value = '';
  elements.expCompany.value = '';
  elements.expStartDate.value = '';
  elements.expEndDate.value = '';

  // Add one empty responsibility field
  populateResponsibilities([]);

  // Close experience list modal and open form modal
  elements.experienceModal.classList.remove('show');
  elements.experienceFormModal.classList.add('show');
}

function deleteExperience(experienceIndex) {
  if (!confirm('Are you sure you want to delete this experience?')) {
    return;
  }

  state.resumeData.experience.splice(experienceIndex, 1);
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;

  populateExperienceList();
  flashPreviewStatus('Experience deleted', 'status-success');
  autoGeneratePreview('section-edit');
}

// Education Form Functions
function openEducationEditor(educationIndex) {
  currentEditingEducationIndex = educationIndex;
  const edu = state.resumeData.education[educationIndex];

  elements.educationFormTitle.textContent = `Edit Education: ${edu.degree || 'Untitled'}`;
  elements.edDegree.value = edu.degree || '';
  elements.edLevel.value = edu.level || '';
  elements.edInstitution.value = edu.institution || '';
  elements.edStartDate.value = edu.startDate || '';
  elements.edGraduationDate.value = edu.graduationDate || '';

  hideEducationFormError();

  elements.educationModal.classList.remove('show');
  elements.educationFormModal.classList.add('show');
}

function addNewEducation() {
  currentEditingEducationIndex = null;

  elements.educationFormTitle.textContent = 'Add Education';
  elements.edDegree.value = '';
  elements.edLevel.value = '';
  elements.edInstitution.value = '';
  elements.edStartDate.value = '';
  elements.edGraduationDate.value = '';

  hideEducationFormError();

  elements.educationModal.classList.remove('show');
  elements.educationFormModal.classList.add('show');
}

function deleteEducation(index) {
  if (!confirm('Are you sure you want to delete this education entry?')) return;

  state.resumeData.education.splice(index, 1);
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;

  populateEducationList();
  flashPreviewStatus('Education entry deleted', 'status-success');
  autoGeneratePreview('section-edit');
}

// Experience Form Functions
function populateResponsibilities(responsibilities) {
  elements.responsibilitiesList.innerHTML = '';

  if (responsibilities.length === 0) {
    addResponsibilityField();
  } else {
    responsibilities.forEach((resp, index) => {
      addResponsibilityField(resp);
    });
  }
}

function addResponsibilityField(text = '') {
  const item = document.createElement('div');
  item.className = 'responsibility-item';
  item.innerHTML = `
    <input type="text" value="${text || ''}" placeholder="Describe a responsibility or achievement..." />
    <button type="button" class="btn-icon" onclick="removeResponsibility(this)" title="Remove">
      <i class="fas fa-trash"></i>
    </button>
  `;
  elements.responsibilitiesList.appendChild(item);
}

function removeResponsibility(button) {
  const item = button.closest('.responsibility-item');
  item.remove();
}

function closeExperienceFormModal() {
  elements.experienceFormModal.classList.remove('show');
  currentEditingExperienceIndex = null;
  elements.experienceForm.reset();
  elements.responsibilitiesList.innerHTML = '';
  hideExperienceFormError();
}

function showExperienceFormError(message) {
  elements.experienceFormError.textContent = message;
  elements.experienceFormError.classList.add('show');
}

function hideExperienceFormError() {
  elements.experienceFormError.textContent = '';
  elements.experienceFormError.classList.remove('show');
}

function saveExperienceForm() {
  hideExperienceFormError();

  // Validate required fields
  if (!elements.expPosition.value.trim() || !elements.expCompany.value.trim() || !elements.expStartDate.value) {
    showExperienceFormError('Please fill in all required fields (Position, Company, Start Date)');
    return;
  }

  // Validate dates
  const startDate = elements.expStartDate.value.trim();
  const endDate = elements.expEndDate.value.trim();

  if (!validateDateFormatWithError(startDate, showExperienceFormError)) {
    return;
  }

  if (endDate && !validateDateFormatWithError(endDate, showExperienceFormError)) {
    return;
  }

  // Check that end date is after start date
  if (endDate && startDate >= endDate) {
    showExperienceFormError('End date must be after start date');
    return;
  }

  // Collect responsibilities
  const responsibilities = [];
  const responsibilityInputs = elements.responsibilitiesList.querySelectorAll('.responsibility-item input[type="text"]');
  responsibilityInputs.forEach(input => {
    const text = input.value.trim();
    if (text) {
      responsibilities.push(text);
    }
  });

  // Create experience object
  const experienceData = {
    position: elements.expPosition.value.trim(),
    company: elements.expCompany.value.trim(),
    startDate: startDate,
    endDate: endDate || null,
    responsibilities: responsibilities
  };

  // Update or add experience
  if (currentEditingExperienceIndex !== null) {
    // Update existing
    state.resumeData.experience[currentEditingExperienceIndex] = experienceData;
    flashPreviewStatus('Experience updated successfully', 'status-success');
  } else {
    // Add new
    if (!state.resumeData.experience) {
      state.resumeData.experience = [];
    }
    state.resumeData.experience.push(experienceData);
    flashPreviewStatus('New experience added', 'status-success');
  }

  // Update JSON editor
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;

  // Close form and reopen experience list
  closeExperienceFormModal();
  openExperienceManagementModal();
  autoGeneratePreview('section-edit');
}

// Validate date format (YYYY-MM)
function validateDateFormat(dateStr) {
  return validateDateFormatWithError(dateStr, showError);
}

// Validate date format with custom error display function
function validateDateFormatWithError(dateStr, errorFn) {
  // Check format YYYY-MM
  const datePattern = /^(\d{4})-(\d{2})$/;
  const match = dateStr.match(datePattern);

  if (!match) {
    errorFn('Date must be in YYYY-MM format (e.g., 2023-06)');
    return false;
  }

  const year = parseInt(match[1]);
  const month = parseInt(match[2]);

  // Validate year (reasonable range)
  if (year < 1900 || year > 2100) {
    errorFn('Year must be between 1900 and 2100');
    return false;
  }

  // Validate month (01-12)
  if (month < 1 || month > 12) {
    errorFn('Month must be between 01 and 12');
    return false;
  }

  return true;
}

function closeEducationFormModal() {
  elements.educationFormModal.classList.remove('show');
  currentEditingEducationIndex = null;
  elements.educationForm.reset();
  hideEducationFormError();
}

function showEducationFormError(message) {
  elements.educationFormError.textContent = message;
  elements.educationFormError.classList.add('show');
}

function hideEducationFormError() {
  elements.educationFormError.textContent = '';
  elements.educationFormError.classList.remove('show');
}

function saveEducationForm() {
  hideEducationFormError();

  const degree = elements.edDegree.value.trim();
  const level = elements.edLevel.value.trim();
  const institution = elements.edInstitution.value.trim();
  const startDate = elements.edStartDate.value.trim();
  const graduationDate = elements.edGraduationDate.value.trim();

  if (!degree || !level || !institution || !startDate) {
    showEducationFormError('Please fill in all required fields (Degree, Level, Institution, Start Date)');
    return;
  }

  if (!validateDateFormatWithError(startDate, showEducationFormError)) {
    return;
  }

  if (graduationDate && !validateDateFormatWithError(graduationDate, showEducationFormError)) {
    return;
  }

  if (graduationDate && startDate >= graduationDate) {
    showEducationFormError('Graduation date must be after start date');
    return;
  }

  const educationData = {
    degree,
    level,
    institution,
    startDate,
    graduationDate: graduationDate || null
  };

  if (currentEditingEducationIndex !== null) {
    state.resumeData.education[currentEditingEducationIndex] = educationData;
    flashPreviewStatus('Education updated successfully', 'status-success');
  } else {
    if (!state.resumeData.education) {
      state.resumeData.education = [];
    }
    state.resumeData.education.push(educationData);
    flashPreviewStatus('Education added successfully', 'status-success');
  }

  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  closeEducationFormModal();
  populateEducationList();
  elements.educationModal.classList.add('show');

  updateSectionManagementUI();
  autoGeneratePreview('section-edit');
}

// Personal Info Modal Functions
function openPersonalInfoModal() {
  // Populate form with current data
  const personalInfo = state.resumeData?.personalInfo || {};

  elements.piName.value = personalInfo.name || '';
  elements.piTitle.value = personalInfo.title || '';
  elements.piEmail.value = personalInfo.email || '';
  elements.piPhone.value = personalInfo.phone || '';
  elements.piLinkedin.value = personalInfo.linkedin || '';
  elements.piGithub.value = personalInfo.github || '';
  elements.piWebsite.value = personalInfo.website || '';
  elements.piLocation.value = personalInfo.location || '';

  // Hide any previous errors
  hidePersonalInfoFormError();

  elements.personalInfoModal.classList.add('show');
}

function closePersonalInfoModal() {
  elements.personalInfoModal.classList.remove('show');
  hidePersonalInfoFormError();
}

function showPersonalInfoFormError(message) {
  elements.personalInfoFormError.textContent = message;
  elements.personalInfoFormError.classList.add('show');
}

function hidePersonalInfoFormError() {
  elements.personalInfoFormError.textContent = '';
  elements.personalInfoFormError.classList.remove('show');
}

function savePersonalInfoForm() {
  hidePersonalInfoFormError();

  // Validate required fields
  const name = elements.piName.value.trim();

  if (!name) {
    showPersonalInfoFormError('Full Name is required');
    return;
  }

  // Validate email format if provided
  const email = elements.piEmail.value.trim();
  if (email && !isValidEmail(email)) {
    showPersonalInfoFormError('Please enter a valid email address');
    return;
  }

  // Build personalInfo object - only include non-empty fields
  const personalInfo = { name };

  const title = elements.piTitle.value.trim();
  if (title) personalInfo.title = title;

  // Only add optional fields if they have values
  if (email) personalInfo.email = email;

  const phone = elements.piPhone.value.trim();
  if (phone) personalInfo.phone = phone;

  const website = normalizeUrlValue(elements.piWebsite.value.trim());
  if (website) personalInfo.website = website;

  const linkedin = normalizeUrlValue(elements.piLinkedin.value.trim());
  if (linkedin) personalInfo.linkedin = linkedin;

  const github = normalizeUrlValue(elements.piGithub.value.trim());
  if (github) personalInfo.github = github;

  const location = elements.piLocation.value.trim();
  if (location) personalInfo.location = location;

  // Update state
  state.resumeData.personalInfo = personalInfo;

  // Update hidden JSON editor
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  // Close modal
  closePersonalInfoModal();

  // Update UI and preview
  updateSectionManagementUI();
  flashPreviewStatus('Personal information updated successfully', 'status-success');
  autoGeneratePreview('section-edit');
}

// Simple email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Ensure URLs have a protocol so links remain valid
function normalizeUrlValue(url) {
  if (!url) return '';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
    return url;
  }
  return `https://${url}`;
}

// GDPR Clause Modal Functions
function openGdprModal() {
  const clause = state.resumeData?.gdprClause || '';
  elements.gdprTextarea.value = clause;

  hideGdprFormError();

  elements.gdprModal.classList.add('show');

  setTimeout(() => {
    elements.gdprTextarea.focus();
  }, 100);
}

function closeGdprModal() {
  elements.gdprModal.classList.remove('show');
  hideGdprFormError();
}

function showGdprFormError(message) {
  elements.gdprFormError.textContent = message;
  elements.gdprFormError.classList.add('show');
}

function hideGdprFormError() {
  elements.gdprFormError.textContent = '';
  elements.gdprFormError.classList.remove('show');
}

function saveGdprForm() {
  hideGdprFormError();

  const clause = elements.gdprTextarea.value.trim();

  // GDPR clause is optional; keep the key with empty string if cleared
  state.resumeData.gdprClause = clause || '';

  // Clear any previous JSON error flags for this section
  state.sectionErrors.gdprClause = false;

  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  closeGdprModal();

  updateSectionManagementUI();
  flashPreviewStatus('GDPR clause updated successfully', 'status-success');
  autoGeneratePreview('section-edit');
}

// Summary Modal Functions
function openSummaryModal() {
  // Populate textarea with current summary
  const summary = state.resumeData?.summary || '';
  elements.summaryTextarea.value = summary;

  // Hide any previous errors
  hideSummaryFormError();

  elements.summaryModal.classList.add('show');

  // Focus textarea
  setTimeout(() => {
    elements.summaryTextarea.focus();
  }, 100);
}

function closeSummaryModal() {
  elements.summaryModal.classList.remove('show');
  hideSummaryFormError();
}

function showSummaryFormError(message) {
  elements.summaryFormError.textContent = message;
  elements.summaryFormError.classList.add('show');
}

function hideSummaryFormError() {
  elements.summaryFormError.textContent = '';
  elements.summaryFormError.classList.remove('show');
}

function saveSummaryForm() {
  hideSummaryFormError();

  const summary = elements.summaryTextarea.value.trim();

  // Summary can be empty - user might want to remove it
  // Update state
  if (summary) {
    state.resumeData.summary = summary;
  } else {
    // If empty, keep the key but with empty string
    state.resumeData.summary = '';
  }

  // Update hidden JSON editor
  elements.jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
  state.jsonModified = true;
  updateButtonStates();

  // Close modal
  closeSummaryModal();

  // Update UI and preview
  updateSectionManagementUI();
  flashPreviewStatus('Summary updated successfully', 'status-success');
  autoGeneratePreview('section-edit');
}

// PDF Preview Functions
async function showPdfPreview() {
  if (!state.currentHtml) {
    return;
  }

  // Validate inputs so the preview matches the exported PDF
  if (!validateJson()) {
    return;
  }

  const selectedThemeObj = state.themes.find(t => t.name === state.selectedTheme);
  const needsColor = selectedThemeObj && !selectedThemeObj.monochromatic;

  if (needsColor && !state.selectedColor) {
    showError('Please select a color for this theme');
    return;
  }

  // Open modal immediately with a loading indicator
  elements.pdfPreviewModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  elements.pdfPreviewContainer.innerHTML = `
    <div class="pdf-preview-placeholder">
      <div class="pdf-preview-spinner"></div>
      <p>Rendering a PDF preview...</p>
    </div>
  `;

  try {
    const filteredData = getFilteredResumeData();
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: filteredData,
        themeName: state.selectedTheme,
        colorName: state.selectedColor,
        photoBase64: state.photoBase64,
        customSectionNames: state.customSectionNames
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate PDF preview');
    }

    const blob = await response.blob();

    if (state.pdfPreviewUrl) {
      URL.revokeObjectURL(state.pdfPreviewUrl);
    }

    state.pdfPreviewUrl = window.URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.src = `${state.pdfPreviewUrl}#view=FitH`;
    iframe.className = 'pdf-preview-frame';
    iframe.title = 'PDF Preview';
    iframe.setAttribute('aria-label', 'PDF Preview');

    elements.pdfPreviewContainer.innerHTML = '';
    elements.pdfPreviewContainer.appendChild(iframe);
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    elements.pdfPreviewContainer.innerHTML = `
      <div class="pdf-preview-placeholder error">
        <p>Could not load the PDF preview.</p>
        <p class="pdf-preview-error-detail">${error.message}</p>
      </div>
    `;
  }
}

function closePdfPreview() {
  elements.pdfPreviewModal.classList.remove('show');
  document.body.style.overflow = 'auto';
  elements.pdfPreviewContainer.innerHTML = '';

  if (state.pdfPreviewUrl) {
    window.URL.revokeObjectURL(state.pdfPreviewUrl);
    state.pdfPreviewUrl = null;
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
