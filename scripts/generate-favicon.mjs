import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const LOGO_PATH = 'images/BigBassCrash-logo.png';
const PUBLIC_DIR = 'public';

async function generateFavicons() {
  console.log('🎨 Generating favicons from logo...\n');

  const logo = sharp(LOGO_PATH);

  // favicon-32x32.png
  await logo.clone().resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(`${PUBLIC_DIR}/favicon-32x32.png`);
  console.log('  ✓ favicon-32x32.png');

  // favicon-16x16.png
  await logo.clone().resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(`${PUBLIC_DIR}/favicon-16x16.png`);
  console.log('  ✓ favicon-16x16.png');

  // apple-touch-icon.png (180x180)
  await logo.clone().resize(180, 180, { fit: 'contain', background: { r: 10, g: 22, b: 40, alpha: 1 } })
    .png().toFile(`${PUBLIC_DIR}/apple-touch-icon.png`);
  console.log('  ✓ apple-touch-icon.png (180x180)');

  // favicon.ico — use 32x32 PNG wrapped as ICO
  // ICO format: header + image directory + PNG data
  const png32 = await logo.clone().resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer();

  const ico = createIco(png32, 32, 32);
  await writeFile(`${PUBLIC_DIR}/favicon.ico`, ico);
  console.log('  ✓ favicon.ico (32x32)');

  console.log('\n✅ Favicons generated!');
}

function createIco(pngBuffer, width, height) {
  // ICO file format:
  // Header: 6 bytes
  // Image directory entry: 16 bytes per image
  // Image data: PNG bytes

  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize;

  const buffer = Buffer.alloc(dataOffset + pngBuffer.length);

  // ICO Header
  buffer.writeUInt16LE(0, 0);       // Reserved
  buffer.writeUInt16LE(1, 2);       // Type: 1 = ICO
  buffer.writeUInt16LE(1, 4);       // Number of images

  // Directory entry
  buffer.writeUInt8(width >= 256 ? 0 : width, 6);   // Width (0 = 256)
  buffer.writeUInt8(height >= 256 ? 0 : height, 7);  // Height (0 = 256)
  buffer.writeUInt8(0, 8);          // Color palette
  buffer.writeUInt8(0, 9);          // Reserved
  buffer.writeUInt16LE(1, 10);      // Color planes
  buffer.writeUInt16LE(32, 12);     // Bits per pixel
  buffer.writeUInt32LE(pngBuffer.length, 14);  // Image size
  buffer.writeUInt32LE(dataOffset, 18);        // Data offset

  // PNG data
  pngBuffer.copy(buffer, dataOffset);

  return buffer;
}

generateFavicons().catch(console.error);
