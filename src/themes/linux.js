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
      font-size: 13px;
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
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .profile-photo {
      flex-shrink: 0;
      width: 180px;
      height: 180px;
      border-radius: 0;
      object-fit: cover;
      border: 2px solid ${palette.primary};
      box-shadow: 4px 4px 0 ${palette.primary};
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    h1 {
      font-size: 36px;
      color: #1a1a1a;
      margin-bottom: 5px;
      font-weight: 700;
    }

    h1::before {
      content: "$ whoami > ";
      color: ${palette.accent};
      font-weight: 400;
      font-size: 14px;
    }

    .title {
      font-size: 20px;
      color: #333;
      margin-bottom: 15px;
      font-weight: 400;
    }

    .title::before {
      content: "# ";
      color: ${palette.accent};
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(3, auto);
      gap: 12px 20px;
      font-size: 14px;
      color: #333;
    }

    .contact-info span {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .contact-info a {
      color: #333;
    }

    .contact-info a:hover {
      color: #000;
    }

    .contact-info i {
      width: 16px;
      color: ${palette.accent};
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      font-size: 22px;
      color: ${palette.primary};
      border-bottom: 1px solid ${palette.primary};
      padding-bottom: 8px;
      margin-bottom: 15px;
      letter-spacing: 1px;
      font-weight: 700;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    h2::before {
      content: "## ";
      color: ${palette.accent};
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #222;
      margin-top: 15px;
      margin-bottom: 0;
      font-style: normal;
      padding-left: 15px;
      border-left: 3px solid ${palette.primary};
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
      font-weight: 700;
      color: ${palette.primary};
    }

    .position::before, .degree::before, .project-name::before {
      content: "> ";
      color: ${palette.accent};
    }

    .company, .institution {
      font-size: 16px;
      color: #333;
      margin-bottom: 3px;
      font-weight: 400;
    }

    .company::before, .institution::before {
      content: "@ ";
      color: ${palette.accent};
    }

    .education-level {
      font-size: 14px;
      font-weight: 400;
      color: #555;
    }

    .date-location {
      font-size: 16px;
      color: ${palette.primary};
      font-style: normal;
      font-weight: 500;
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
      font-size: 14px;
      color: #222;
    }

    li::before {
      content: "- ";
      color: ${palette.accent};
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
      width: 95%;
    }

    .skill-category {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 0;
      border: 1px dashed ${palette.primary};
      flex-shrink: 0;
      min-width: 0;
    }

    .skill-category h3 {
      font-size: 16px;
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
      font-size: 13px;
      color: #333;
      border: 1px solid ${palette.primary};
      white-space: nowrap;
    }

    .projects-intro {
      font-size: 14px;
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
      font-size: 14px;
      color: #222;
      margin-bottom: 5px;
    }

    .technologies {
      font-size: 13px;
      color: ${palette.primary};
      font-style: normal;
      font-weight: 400;
    }

    .technologies::before {
      content: "tech: ";
      color: ${palette.accent};
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
