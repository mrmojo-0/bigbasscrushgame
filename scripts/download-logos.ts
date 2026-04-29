import { db } from '../src/lib/db';
import { casinos } from '../src/lib/db/schema';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'images', 'casinos');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function fetchUrl(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function searchBingImage(query: string): Promise<string | null> {
  const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-medium&first=1`;

  try {
    const html = (await fetchUrl(searchUrl)).toString('utf-8');

    // Extract image URLs from Bing results - look for murl parameter
    const murlMatch = html.match(/murl&quot;:&quot;(https?:\/\/[^&]+?\.(png|jpg|jpeg|webp|svg))/i);
    if (murlMatch) {
      return murlMatch[1];
    }

    // Fallback: look for src2 or src attributes in image results
    const imgMatch = html.match(/src2="(https?:\/\/[^"]+)"/i) || html.match(/src="(https?:\/\/tse\d\.mm\.bing\.net[^"]+)"/i);
    if (imgMatch) {
      return imgMatch[1];
    }

    return null;
  } catch (err) {
    console.error(`  Search failed: ${err}`);
    return null;
  }
}

async function downloadLogo(casino: { name: string; slug: string }): Promise<string | null> {
  const fileName = `${casino.slug}.png`;
  const filePath = path.join(LOGOS_DIR, fileName);

  // Skip if already exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`  [SKIP] ${casino.name} - logo already exists`);
    return `/images/casinos/${fileName}`;
  }

  console.log(`  [SEARCH] Searching for "${casino.name} casino logo png"...`);

  const imageUrl = await searchBingImage(`${casino.name} casino logo png transparent`);
  if (!imageUrl) {
    console.log(`  [WARN] No image found for ${casino.name}`);
    return null;
  }

  console.log(`  [DOWNLOAD] ${imageUrl.substring(0, 80)}...`);

  try {
    const imageData = await fetchUrl(imageUrl);
    fs.writeFileSync(filePath, imageData);
    console.log(`  [OK] Saved ${fileName} (${(imageData.length / 1024).toFixed(1)} KB)`);
    return `/images/casinos/${fileName}`;
  } catch (err) {
    console.error(`  [ERROR] Download failed for ${casino.name}: ${err}`);
    return null;
  }
}

async function main() {
  ensureDir(LOGOS_DIR);

  const allCasinos = db.select().from(casinos).all();
  console.log(`Downloading logos for ${allCasinos.length} casinos...\n`);

  for (const casino of allCasinos) {
    console.log(`[${casino.name}]`);
    const logoPath = await downloadLogo({ name: casino.name, slug: casino.slug });

    if (logoPath && logoPath !== casino.logoPath) {
      // Update DB with correct path
      const { eq } = await import('drizzle-orm');
      db.update(casinos).set({ logoPath }).where(eq(casinos.id, casino.id)).run();
      console.log(`  [DB] Updated logoPath to ${logoPath}`);
    }

    // Small delay between searches
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
