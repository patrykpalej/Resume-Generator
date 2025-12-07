function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function generateExperienceSection(experience) {
  if (!experience || experience.length === 0) return '';
  return `
  <section>
    <h2>Experience</h2>
    ${experience.map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <div>
            <div class="position">${exp.position}</div>
            <div class="company">${exp.company}</div>
          </div>
          <div class="date-location">
            ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}
          </div>
        </div>
        ${exp.responsibilities && exp.responsibilities.length > 0 ? `
          <ul>
            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </section>`;
}

function generateEducationSection(education) {
  if (!education || education.length === 0) return '';
  return `
  <section>
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <div>
            <div class="degree">${edu.degree}${edu.level ? ` <span class="education-level">(${edu.level})</span>` : ''}</div>
            <div class="institution">${edu.institution}</div>
          </div>
          <div class="date-location">${formatDate(edu.graduationDate)}</div>
        </div>
      </div>
    `).join('')}
  </section>`;
}

function generateSkillsSection(skills) {
  if (!skills) return '';
  return `
  <section>
    <h2>Skills</h2>
    <div class="skills-grid">
      ${Object.entries(skills).map(([category, items]) => `
        <div class="skill-category">
          <h3>${category}</h3>
          <div class="skill-tags">
            ${items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </section>`;
}

function generateProjectsSection(projects, projectsIntro) {
  if (!projects || projects.length === 0) return '';
  return `
  <section>
    <h2>Hobby Projects</h2>
    ${projectsIntro ? `<p class="projects-intro">${projectsIntro.text} <a href="${projectsIntro.link}" target="_blank">${projectsIntro.linkText}</a></p>` : ''}
    <div class="projects-grid">
      ${projects.map(project => `
        <div class="project-item">
          <div class="project-name">${project.link ? `<a href="${project.link}" target="_blank">${project.name}</a>` : project.name}</div>
          <p class="project-description">${project.description}</p>
          ${project.technologies ? `
            <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  </section>`;
}

function generateHTML(resumeData, photoBase64 = null, theme, colorPalette) {
  if (!theme) {
    throw new Error('Theme is required to generate HTML.');
  }
  const { personalInfo } = resumeData;

  // Load theme styles
  const paletteToUse = theme.monochromatic ? undefined : colorPalette;
  const themeStyles = theme.getStyles(paletteToUse);

  // Map section names to their generator functions
  const sectionGenerators = {
    experience: generateExperienceSection,
    education: generateEducationSection,
    skills: generateSkillsSection,
    projects: generateProjectsSection
  };

  // Generate sections dynamically based on JSON order
  const sections = Object.keys(resumeData)
    .filter(key => key !== 'personalInfo' && key !== 'summary' && key !== 'projectsIntro' && sectionGenerators[key])
    .map(key => {
      if (key === 'projects') {
        return sectionGenerators[key](resumeData[key], resumeData.projectsIntro);
      }
      return sectionGenerators[key](resumeData[key]);
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Resume</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>${themeStyles}</style>
</head>
<body>
  <div class="content-wrapper">
    <header>
      <div class="header-content">
        <h1>${personalInfo.name}</h1>
        <div class="title">${personalInfo.title}</div>
        <div class="contact-info">
          ${personalInfo.email ? `<span><i class="fas fa-envelope"></i><a href="mailto:${personalInfo.email}">${personalInfo.email}</a></span>` : ''}
          ${personalInfo.phone ? `<span><i class="fas fa-phone"></i><a href="tel:${personalInfo.phone}">${personalInfo.phone}</a></span>` : ''}
          ${personalInfo.website ? `<span><i class="fas fa-globe"></i><a href="https://${personalInfo.website}" target="_blank">${personalInfo.website}</a></span>` : ''}
          ${personalInfo.linkedin ? `<span><i class="fab fa-linkedin"></i><a href="https://${personalInfo.linkedin}" target="_blank">${personalInfo.linkedin}</a></span>` : ''}
          ${personalInfo.github ? `<span><i class="fab fa-github"></i><a href="https://${personalInfo.github}" target="_blank">${personalInfo.github}</a></span>` : ''}
        </div>
        ${resumeData.summary ? `<p class="summary">${resumeData.summary}</p>` : ''}
      </div>
      ${photoBase64 ? `<img src="${photoBase64}" alt="${personalInfo.name}" class="profile-photo">` : ''}
    </header>

${sections}
  </div>

${resumeData.gdprClause ? `<div class="gdpr-clause">${resumeData.gdprClause}</div>` : ''}
</body>
</html>`;
}

module.exports = { generateHTML };
