function getStyles(palette) {
  if (!palette) {
    throw new Error('Color palette is required for the linux theme.');
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
      color: ${palette.accent};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .project-link-line {
      font-size: 11px;
      color: ${palette.primary};
      font-style: normal;
      font-weight: 400;
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
      font-family: 'Courier New', 'Liberation Mono', 'Consolas', monospace, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
      line-height: 1.6;
      color: ${palette.primary};
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
      border-bottom: 2px dashed ${palette.primary};
      padding-bottom: 20px;
      margin-bottom: 30px;
      position: relative;
      padding: 15px;
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

    header.no-summary .header-contacts {
      grid-row: 2;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
      gap: 8px 12px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #333;
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
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
      color: #333;
    }

    .contact-item a:hover {
      color: #000;
    }

    .profile-photo {
      width: 180px;
      height: 180px;
      max-width: 300px;
      max-height: 300px;
      aspect-ratio: 1;
      border-radius: 0;
      object-fit: cover;
      border: 2px solid ${palette.primary};
      box-shadow: 4px 4px 0 ${palette.primary};
    }

    h1 {
      font-size: 32px;
      color: #1a1a1a;
      margin-bottom: 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    h1::before {
      content: "$ whoami > ";
      color: ${palette.accent};
      font-weight: 400;
      font-size: 12px;
      margin-right: 5px;
    }

    .title {
      font-size: 18px;
      color: #333;
      margin-bottom: 0;
      font-weight: 400;
    }

    .title::before {
      content: "# ";
      color: ${palette.accent};
    }

    .summary {
      font-size: 13px;
      line-height: 1.6;
      color: #222;
      margin-top: 0;
      margin-bottom: 0;
      font-style: normal;
      padding-left: 12px;
      border-left: 3px solid ${palette.primary};
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      font-size: 20px;
      color: ${palette.primary};
      border-bottom: none;
      padding-bottom: 8px;
      margin-bottom: 15px;
      letter-spacing: 2px;
      font-weight: 700;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    h2::before {
      content: "## ";
      color: ${palette.accent};
      margin-right: 5px;
    }

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
      padding-left: 12px;
    }

    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .position, .degree, .project-name {
      font-size: 16px;
      font-weight: 700;
      color: ${palette.primary};
    }

    .position::before, .degree::before, .project-name::before {
      content: "> ";
      color: ${palette.accent};
      margin-right: 3px;
    }

    .company, .institution {
      font-size: 14px;
      color: #333;
      margin-bottom: 3px;
      font-weight: 400;
    }

    .company::before, .institution::before {
      content: "@ ";
      color: ${palette.accent};
      margin-right: 3px;
    }

    .education-level {
      font-size: 12px;
      font-weight: 400;
      color: #555;
    }

    .date-location {
      font-size: 14px;
      color: ${palette.primary};
      font-style: normal;
      font-weight: 500;
      padding: 4px 12px;
    }

    .date-location::before {
      content: "[";
      color: ${palette.accent};
    }

    .date-location::after {
      content: "]";
      color: ${palette.accent};
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
      list-style-type: none;
    }

    li {
      margin-bottom: 5px;
      font-size: 12px;
      color: #222;
      line-height: 1.6;
    }

    li::before {
      content: "- ";
      color: ${palette.accent};
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
    }

    .skill-category {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 0;
      border: 1px dashed ${palette.primary};
      min-width: 0;
      box-sizing: border-box;
    }

    .skill-category h3 {
      font-size: 14px;
      color: ${palette.primary};
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 700;
    }

    .skill-category h3::before {
      content: ">> ";
      color: ${palette.accent};
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-tag {
      background: #fff;
      padding: 5px 12px;
      border-radius: 0;
      font-size: 11px;
      color: #333;
      border: 1px solid ${palette.primary};
      white-space: nowrap;
    }

    .projects-intro {
      font-size: 12px;
      color: #222;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px dashed ${palette.primary};
      font-style: normal;
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
      font-size: 12px;
      color: #222;
      margin-bottom: 5px;
      line-height: 1.6;
    }

    .technologies {
      font-size: 11px;
      color: ${palette.primary};
      font-style: normal;
      font-weight: 400;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px dashed ${palette.primary};
      font-size: 10px;
      color: #555;
      line-height: 1.4;
      text-align: justify;
      page-break-inside: avoid;
      page-break-before: auto;
    }

    .gdpr-clause::before {
      content: "/* ";
      color: ${palette.accent};
    }

    .gdpr-clause::after {
      content: " */";
      color: ${palette.accent};
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
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .gdpr-clause {
        margin-top: auto;
        page-break-inside: avoid;
        page-break-before: auto;
      }
    }
  `;
}

module.exports = { name: 'linux', getStyles, monochromatic: false };
