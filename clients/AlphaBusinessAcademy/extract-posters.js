const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function ensureDeps() {
  const deps = ['ffmpeg-static', 'fluent-ffmpeg'];
  const missing = deps.filter(d => { try { require.resolve(d); return false; } catch { return true; } });
  if (missing.length) {
    console.log('Installing:', missing.join(', '));
    execSync(`npm install --no-save ${missing.join(' ')}`, { stdio: 'inherit' });
  }
}
ensureDeps();

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const BASE = __dirname;
const POSTER_DIR = path.join(BASE, 'assets', 'img', 'posters');
fs.mkdirSync(POSTER_DIR, { recursive: true });

const videos = [
  { src: 'assets/videos/Institucional horizontal/0501 (1).mp4', out: 'institucional.jpg' },
  { src: 'assets/videos/depoimentos/Debora.mp4',                out: 'debora.jpg' },
  { src: 'assets/videos/depoimentos/marcio.mp4',               out: 'marcio.jpg' },
  { src: 'assets/videos/depoimentos/vinicius.mp4',             out: 'vinicius.jpg' },
  { src: 'assets/videos/depoimentos/Criativo ABA - Aplicou e aumentou 50% do faturamento.mp4', out: 'criativo-50.jpg' },
  { src: 'assets/videos/depoimentos/Criativo ABA - Depoimento Recorde de Vendas.mp4',          out: 'criativo-record.jpg' },
];

async function extractFrame(srcRel, outFile) {
  const srcAbs = path.join(BASE, srcRel);
  const outAbs = path.join(POSTER_DIR, outFile);

  if (!fs.existsSync(srcAbs)) {
    console.log(`  SKIP  ${srcRel} (not found)`);
    return;
  }

  console.log(`  EXTRACT  ${outFile} ← ${path.basename(srcRel)}`);
  await new Promise((resolve, reject) => {
    ffmpeg(srcAbs)
      .seekInput(0.5)
      .frames(1)
      .output(outAbs)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
  console.log(`  OK  ${outFile}`);
}

(async () => {
  for (const v of videos) {
    await extractFrame(v.src, v.out);
  }
  console.log('\nAll posters extracted → assets/img/posters/');
})();
