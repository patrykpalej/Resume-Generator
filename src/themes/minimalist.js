function getStyles() {
  // Minimalist theme ignores color parameter - always monochromatic black/white
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

    .project-name a {
      color: #000;
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #000;
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
      border-bottom: 1px solid #000;
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
      border: 1px solid #000;
      box-shadow: none;
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    h1 {
      font-size: 36px;
      color: #000;
      margin-bottom: 5px;
      font-weight: 300;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .title {
      font-size: 20px;
      color: #666;
      margin-bottom: 15px;
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
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

    .contact-info i {
      width: 16px;
      color: #000;
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      font-size: 22px;
      color: #000;
      border-bottom: none;
      padding-bottom: 8px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 400;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      margin-top: 15px;
      margin-bottom: 0;
      font-style: normal;
      font-weight: 300;
    }

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .experience-header, .education-header, .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .position, .degree, .project-name {
      font-size: 18px;
      font-weight: 500;
      color: #000;
    }

    .company, .institution {
      font-size: 16px;
      color: #333;
      margin-bottom: 3px;
      font-weight: 400;
    }

    .education-level {
      font-size: 14px;
      font-weight: 300;
      color: #666;
    }

    .date-location {
      font-size: 16px;
      color: #000;
      font-style: normal;
      font-weight: 500;
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
      list-style-type: none;
    }

    li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
      font-weight: 300;
    }

    li::before {
      content: "—";
      margin-right: 8px;
      color: #999;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
    }

    .skill-category {
      background: transparent;
      padding: 15px;
      padding-left: 0;
      border-radius: 0;
      border-left: none;
    }

    .skill-category h3 {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 400;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-tag {
      background: transparent;
      padding: 5px 12px;
      padding-left: 0;
      border-radius: 0;
      font-size: 13px;
      color: #000;
      border: none;
      font-weight: 300;
    }

    .skill-tag::after {
      content: " /";
      color: #ccc;
    }

    .skill-tag:last-child::after {
      content: "";
    }

    .projects-intro {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
      font-style: normal;
      font-weight: 300;
    }

    .projects-intro a {
      color: #000;
      font-weight: 400;
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
      font-weight: 300;
    }

    .technologies {
      font-size: 13px;
      color: #666;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0.5px;
    }

    .gdpr-clause {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #000;
      font-size: 10px;
      color: #666;
      line-height: 1.4;
      text-align: justify;
      page-break-inside: avoid;
      page-break-before: auto;
      font-weight: 300;
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

module.exports = { name: 'minimalist', getStyles, monochromatic: true };
