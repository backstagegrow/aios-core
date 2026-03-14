'use strict';

/**
 * design-post-commands — CLI standalone para o pipeline de Design Post
 *
 * L4 — sempre modificável
 *
 * Usage:
 *   node design-post-commands.js generate --brand "GT House" --headline "Sua imersão." --format instagram-square
 *   node design-post-commands.js generate --config briefing.json
 *   node design-post-commands.js list-formats
 *   node design-post-commands.js list-brands
 */

const path = require('path');
const fs   = require('fs');

const FORMATS = [
  'instagram-square',
  'instagram-story',
  'facebook-post',
  'linkedin-post',
  'banner',
];

const CLIENTS_DIR = path.join(__dirname, '../brand-engine/clients');

function listBrands() {
  if (!fs.existsSync(CLIENTS_DIR)) return [];
  return fs.readdirSync(CLIENTS_DIR).filter(d => {
    const cfg = path.join(CLIENTS_DIR, d, 'client.config.json');
    return fs.existsSync(cfg);
  });
}

function loadBrandConfig(brandSlug) {
  const cfg = path.join(CLIENTS_DIR, brandSlug, 'client.config.json');
  if (!fs.existsSync(cfg)) throw new Error(`Brand config not found: ${brandSlug}`);
  return JSON.parse(fs.readFileSync(cfg, 'utf-8'));
}

async function cmdGenerate(options) {
  // Dynamic import for TS pipeline via tsx
  let generateDesignPost;
  try {
    const mod = await import('../brand-engine/design-post/index.ts');
    generateDesignPost = mod.generateDesignPost;
  } catch (e) {
    try {
      const mod = await import('../brand-engine/design-post/index.js');
      generateDesignPost = mod.generateDesignPost;
    } catch (e2) {
      throw new Error('Could not load design-post pipeline. Run with tsx or ts-node: ' + e2.message);
    }
  }

  let briefing;

  if (options.config) {
    const absPath = path.isAbsolute(options.config) ? options.config : path.join(process.cwd(), options.config);
    briefing = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
  } else {
    // Load brand colors from client config if brand slug is provided
    let brandColors = ['#000000', '#ffffff'];
    let brandAssets = {};

    if (options.brand && listBrands().includes(options.brand.toLowerCase().replace(/\s+/g, '-'))) {
      try {
        const slug = options.brand.toLowerCase().replace(/\s+/g, '-');
        const cfg = loadBrandConfig(slug);
        const c = cfg.brand?.colors || {};
        brandColors = [c.brandPrimary || '#000000', c.brandSecondary || '#ffffff', c.brandAccent || '#888888'].filter(Boolean);
      } catch (e) {
        // Use defaults
      }
    }

    briefing = {
      brand_name: options.brand || 'Brand',
      headline: options.headline || 'Headline here',
      subheadline: options.subheadline || '',
      cta: options.cta || '',
      format: options.format || 'instagram-square',
      brand_colors: brandColors,
      brand_assets: brandAssets,
    };
  }

  console.log('\n[design-post] Starting pipeline...');
  console.log('  Brand:', briefing.brand_name);
  console.log('  Format:', briefing.format);
  console.log('  Headline:', briefing.headline);

  const result = await generateDesignPost(briefing);

  // Save result
  const outDir = path.join(__dirname, '../../.aios/design-post-output');
  fs.mkdirSync(outDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outFile = path.join(outDir, `post-${timestamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

  console.log('\n[design-post] Done!');
  console.log('  Output saved to:', outFile);
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  function flag(name) {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : undefined;
  }

  switch (command) {
    case 'generate':
      await cmdGenerate({
        brand: flag('brand'),
        headline: flag('headline'),
        subheadline: flag('subheadline'),
        cta: flag('cta'),
        format: flag('format'),
        config: flag('config'),
      });
      break;

    case 'list-formats':
      console.log('\nAvailable formats:');
      FORMATS.forEach(f => console.log('  -', f));
      break;

    case 'list-brands': {
      const brands = listBrands();
      console.log('\nAvailable brands:');
      brands.forEach(b => console.log('  -', b));
      break;
    }

    default:
      console.log('Usage:');
      console.log('  node design-post-commands.js generate --brand "GT House" --headline "Txt" --format instagram-square');
      console.log('  node design-post-commands.js generate --config briefing.json');
      console.log('  node design-post-commands.js list-formats');
      console.log('  node design-post-commands.js list-brands');
  }
}

main().catch(e => { console.error('[design-post-commands] Fatal:', e.message); process.exit(1); });

module.exports = { cmdGenerate };
