const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const mode = process.argv[2] || 'antes';
const outputDir = path.resolve('C:\\Users\\Windows\\.gemini\\antigravity-ide\\brain\\a5ac8da7-1981-4628-8679-4054ac29cec9\\capturas', mode);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const targets = [
  { name: 'inicio', url: 'http://localhost:3000' },
  { name: 'catalogo', url: 'http://localhost:3000/catalogo' },
  { name: 'ficha_galeria', url: 'http://localhost:3000/catalogo/cmuzw4zkk000t13fxq1brxcnk' },
  { name: 'princesas_variantes', url: 'http://localhost:3000/catalogo/cmuzw4zkk000t13fxq1brxcnk' },
  { name: 'babyshower_dinamicas', url: 'http://localhost:3000/catalogo/cmuzw4zjd000c13fxp53xhv7c' },
  { name: 'consulta_fecha', url: 'http://localhost:3000/disponibilidad' },
  { name: 'contacto', url: 'http://localhost:3000/contacto' }
];

const viewports = [
  { suffix: 'desktop', width: 1280, height: 800 },
  { suffix: 'mobile', width: 390, height: 844 }
];

for (const target of targets) {
  for (const vp of viewports) {
    const filename = `${target.name}_${vp.suffix}.png`;
    const dest = path.join(outputDir, filename);
    const cmd = `"${chromePath}" --headless=new --screenshot="${dest}" --window-size=${vp.width},${vp.height} --virtual-time-budget=2000 --hide-scrollbars --no-sandbox --disable-gpu "${target.url}"`;
    try {
      console.log(`Capturing ${filename}...`);
      execSync(cmd, { stdio: 'ignore' });
      console.log(`✓ Saved ${dest}`);
    } catch (e) {
      console.error(`✗ Error capturing ${filename}:`, e.message);
    }
  }
}
console.log('Capturas completadas para modo:', mode);
