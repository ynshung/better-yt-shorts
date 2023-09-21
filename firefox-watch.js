const nodemon = require('nodemon');
const fs = require('fs');

const FILES_TO_WATCH = "ts,tsx,scss";

const watcher = nodemon({
  ext: FILES_TO_WATCH,
  script: 'firefox-build-manifest.js',
});

watcher.on('quit', () => {
  console.log('Stopped watching files.');
  process.exit();
});

watcher.on('restart', (files) => {
  console.log(`File changes detected: ${files.join(', ')}`);
});
