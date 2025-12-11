function getStyles(palette) {
  if (!palette) {
    throw new Error('Color palette is required for the default theme.');
  }

  palette = {
    primary: palette.primary,
    accent: palette.accent,
    light: palette.light || palette.accent
  };

  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .contact-info a {
      color: #555;
    }

    .project-link-line {
      font-size: 13px;
      color: ${palette.primary};
      font-style: italic;
    }

    .project-link {
      color: ${palette.primary};
      transition: color 0.2s;
    }

    .project-link:hover {
      color: ${palette.accent};
      text-decoration: underline;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .content-wrapper {
      flex: 1;
    }

    header {
      border-bottom: 3px solid ${palette.primary};
      padding-bottom: 20px;
      margin-bottom: 30px;
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto auto;
      gap: 12px 20px;
      align-items: start;
    }

    .header-name {
      grid-column: 1;
      grid-row: 1;
    }

    .header-photo {
      grid-column: 2;
      grid-row: 1 / 3;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding-left: 20px;
    }

    .header-summary {
      grid-column: 1;
      grid-row: 2;
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .header-contacts {
      grid-column: 1;
      grid-row: 3;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: var(--contact-grid-col1-fraction, 1)fr var(--contact-grid-col2-fraction, 1)fr;
      gap: 8px 12px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
      min-width: 0;
      max-width: 100%;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .contact-item > * {
      min-width: 0;
    }

    .contact-item i {
      width: 16px;
      flex-shrink: 0;
      color: ${palette.accent};
    }

    .contact-item a {
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .contact-item a {
      color: #555;
    }

    .profile-photo {
      width: 180px;
      height: 180px;
      max-width: 300px;
      max-height: 300px;
      aspect-ratio: 1;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid ${palette.primary};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 36px;
      color: #1a1a1a;
      margin-bottom: 0;
    }

    .title {
      font-size: 20px;
      color: #7f8c8d;
      margin-bottom: 0;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #555;
      margin-top: 0;
      margin-bottom: 0;
      font-style: italic;
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      font-size: 22px;
      color: ${palette.primary};
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 8px;
      margin-bottom: 15px;
      letter-spacing: 1px;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .position, .degree, .project-name {
      font-size: 18px;
      font-weight: 600;
      color: ${palette.primary};
    }

    .company, .institution {
      font-size: 16px;
      color: ${palette.accent};
      margin-bottom: 3px;
    }

    .education-level {
      font-size: 14px;
      font-weight: 400;
      color: #7f8c8d;
    }

    .date-location {
      font-size: 16px;
      color: ${palette.primary};
      font-style: italic;
      font-weight: 500;
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
    }

    li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #555;
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
    }

    .skill-category {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid ${palette.accent};
      min-width: 0;
      box-sizing: border-box;
    }

    .skill-category h3 {
      font-size: 16px;
      color: ${palette.primary};
      margin-bottom: 8px;
      text-transform: capitalize;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-tag {
      background: #fff;
      padding: 5px 12px;
      border-radius: 3px;
      font-size: 13px;
      color: #555;
      border: 1px solid #e0e0e0;
      white-space: nowrap;
    }

    .projects-intro {
      font-size: 14px;
      color: #555;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #ecf0f1;
      font-style: italic;
    }

    .projects-intro a {
      color: ${palette.accent};
      font-weight: 500;
    }

    section:has(.projects-intro) h2 {
      border-bottom: none;
      margin-bottom: 2px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      column-gap: 30px;
    }

    .project-description {
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
    }

    .technologies {
      font-size: 13px;
      color: ${palette.primary};
      font-style: italic;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      font-size: 10px;
      color: #7f8c8d;
      line-height: 1.4;
      text-align: justify;
      page-break-inside: avoid;
      page-break-before: auto;
    }

    @media print {
      body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .content-wrapper {
        flex: 1;
      }

      .profile-photo {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      h2 {
        page-break-after: avoid;
      }

      .experience-item, .education-item, .project-item {
        page-break-inside: avoid;
        page-break-before: auto;
      }

      .skill-category {
        page-break-inside: avoid;
      }

      .gdpr-clause {
        margin-top: auto;
        page-break-inside: avoid;
        page-break-before: auto;
      }
    }
  `;
}

module.exports = { name: 'default', getStyles, monochromatic: false };
