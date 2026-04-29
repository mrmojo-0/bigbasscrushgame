import fs from 'fs';
import path from 'path';

const IMAGE_TAILS = [
  'game', 'casino', 'free', 'play', 'gameplay', 'slot', 'bonus',
  'win', 'jackpot', 'strategy', 'tips', 'multiplier', 'crash',
  'fishing', 'pragmatic-play', 'rtp', 'volatility', 'features',
  'mobile', 'demo', 'screenshot', 'review', 'big-win', 'max-win', 'online',
];

const IMAGE_DIR = path.resolve(process.cwd(), 'public/images/game');

function buildBingUrl(tail: string, width = 1920, height = 1080): string {
  return `https://ts2.mm.bing.net/th?q=big-bass-crash-${tail}&w=${width}&h=${height}&c=7&rs=1`;
}

export async function fetchImage(tail: string): Promise<string | null> {
  const url = buildBingUrl(tail);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image for tail "${tail}": ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Ensure directory exists
    if (!fs.existsSync(IMAGE_DIR)) {
      fs.mkdirSync(IMAGE_DIR, { recursive: true });
    }

    const filename = `big-bass-crash-${tail}.jpg`;
    const filepath = path.join(IMAGE_DIR, filename);

    fs.writeFileSync(filepath, buffer);
    console.log(`Saved: ${filename} (${buffer.length} bytes)`);

    return `/images/game/${filename}`;
  } catch (err) {
    console.error(`Error fetching image for tail "${tail}":`, err);
    return null;
  }
}

export async function fetchAllImages(): Promise<string[]> {
  const saved: string[] = [];

  for (const tail of IMAGE_TAILS) {
    const localPath = await fetchImage(tail);
    if (localPath) {
      saved.push(localPath);
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  return saved;
}

export function getImageTails(): string[] {
  return IMAGE_TAILS;
}

export function getLocalImagePath(tail: string): string {
  return `/images/game/big-bass-crash-${tail}.jpg`;
}

export function imageExists(tail: string): boolean {
  const filepath = path.join(IMAGE_DIR, `big-bass-crash-${tail}.jpg`);
  return fs.existsSync(filepath);
}
