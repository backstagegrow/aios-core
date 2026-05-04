const { execSync, spawnSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// Install deps if needed
function ensureDeps() {
  const deps = ['ffmpeg-static', 'fluent-ffmpeg'];
  const missing = deps.filter(d => { try { require.resolve(d); return false; } catch { return true; } });
  if (missing.length) {
    console.log('Installing:', missing.join(', '));
    execSync(`npm install --no-save ${missing.join(' ')}`, { stdio: 'inherit' });
  }
}
ensureDeps();

const ffmpeg      = require('fluent-ffmpeg');
const ffmpegPath  = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const VIDEOS_DIR = path.join(__dirname, 'assets', 'videos');
const MAX_MB     = 20;

function getMB(file) {
  return fs.statSync(file).size / 1024 / 1024;
}

function findMp4s(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findMp4s(full));
    else if (/\.mp4$/i.test(entry.name)) results.push(full);
  }
  return results;
}

async function compress(input) {
  const mb = getMB(input);
  if (mb <= MAX_MB) {
    console.log(`  OK  ${path.basename(input)} (${mb.toFixed(1)} MB)`);
    return;
  }

  const tmp = input.replace(/\.mp4$/i, '.tmp.mp4');
  console.log(`  COMPRESS  ${path.basename(input)} (${mb.toFixed(1)} MB → alvo <${MAX_MB} MB)`);

  await new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        '-c:v libx264',
        '-crf 28',
        '-preset fast',
        '-vf scale=1280:-2',
        '-c:a aac',
        '-b:a 96k',
        '-movflags +faststart',
      ])
      .output(tmp)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  const newMb = getMB(tmp);
  fs.renameSync(tmp, input);
  console.log(`  DONE  ${path.basename(input)} → ${newMb.toFixed(1)} MB`);
}

(async () => {
  const files = findMp4s(VIDEOS_DIR);
  console.log(`Found ${files.length} videos in assets/videos/\n`);
  for (const f of files) await compress(f);
  console.log('\nAll done!');
})();
