const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const DEFAULT_INPUT_PATH = path.join(PROJECT_ROOT, 'data', 'resume-data.json');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'output');

const PHOTO_SEARCH_PATHS = [
  path.join(PROJECT_ROOT, 'assets', 'photo.jpg'),
  path.join(PROJECT_ROOT, 'photo.jpg'),
  path.join(PROJECT_ROOT, 'assets', 'photo-example.jpg'),
  path.join(PROJECT_ROOT, 'photo-example.jpg')
];

module.exports = {
  DEFAULT_INPUT_PATH,
  DEFAULT_OUTPUT_DIR,
  PHOTO_SEARCH_PATHS
};
