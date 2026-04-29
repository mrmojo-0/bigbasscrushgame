import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const SOURCE_DIR = 'images';
const OUTPUT_DIR = 'public/images/game';

// Mapping: source filename → { output basename, category }
const FILE_MAP = {
  'BigBassCrash-logo.png': { name: 'logo', category: 'logo' },
  'bigbass-beautiful-gameplay.jpg': { name: 'beautiful-gameplay-1', category: 'hero' },
  'bigbass-beutiful-gameplay2.jpg': { name: 'beautiful-gameplay-2', category: 'hero' },
  'bigbass-beautiful-gameplay3.jpg': { name: 'beautiful-gameplay-3', category: 'hero' },
  'bigbass-gameplay1.png': { name: 'gameplay-1', category: 'inline' },
  'bigbass-gameplay2.png': { name: 'gameplay-2', category: 'inline' },
  'bigbass-gameplay3.png': { name: 'gameplay-3', category: 'inline' },
  'bigbass-gameplay4.png': { name: 'gameplay-4', category: 'inline' },
  'bigbass-gameplay5.png': { name: 'gameplay-5', category: 'inline' },
};

// Add theme images 1-20
for (let i = 1; i <= 20; i++) {
  FILE_MAP[`bigbass${i}.jpeg`] = { name: `theme-${i}`, category: 'inline' };
}

const SIZE_CONFIG = {
  logo: { width: 200, quality: 90 },
  hero: { width: 1200, quality: 85 },
  inline: { width: 800, quality: 80 },
};

async function processImage(sourceFile, outputName, category) {
  const sourcePath = join(SOURCE_DIR, sourceFile);
  const config = SIZE_CONFIG[category];
  const ext = extname(sourceFile).toLowerCase();
  // Determine output format extension (keep original type)
  const outExt = ext === '.png' ? '.png' : '.jpg';

  const outputBase = join(OUTPUT_DIR, outputName);
  const outputOriginal = outputBase + outExt;
  const outputWebp = outputBase + '.webp';

  const sourceStats = await stat(sourcePath);
  const sourceSize = sourceStats.size;

  // Process original format (resized + optimized)
  const pipeline = sharp(sourcePath).resize({ width: config.width, withoutEnlargement: true });

  if (outExt === '.png') {
    await pipeline.clone().png({ quality: config.quality, compressionLevel: 9 }).toFile(outputOriginal);
  } else {
    await pipeline.clone().jpeg({ quality: config.quality, mozjpeg: true }).toFile(outputOriginal);
  }

  // Generate WebP version
  await pipeline.clone().webp({ quality: config.quality }).toFile(outputWebp);

  const origStats = await stat(outputOriginal);
  const webpStats = await stat(outputWebp);

  return {
    source: sourceFile,
    output: outputName,
    sourceSize,
    originalSize: origStats.size,
    webpSize: webpStats.size,
  };
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

async function main() {
  console.log('🎣 Big Bass Crash — Image Optimization\n');

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Verify source directory
  const sourceFiles = await readdir(SOURCE_DIR);
  console.log(`Found ${sourceFiles.length} source files in ${SOURCE_DIR}/\n`);

  const results = [];
  let totalSourceSize = 0;
  let totalOriginalSize = 0;
  let totalWebpSize = 0;

  for (const [sourceFile, config] of Object.entries(FILE_MAP)) {
    if (!sourceFiles.includes(sourceFile)) {
      console.warn(`  ⚠ Missing: ${sourceFile}`);
      continue;
    }

    try {
      const result = await processImage(sourceFile, config.name, config.category);
      results.push(result);
      totalSourceSize += result.sourceSize;
      totalOriginalSize += result.originalSize;
      totalWebpSize += result.webpSize;

      const savings = ((1 - result.webpSize / result.sourceSize) * 100).toFixed(1);
      console.log(`  ✓ ${sourceFile} → ${config.name} (${formatSize(result.sourceSize)} → ${formatSize(result.webpSize)} WebP, ${savings}% saved)`);
    } catch (err) {
      console.error(`  ✗ ${sourceFile}: ${err.message}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  Files processed: ${results.length}`);
  console.log(`  Source total:    ${formatSize(totalSourceSize)}`);
  console.log(`  Optimized total: ${formatSize(totalOriginalSize)}`);
  console.log(`  WebP total:      ${formatSize(totalWebpSize)}`);
  console.log(`  Total savings:   ${((1 - totalWebpSize / totalSourceSize) * 100).toFixed(1)}%`);
  console.log(`\n✅ Done! Output in ${OUTPUT_DIR}/`);
}

main().catch(console.error);
