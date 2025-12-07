function getStyles(palette) {
  if (!palette) {
    throw new Error('Color palette is required for the corpo theme.');
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
      color: #444;
    }

    .project-name a {
      color: ${palette.primary};
    }

    body {
      font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
      line-height: 1.6;
      color: #222;
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
      border-bottom: 4px solid ${palette.primary};
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
      border-radius: 4px;
      object-fit: cover;
      border: 3px solid ${palette.primary};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    h1 {
      font-size: 36px;
      color: ${palette.primary};
      margin-bottom: 5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .title {
      font-size: 20px;
      color: #555;
      margin-bottom: 15px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(3, auto);
      gap: 12px 20px;
      font-size: 14px;
      color: #444;
    }

    .contact-info span {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
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
      color: #fff;
      background: ${palette.primary};
      padding: 6px 15px;
      padding-bottom: 8px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #444;
      margin-top: 15px;
      margin-bottom: 0;
      font-style: italic;
    }

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
      padding-left: 15px;
      border-left: 3px solid ${palette.accent};
    }

    .experience-header, .education-header, .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .position, .degree, .project-name {
      font-size: 18px;
      font-weight: 700;
      color: #222;
      text-transform: uppercase;
    }

    .company, .institution {
      font-size: 16px;
      color: ${palette.accent};
      margin-bottom: 3px;
      font-weight: 600;
    }

    .education-level {
      font-size: 14px;
      font-weight: 400;
      color: #666;
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
      color: #444;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
    }

    .skill-category {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 0;
      border-left: 4px solid ${palette.accent};
    }

    .skill-category h3 {
      font-size: 16px;
      color: ${palette.primary};
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
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
      border: 1px solid #ddd;
      font-weight: 500;
    }

    .projects-intro {
      font-size: 14px;
      color: #444;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #eee;
      font-style: italic;
    }

    .projects-intro a {
      color: ${palette.accent};
      font-weight: 600;
    }

    section:has(.projects-intro) h2 {
      margin-bottom: 10px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      column-gap: 30px;
    }

    .project-description {
      font-size: 14px;
      color: #444;
      margin-bottom: 5px;
    }

    .technologies {
      font-size: 13px;
      color: ${palette.primary};
      font-style: italic;
      font-weight: 500;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 2px solid ${palette.primary};
      font-size: 10px;
      color: #666;
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
        background: ${palette.primary};
        color: #fff;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
        page-break-after: avoid;
      }

      .experience-item, .education-item, .project-item {
        page-break-inside: avoid;
        page-break-before: auto;
      }

      .skill-category {
        page-break-inside: avoid;
        background: #f5f5f5;
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

module.exports = { name: 'corpo', getStyles, monochromatic: false };
