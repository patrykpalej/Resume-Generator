FROM node:18-slim

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    fontconfig \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libxshmfence1 \
    --no-install-recommends \
    && fc-cache -f \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files for both root and web
COPY package*.json ./
COPY web/package*.json ./web/

# Install dependencies
RUN npm install
RUN cd web && npm install

# Copy application files
COPY . .

# Create temp directory for PDF generation
RUN mkdir -p /app/web/temp

# Expose port
EXPOSE 8003

# Start the web server
CMD ["npm", "run", "start:web"]
