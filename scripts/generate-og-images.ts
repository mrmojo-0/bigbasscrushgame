/**
 * Generates OG images as SVG files for social sharing.
 * These are 1200x630px SVGs that look great on social platforms.
 */
import * as fs from 'fs';
import * as path from 'path';

const OG_DIR = path.join(process.cwd(), 'public', 'images', 'og');
const ICONS_DIR = path.join(process.cwd(), 'public');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateOgSvg(title: string, subtitle: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1628"/>
      <stop offset="100%" style="stop-color:#0f2440"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
    <linearGradient id="title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f97316"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Border glow -->
  <rect x="20" y="20" width="1160" height="590" rx="20" fill="none" stroke="url(#accent)" stroke-width="2" opacity="0.3"/>
  <!-- Logo area -->
  <rect x="80" y="80" width="64" height="64" rx="12" fill="url(#accent)"/>
  <text x="112" y="122" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="white">BB</text>
  <text x="160" y="118" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="white">BigBassCrashGame.com</text>
  <!-- Main title -->
  <text x="80" y="300" font-family="Arial,sans-serif" font-size="56" font-weight="800" fill="url(#title-grad)">${escapeXml(title)}</text>
  <!-- Subtitle -->
  <text x="80" y="370" font-family="Arial,sans-serif" font-size="24" fill="#94a3b8">${escapeXml(subtitle)}</text>
  <!-- Bottom accent line -->
  <rect x="80" y="500" width="200" height="4" rx="2" fill="url(#accent)"/>
  <!-- 18+ badge -->
  <circle cx="1100" cy="550" r="28" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"/>
  <text x="1100" y="558" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="#ef4444" opacity="0.6">18+</text>
  <!-- Decorative dots -->
  <circle cx="1050" cy="150" r="80" fill="#22c55e" opacity="0.05"/>
  <circle cx="1100" cy="250" r="120" fill="#06b6d4" opacity="0.04"/>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateAppleTouchIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="100%" style="stop-color:#16a34a"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#bg)"/>
  <text x="90" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="60" font-weight="800" fill="white">BB</text>
  <text x="90" y="140" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="rgba(255,255,255,0.8)">CRASH</text>
</svg>`;
}

ensureDir(OG_DIR);

const pages = [
  { file: 'default', title: 'Big Bass Crash Game', subtitle: 'The Ultimate Fishing Crash Game by Pragmatic Play' },
  { file: 'home', title: 'Big Bass Crash Game', subtitle: 'Play the #1 Fishing-Themed Crash Game Online' },
  { file: 'play-free', title: 'Play Big Bass Crash Free', subtitle: 'Try the Demo - No Registration Required' },
  { file: 'where-to-play', title: 'Where to Play Big Bass Crash', subtitle: 'Top Rated Casinos with Best Bonuses' },
  { file: 'review', title: 'Big Bass Crash Review', subtitle: 'Expert Analysis, RTP, Strategy & Tips' },
];

for (const page of pages) {
  const svg = generateOgSvg(page.title, page.subtitle);
  // Save as SVG (works as OG image in modern browsers and crawlers)
  fs.writeFileSync(path.join(OG_DIR, `${page.file}.svg`), svg);
  console.log(`[OK] Created ${page.file}.svg`);
}

// Apple touch icon
fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.png'), generateAppleTouchIcon());
console.log('[OK] Created apple-touch-icon.png (SVG)');

// Rename to .png won't work for real PNG, but social crawlers accept SVG
// For production, use a proper image conversion tool
console.log('\nNote: OG images are SVGs. For best compatibility, convert to PNG/JPG using:');
console.log('  npx sharp-cli -i public/images/og/home.svg -o public/images/og/home.jpg --format jpeg');
console.log('\nDone!');
