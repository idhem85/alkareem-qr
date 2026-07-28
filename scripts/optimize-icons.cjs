/**
 * Optimize PWA icons using sharp.
 * Compresses icon-192.png and icon-512.png to reasonable sizes.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const icons = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function optimize() {
  for (const icon of icons) {
    const inputPath = path.join(PUBLIC_DIR, icon.name);
    const originalSize = fs.statSync(inputPath).size;

    const tempPath = path.join(PUBLIC_DIR, `${icon.name}.tmp`);

    await sharp(inputPath)
      .resize(icon.size, icon.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toFile(tempPath);

    // Replace original with optimized version
    fs.renameSync(tempPath, inputPath);

    const newSize = fs.statSync(inputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(
      `✓ ${icon.name}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% savings)`
    );
  }

  // Also compress the favicon PNG
  const faviconPath = path.join(PUBLIC_DIR, "favicon.png");
  if (fs.existsSync(faviconPath)) {
    const originalSize = fs.statSync(faviconPath).size;
    const tempPath = `${faviconPath}.tmp`;
    await sharp(faviconPath)
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toFile(tempPath);
    fs.renameSync(tempPath, faviconPath);
    const newSize = fs.statSync(faviconPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(
      `✓ favicon.png: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% savings)`
    );
  }

  console.log("\n✅ All icons optimized!");
}

optimize().catch(console.error);
