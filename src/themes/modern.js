function getStyles(palette) {
  if (!palette) {
    throw new Error('Color palette is required for the modern theme.');
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

    .project-link-line {
      font-size: 13px;
      color: ${palette.primary};
      font-style: italic;
      font-weight: 500;
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
      line-height: 1.6;
      color: #1a1a1a;
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
      background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
      padding: 15px;
      border-radius: 8px;
    }

    .header-top {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .header-left {
      flex: 1;
      min-width: 0;
    }

    .header-right {
      flex-shrink: 0;
    }

    .profile-photo {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      object-fit: cover;
      border: 5px solid ${palette.primary};
      box-shadow: 0 8px 16px ${palette.primary}33;
    }

    h1 {
      font-size: 36px;
      color: #1a1a1a;
      margin-bottom: 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .title {
      font-size: 20px;
      color: #666;
      margin-bottom: 12px;
      font-weight: 400;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #444;
      margin-top: 0;
      margin-bottom: 0;
      font-style: italic;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(2, auto);
      gap: 12px 20px;
      font-size: 14px;
      color: #444;
      margin-top: 20px;
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
      color: ${palette.primary};
      border-bottom: none;
      padding-bottom: 8px;
      margin-bottom: 15px;
      letter-spacing: 2px;
      font-weight: 700;
      position: relative;
      padding-left: 15px;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    h2::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, ${palette.primary}, ${palette.accent});
      border-radius: 2px;
    }

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
      padding-left: 15px;
      border-left: 2px solid #e8e8e8;
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
      color: #1a1a1a;
    }

    .company, .institution {
      font-size: 16px;
      color: ${palette.primary};
      margin-bottom: 3px;
      font-weight: 500;
    }

    .education-level {
      font-size: 14px;
      font-weight: 400;
      color: #888;
    }

    .date-location {
      font-size: 16px;
      color: #666;
      font-style: italic;
      font-weight: 500;
      background: ${palette.light};
      padding: 4px 12px;
      border-radius: 4px;
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
    }

    li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #444;
      line-height: 1.6;
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
    }

    .skill-category {
      background: linear-gradient(135deg, ${palette.light} 0%, #ffffff 100%);
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid ${palette.primary};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      min-width: 0;
      box-sizing: border-box;
    }

    .skill-category h3 {
      font-size: 16px;
      color: ${palette.primary};
      margin-bottom: 8px;
      text-transform: capitalize;
      font-weight: 700;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-tag {
      background: #fff;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 13px;
      color: #444;
      border: 1px solid #d0d0d0;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      white-space: nowrap;
    }

    .projects-intro {
      font-size: 14px;
      color: #444;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e8e8e8;
      font-style: italic;
    }

    .projects-intro a {
      color: ${palette.primary};
      font-weight: 600;
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
      color: #444;
      margin-bottom: 5px;
      line-height: 1.6;
    }

    .technologies {
      font-size: 13px;
      color: #666;
      font-style: italic;
      font-weight: 500;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 2px solid #e8e8e8;
      font-size: 10px;
      color: #888;
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

      header {
        background: #f8f9fa;
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
        background: ${palette.light};
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .date-location {
        background: ${palette.light};
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

module.exports = { name: 'modern', getStyles, monochromatic: false };
