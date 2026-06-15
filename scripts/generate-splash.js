const { Jimp } = require('jimp');

const sizes = [
  // iPad Pro 12.9" portrait
  { width: 2048, height: 2732, iconSize: 512, iconYRatio: 0.35 },
  // iPad Pro 11" portrait
  { width: 1668, height: 2388, iconSize: 384, iconYRatio: 0.35 },
  // iPhone 15 Pro Max portrait
  { width: 1290, height: 2796, iconSize: 256, iconYRatio: 0.30 },
  // iPhone standard portrait (14/13 Pro)
  { width: 1170, height: 2532, iconSize: 256, iconYRatio: 0.30 },
  // iPad Pro 12.9" landscape
  { width: 2732, height: 2048, iconSize: 384, iconYRatio: 0.28 },
];

async function createSplash() {
  for (const size of sizes) {
    const { width, height, iconSize, iconYRatio } = size;
    const filename = `public/splash-${width}x${height}.png`;

    const image = new Jimp({ width, height, color: 0x09090bff });
    const icon = await Jimp.read('public/icon-512.png');
    icon.resize({ w: iconSize, h: iconSize });

    const iconX = Math.round((width - iconSize) / 2);
    const iconY = Math.round(height * iconYRatio);
    image.composite(icon, iconX, iconY);

    await image.write(filename);
    console.log(`Created: ${filename}`);
  }
  console.log('All splash screens created!');
}

createSplash().catch(function (err) {
  console.error('Error:', err.message);
  process.exit(1);
});
