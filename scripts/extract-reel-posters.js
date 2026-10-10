const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const reelsDir = path.resolve('public/reels');
const postersDir = path.resolve('public/reels/posters');

if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

const reels = fs.readdirSync(reelsDir).filter(f => f.endsWith('.mp4'));

for (const r of reels) {
  const base = path.basename(r, '.mp4');
  const input = path.join(reelsDir, r);
  const output = path.join(postersDir, `${base}-poster.jpg`);
  
  // Extract frame at 1.5s
  const cmd = `"${ffmpeg}" -y -ss 00:00:01.5 -i "${input}" -vframes 1 -q:v 2 "${output}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log(`Generated poster for ${r} -> ${base}-poster.jpg`);
  } catch (err) {
    // Retry at 0.5s if 1.5s fails (e.g. very short video)
    try {
      execSync(`"${ffmpeg}" -y -ss 00:00:00.5 -i "${input}" -vframes 1 -q:v 2 "${output}"`, { stdio: 'ignore' });
      console.log(`Generated poster for ${r} (fallback 0.5s)`);
    } catch (e2) {
      console.error(`Failed poster for ${r}:`, e2.message);
    }
  }
}
console.log('Posters extraction complete.');
