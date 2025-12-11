function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}.${year}`;
}

function generateExperienceSection(experience, sectionName = '💼 Experience') {
  if (!experience || experience.length === 0) return '';
  return `
  <section>
    <h2>${sectionName}</h2>
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

function generateEducationSection(education, sectionName = '🎓 Education') {
  if (!education || education.length === 0) return '';
  return `
  <section>
    <h2>${sectionName}</h2>
    ${education.map(edu => {
      // Format date range: show "startDate - graduationDate" if startDate exists, otherwise just graduationDate
      const dateDisplay = edu.startDate
        ? `${formatDate(edu.startDate)} - ${formatDate(edu.graduationDate)}`
        : formatDate(edu.graduationDate);

      return `
      <div class="education-item">
        <div class="education-header">
          <div>
            <div class="degree">${edu.degree}${edu.level ? ` <span class="education-level">(${edu.level})</span>` : ''}</div>
            <div class="institution">${edu.institution}</div>
          </div>
          <div class="date-location">${dateDisplay}</div>
        </div>
      </div>
      `;
    }).join('')}
  </section>`;
}

function generateSkillsSection(skills, sectionName = '💡 Skills') {
  if (!skills || !Array.isArray(skills) || skills.length === 0) return '';

  // Limit to maximum 4 categories
  const limitedSkills = skills.slice(0, 4);

  return `
  <section>
    <h2>${sectionName}</h2>
    <div class="skills-grid">
      ${limitedSkills.map(category => {
        const fraction = category.fraction || 1;
        return `
        <div class="skill-category" style="flex: ${fraction} 1 0;">
          <h3>${category.name}</h3>
          <div class="skill-tags">
            ${category.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
          </div>
        </div>
        `;
      }).join('')}
    </div>
  </section>`;
}

function generateProjectsSection(projects, projectsIntro, sectionName = '🚀 Projects') {
  if (!projects || projects.length === 0) return '';
  const introLink = projectsIntro?.link ? normalizeUrl(projectsIntro.link) : '';
  const introLinkText = projectsIntro?.link ? stripProtocol(projectsIntro.linkText || projectsIntro.link) : '';
  return `
  <section>
    <h2>${sectionName}</h2>
    ${projectsIntro ? `<p class="projects-intro">${projectsIntro.text} <a href="${introLink}" target="_blank">${introLinkText}</a></p>` : ''}
    <div class="projects-grid">
      ${projects.map(project => `
        <div class="project-item">
          <div class="project-name">${project.name}</div>
          <p class="project-description">${project.description}</p>
          ${project.technologies && project.technologies.length > 0 ? `
            <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
          ` : ''}
          ${project.link ? `
            <div class="project-link-line">Link: <a href="${normalizeUrl(project.link)}" target="_blank" rel="noopener noreferrer" class="project-link" title="View project">${stripProtocol(project.link || '')} <i class="fas fa-external-link-alt"></i></a></div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  </section>`;
}

function normalizeUrl(url) {
  if (!url) return '';
  // If protocol already present, return as is
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
    return url;
  }
  return `https://${url}`;
}

function stripProtocol(url) {
  if (!url) return '';
  return url.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');
}

function generateHTML(resumeData, photoBase64 = null, theme, colorPalette, customSectionNames = {}) {
  if (!theme) {
    throw new Error('Theme is required to generate HTML.');
  }
  const { personalInfo } = resumeData;

  // Load theme styles
  const paletteToUse = theme.monochromatic ? undefined : colorPalette;
  const themeStyles = theme.getStyles(paletteToUse);

  // Normalize external links to avoid double protocols
  const contactLinks = {
    email: personalInfo.email,
    phone: personalInfo.phone,
    linkedin: personalInfo.linkedin ? normalizeUrl(personalInfo.linkedin) : '',
    github: personalInfo.github ? normalizeUrl(personalInfo.github) : '',
    website: personalInfo.website ? normalizeUrl(personalInfo.website) : ''
  };

  // Helper to extract slug from social media URLs
  const extractSlug = (url, platform) => {
    if (!url) return '';
    const cleanUrl = stripProtocol(url);
    if (platform === 'linkedin') {
      // Extract /in/username or /company/name
      const match = cleanUrl.match(/linkedin\.com\/(in|company)\/([^\/\?]+)/);
      return match ? `/${match[1]}/${match[2]}` : cleanUrl;
    } else if (platform === 'github') {
      // Extract /username
      const match = cleanUrl.match(/github\.com\/([^\/\?]+)/);
      return match ? `/${match[1]}` : cleanUrl;
    }
    return cleanUrl;
  };

  const contactDisplay = {
    linkedin: extractSlug(contactLinks.linkedin, 'linkedin'),
    github: extractSlug(contactLinks.github, 'github'),
    website: stripProtocol(contactLinks.website)
  };

  // Helper to get section display name
  const getSectionName = (sectionKey) => {
    if (customSectionNames && customSectionNames[sectionKey]) {
      return customSectionNames[sectionKey];
    }
    const defaultNames = {
      experience: '💼 Experience',
      education: '🎓 Education',
      skills: '💡 Skills',
      projects: '🚀 Projects'
    };
    return defaultNames[sectionKey] || sectionKey;
  };

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
      const sectionName = getSectionName(key);
      if (key === 'projects') {
        return sectionGenerators[key](resumeData[key], resumeData.projectsIntro, sectionName);
      }
      return sectionGenerators[key](resumeData[key], sectionName);
    })
    .join('\n');

  // Determine which header columns have content
  const hasCol1 = true; // Always has name
  const hasCol2 = !!(contactLinks.email || contactLinks.phone || contactLinks.linkedin ||
                     contactLinks.github || contactLinks.website || personalInfo.location);
  const hasCol3 = !!photoBase64;

  // Calculate column fractions based on which columns exist
  let col1Fraction, col2Fraction, col3Fraction;
  const columnsPresent = [hasCol1, hasCol2, hasCol3].filter(Boolean).length;

  if (columnsPresent === 3) {
    // All three columns: 0.35, 0.35, 0.3
    col1Fraction = 0.35;
    col2Fraction = 0.35;
    col3Fraction = 0.3;
  } else if (columnsPresent === 2) {
    // Two columns: equal spacing (1:1)
    if (hasCol1 && hasCol2) {
      col1Fraction = 1;
      col2Fraction = 1;
      col3Fraction = 0;
    } else if (hasCol1 && hasCol3) {
      col1Fraction = 1;
      col2Fraction = 0;
      col3Fraction = 1;
    } else {
      col1Fraction = 0;
      col2Fraction = 1;
      col3Fraction = 1;
    }
  } else {
    // Single column: takes full width
    col1Fraction = hasCol1 ? 1 : 0;
    col2Fraction = hasCol2 ? 1 : 0;
    col3Fraction = hasCol3 ? 1 : 0;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Resume</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji">
  <style>${themeStyles}</style>
</head>
<body>
  <div class="content-wrapper">
    <header style="--header-col1-fraction: ${col1Fraction}; --header-col2-fraction: ${col2Fraction}; --header-col3-fraction: ${col3Fraction};">
      <h1>${personalInfo.name}</h1>
      ${personalInfo.title ? `<div class="title">${personalInfo.title}</div>` : ''}
      ${resumeData.summary ? `<div class="header-column header-col-info">
        <p class="summary">${resumeData.summary}</p>
      </div>` : '<div class="header-column header-col-info"></div>'}
      ${hasCol2 ? `<div class="header-column header-col-contact">
        ${contactLinks.email ? `<span><i class="fas fa-envelope"></i><a href="mailto:${contactLinks.email}">${contactLinks.email}</a></span>` : ''}
        ${contactLinks.phone ? `<span><i class="fas fa-phone"></i><a href="tel:${contactLinks.phone}">${contactLinks.phone}</a></span>` : ''}
        ${contactLinks.linkedin ? `<span><i class="fab fa-linkedin"></i><a href="${contactLinks.linkedin}" target="_blank">${contactDisplay.linkedin}</a></span>` : ''}
        ${contactLinks.github ? `<span><i class="fab fa-github"></i><a href="${contactLinks.github}" target="_blank">${contactDisplay.github}</a></span>` : ''}
        ${contactLinks.website ? `<span><i class="fas fa-globe"></i><a href="${contactLinks.website}" target="_blank">${contactDisplay.website}</a></span>` : ''}
        ${personalInfo.location ? `<span><i class="fas fa-map-marker-alt"></i>${personalInfo.location}</span>` : ''}
      </div>` : ''}
      ${hasCol3 ? `<div class="header-column header-col-photo"><img src="${photoBase64}" alt="${personalInfo.name}" class="profile-photo"></div>` : ''}
    </header>

${sections}
  </div>

${resumeData.gdprClause ? `<div class="gdpr-clause">${resumeData.gdprClause}</div>` : ''}
</body>
</html>`;
}

module.exports = { generateHTML };
