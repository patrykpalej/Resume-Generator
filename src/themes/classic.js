function getStyles() {
  // Classic theme ignores color parameter and always uses black/gray
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* User content isolation - prevents injected HTML/CSS from breaking layout */
    .user-content-isolated {
      /* Force inline display to prevent layout disruption */
      display: inline !important;
      /* Prevent layout-breaking properties */
      float: none !important;
      clear: none !important;
      /* Prevent positioning from breaking flow */
      position: static !important;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      z-index: auto !important;
      /* Prevent transforms from breaking layout */
      transform: none !important;
      /* Prevent overflow issues */
      overflow: visible !important;
      /* Maintain inline behavior - no box model changes */
      width: auto !important;
      height: auto !important;
      max-width: none !important;
      max-height: none !important;
      min-width: 0 !important;
      min-height: 0 !important;
      /* Prevent margin/padding from breaking layout */
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      /* Prevent flex/grid from breaking parent layout */
      flex: none !important;
      flex-grow: 0 !important;
      flex-shrink: 1 !important;
      flex-basis: auto !important;
      grid-column: auto !important;
      grid-row: auto !important;
      align-self: auto !important;
      justify-self: auto !important;
      /* Allow user content to inherit text styles from parent */
      font-family: inherit !important;
      font-size: inherit !important;
      color: inherit !important;
      line-height: inherit !important;
      font-weight: inherit !important;
      text-align: inherit !important;
      vertical-align: baseline !important;
    }

    /* Ensure all child elements inside isolated content also stay inline */
    .user-content-isolated * {
      display: inline !important;
      position: static !important;
      float: none !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
      width: auto !important;
      height: auto !important;
      max-width: none !important;
      max-height: none !important;
      flex: none !important;
      grid-column: auto !important;
      grid-row: auto !important;
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
      font-size: 14px;
      color: #333;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .contact-item i {
      width: 16px;
      flex-shrink: 0;
      color: #1a1a1a;
    }

    .contact-item a {
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .contact-item a {
      color: #333;
    }

    .profile-photo {
      width: 180px !important;
      height: 180px !important;
      max-width: 180px !important;
      max-height: 180px !important;
      min-width: 180px !important;
      min-height: 180px !important;
      aspect-ratio: 1 !important;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #1a1a1a;
      box-shadow: none;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
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
      color: #4a4a4a;
      margin-bottom: 0;
      font-weight: 400;
      font-style: italic;
    }

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      margin-top: 0;
      margin-bottom: 0;
      font-style: italic;
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

    .experience-item, .education-item, .project-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
      padding-left: 15px;
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
      padding: 4px 12px;
    }

    ul {
      margin-left: 20px;
      margin-top: 8px;
    }

    li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }

    .skills-grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 15px;
    }

    .skill-category {
      background: #fafafa;
      padding: 15px;
      border-radius: 0;
      border-left: 3px solid #1a1a1a;
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      min-width: 0;
      box-sizing: border-box;
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
      line-height: 1.6;
    }

    .technologies {
      font-size: 13px;
      color: #1a1a1a;
      font-style: italic;
    }

    .gdpr-watermark-wrapper {
      margin-top: auto;
      margin-bottom: 0;
      padding-bottom: 0;
      page-break-inside: avoid;
      page-break-before: auto;
    }

    .gdpr-clause {
      padding-top: 20px;
      border-top: 1px solid #1a1a1a;
      font-size: 10px;
      color: #4a4a4a;
      line-height: 1.4;
      text-align: justify;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .watermark {
      margin-top: 0px;
      margin-bottom: 0;
      padding-top: 3px;
      padding-bottom: 0;
      font-size: 10px;
      color: #666;
      text-align: center;
      font-style: italic;
      font-weight: 400;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      letter-spacing: 0.2px;
      line-height: 1.2;
    }

    .watermark a {
      color: inherit;
      text-decoration: none;
    }

    .watermark a:hover {
      text-decoration: underline;
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
        width: 180px !important;
        height: 180px !important;
        max-width: 180px !important;
        max-height: 180px !important;
        min-width: 180px !important;
        min-height: 180px !important;
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

      .gdpr-watermark-wrapper {
        margin-top: auto;
        page-break-inside: avoid;
        page-break-before: auto;
      }
    }
  `;
}

module.exports = { name: 'classic', getStyles, monochromatic: true };
