# Resume Generator Web Demo

A single-page web application for creating and customizing professional resumes using the Resume Generator.

## Features

- **Interactive JSON Editor**: Edit resume data directly in the browser with validation
- **Theme Selection**: Choose from multiple professional themes (modern, classic, minimalist, etc.)
- **Color Customization**: Select color schemes for supported themes
- **Photo Upload**: Add a professional photo to your resume
- **Live Preview**: See changes in real-time before exporting
- **PDF Export**: Download your resume as a PDF file
- **Pre-loaded Example**: Start with example data and customize it

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

1. Build and start the container:
```bash
docker-compose up --build
```

2. Access the application at:
```
http://localhost:8003
```

3. To stop the application:
```bash
docker-compose down
```

## Running Locally (without Docker)

### Prerequisites
- Node.js 18+ installed

### Setup

1. Install dependencies:
```bash
# Install root dependencies
npm install

# Install web dependencies
cd web
npm install
cd ..
```

> Emoji rendering: If emojis show up as empty squares on Linux, install a color emoji font (e.g., `fonts-noto-color-emoji` on Debian/Ubuntu). The provided Docker image installs this automatically.

2. Start the server:
```bash
npm run start:web
```

3. Access the application at:
```
http://localhost:8003
```

## How to Use

1. **Load Data**:
   - Click "Load Example" to start with sample data
   - Or upload your own JSON file using "Upload JSON"
   - Or manually edit the JSON in the editor

2. **Add Photo (Optional)**:
   - Click "Upload Photo" to add a profile picture
   - Supports JPG and PNG formats

3. **Choose Appearance**:
   - Select a theme from the dropdown
   - If the theme supports colors, select a color scheme

4. **Generate Preview**:
   - Click "Generate Preview" to see your resume
   - The preview appears in the main area

5. **Export**:
   - Click "Export to PDF" to download your resume

## JSON Data Format

Your resume data should follow this structure:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "email@example.com",
    "phone": "+1 234-567-8900",
    "website": "yourwebsite.com",
    "linkedin": "linkedin.com/in/yourprofile",
    "github": "github.com/yourprofile"
  },
  "summary": "Your professional summary...",
  "skills": {
    "Category 1": ["Skill 1", "Skill 2"],
    "Category 2": ["Skill 3", "Skill 4"]
  },
  "experience": [
    {
      "position": "Job Title",
      "company": "Company Name",
      "startDate": "2022-01",
      "endDate": null,
      "responsibilities": [
        "Responsibility 1",
        "Responsibility 2"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "level": "Bachelor/Master",
      "institution": "University Name",
      "graduationDate": "2020-06"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description...",
      "technologies": ["Tech 1", "Tech 2"],
      "link": "https://project-url.com"
    }
  ],
  "gdprClause": "Optional GDPR compliance text..."
}
```

## Available Themes

- **modern**: Contemporary design with gradient accents
- **default**: Clean and professional
- **corpo**: Corporate style
- **linux**: Terminal-inspired monospace design
- **classic**: Traditional monochromatic layout
- **minimalist**: Simple and clean monochromatic design

Note: `classic` and `minimalist` themes are monochromatic and don't support color variations.

## Available Colors

- blue
- green
- red
- violet
- orange
- pink
- yellow
- grey

## API Endpoints

The web server exposes the following API endpoints:

- `GET /api/themes` - Get list of available themes
- `GET /api/colors` - Get list of available colors
- `GET /api/example-data` - Get example resume data
- `POST /api/generate` - Generate HTML preview
- `POST /api/export-pdf` - Export resume as PDF

## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **PDF Generation**: Puppeteer
- **Containerization**: Docker, Docker Compose

## Port Configuration

The application runs on port 8003 by default. To change the port, modify:
- `docker-compose.yml`: Update the port mapping
- `web/server.js`: Update the PORT constant

## Development

To run in development mode with auto-reload:

```bash
cd web
npm run dev
```

This uses nodemon to automatically restart the server when files change.
