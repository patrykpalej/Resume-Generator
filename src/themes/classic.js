function getStyles() {
  // Classic theme ignores color parameter and always uses black/gray
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
      color: #333;
    }

    .project-link-line {
      font-size: 13px;
      color: #000;
      font-style: italic;
    }

    .project-link {
      color: #000;
      transition: color 0.2s;
    }

    .project-link:hover {
      color: #555;
      text-decoration: underline;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
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
      border-bottom: 2px solid #1a1a1a;
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
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #1a1a1a;
      box-shadow: none;
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
      letter-spacing: 0.5px;
    }

    .title {
      font-size: 20px;
      color: #4a4a4a;
      margin-bottom: 15px;
      font-weight: 400;
      font-style: italic;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(2, auto);
      gap: 12px 20px;
      font-size: 14px;
      color: #333;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .contact-info span {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .contact-info i {
      width: 16px;
      color: #1a1a1a;
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      font-size: 22px;
      color: #1a1a1a;
      border-bottom: 1px solid #1a1a1a;
      padding-bottom: 8px;
      margin-bottom: 15px;
      letter-spacing: 2px;
      font-weight: 700;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      margin-top: 15px;
      margin-bottom: 0;
      font-style: italic;
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
      color: #1a1a1a;
    }

    .company, .institution {
      font-size: 16px;
      color: #333;
      margin-bottom: 3px;
      font-weight: 600;
    }

    .education-level {
      font-size: 14px;
      font-weight: 400;
      color: #666;
      font-style: italic;
    }

    .date-location {
      font-size: 16px;
      color: #1a1a1a;
      font-style: normal;
      font-weight: 600;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
    }

    li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
      width: 95%;
    }

    .skill-category {
      background: #fafafa;
      padding: 15px;
      border-radius: 0;
      border-left: 3px solid #1a1a1a;
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      flex-shrink: 0;
      min-width: 0;
    }

    .skill-category h3 {
      font-size: 16px;
      color: #1a1a1a;
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
      border-radius: 0;
      font-size: 13px;
      color: #333;
      border: 1px solid #1a1a1a;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      white-space: nowrap;
    }

    .projects-intro {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #ecf0f1;
      font-style: italic;
    }

    .projects-intro a {
      color: #1a1a1a;
      font-weight: 600;
      text-decoration: underline;
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
      color: #333;
      margin-bottom: 5px;
    }

    .technologies {
      font-size: 13px;
      color: #1a1a1a;
      font-style: italic;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #1a1a1a;
      font-size: 10px;
      color: #4a4a4a;
      line-height: 1.4;
      text-align: justify;
      page-break-inside: avoid;
      page-break-before: auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        background: #fafafa;
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

module.exports = { name: 'classic', getStyles, monochromatic: true };
