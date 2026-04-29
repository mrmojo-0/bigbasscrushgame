import { fetchAllImages } from '../src/lib/images/bing-proxy';

async function main() {
  console.log('🖼️  Fetching images from Bing...');
  console.log('');

  const saved = await fetchAllImages();

  console.log('');
  console.log(`✅ Done! ${saved.length} images saved to public/images/game/`);
  console.log('Paths:', saved);
}

main().catch(console.error);
