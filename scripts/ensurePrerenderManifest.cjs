const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function randomHex(bytes) {
  return crypto.randomBytes(bytes).toString('hex');
}

function main() {
  const distDir = path.join(process.cwd(), '.next');
  const manifestPath = path.join(distDir, 'prerender-manifest.json');

  if (fs.existsSync(manifestPath)) {
    return;
  }

  fs.mkdirSync(distDir, { recursive: true });

  const manifest = {
    version: 4,
    routes: {},
    dynamicRoutes: {},
    notFoundRoutes: [],
    preview: {
      // Next generates these at build time; preview mode isn't used by this app,
      // but Next's server code expects the keys to exist.
      previewModeId: randomHex(16),
      previewModeSigningKey: randomHex(32),
      previewModeEncryptionKey: randomHex(32),
    },
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Created missing ${path.relative(process.cwd(), manifestPath)}`);
}

main();
