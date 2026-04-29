/**
 * Translates en.json to all 39 other languages using OpenRouter AI.
 * Usage:
 *   npx tsx scripts/translate-content.ts        # all languages
 *   npx tsx scripts/translate-content.ts ru      # single language
 *   npx tsx scripts/translate-content.ts ru de   # specific languages
 */
import * as fs from 'fs';
import * as path from 'path';
import { generateCompletion } from '../src/lib/ai/openrouter';
import { LOCALES, ALL_LOCALES, type Locale } from '../src/i18n/config';

const TRANSLATIONS_DIR = path.join(process.cwd(), 'src', 'i18n', 'translations');
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Keys that should NOT be translated (proper nouns, brand names, technical values)
const SKIP_KEYS = new Set([
  'site.name',
  'discussion.msg1.author',
  'discussion.msg2.author',
  'discussion.msg3.author',
  'discussion.msg4.author',
]);

// Keys where only the text part should be translated (keep numbers/brands)
const PARTIAL_KEYS = new Set([
  'footer.copyright',
]);

async function translateBatch(
  keys: Record<string, string>,
  targetLang: string,
  targetNativeName: string,
): Promise<Record<string, string>> {
  const prompt = `Translate the following JSON key-value pairs from English to ${targetNativeName} (${targetLang}).

IMPORTANT RULES:
1. Return ONLY a valid JSON object with the same keys
2. Keep brand names untranslated: "Big Bass Crash", "Pragmatic Play", "1xBet", "Pin-Up Casino", "Stake", "BC.Game", "Mostbet", "Sweet Bonanza", "Big Bass Bonanza"
3. Keep technical terms: "RTP", "96.47%", "$96.47", "$100", "$5", "$20", "1x", "2x", "1.5x-2x", "100x", "1000x", "8.7", "8/10", "8.5/10", "9/10"
4. Translate naturally, not word-for-word. Use the native language fluently
5. Keep the same JSON keys, only translate values
6. For "discussion.msgN.time" keys, translate time expressions naturally (e.g., "2 hours ago")
7. Do NOT wrap the output in code fences

JSON to translate:
${JSON.stringify(keys, null, 2)}`;

  const messages = [
    { role: 'system' as const, content: `You are a professional translator. Translate to ${targetNativeName}. Return ONLY valid JSON.` },
    { role: 'user' as const, content: prompt },
  ];

  const result = await generateCompletion(messages, { temperature: 0.3, maxTokens: 8192 });

  // Parse JSON from response
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse JSON from translation response`);
  }

  return JSON.parse(jsonMatch[0]);
}

async function translateForLanguage(lang: Locale): Promise<void> {
  const locale = LOCALES[lang];
  const langName = locale.name;
  const nativeName = locale.nativeName;

  const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
  const targetPath = path.join(TRANSLATIONS_DIR, `${lang}.json`);

  const enData: Record<string, string> = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  // Load existing translations to preserve manually edited ones
  let existingData: Record<string, string> = {};
  if (fs.existsSync(targetPath)) {
    existingData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  }

  // Find keys that need translation (new or missing keys)
  const keysToTranslate: Record<string, string> = {};
  for (const [key, value] of Object.entries(enData)) {
    if (SKIP_KEYS.has(key)) continue;
    if (!existingData[key] || existingData[key] === value) {
      // Key is missing or still has English text
      keysToTranslate[key] = value;
    }
  }

  if (Object.keys(keysToTranslate).length === 0) {
    console.log(`  [SKIP] ${lang} (${langName}) - all keys already translated`);
    return;
  }

  console.log(`  [TRANSLATE] ${lang} (${langName}) - ${Object.keys(keysToTranslate).length} keys...`);

  // Split into batches of ~30 keys to stay within token limits
  const entries = Object.entries(keysToTranslate);
  const batchSize = 30;
  const translated: Record<string, string> = {};

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = Object.fromEntries(entries.slice(i, i + batchSize));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(entries.length / batchSize);

    console.log(`    Batch ${batchNum}/${totalBatches} (${Object.keys(batch).length} keys)...`);

    try {
      const result = await translateBatch(batch, langName, nativeName);
      Object.assign(translated, result);
    } catch (err) {
      console.error(`    [ERROR] Batch ${batchNum} failed:`, err);
      // Keep English for failed keys
      Object.assign(translated, batch);
    }

    if (i + batchSize < entries.length) {
      await delay(2000);
    }
  }

  // Merge: existing + new translations (preserving skip keys)
  const finalData: Record<string, string> = {};
  for (const key of Object.keys(enData)) {
    if (SKIP_KEYS.has(key)) {
      finalData[key] = enData[key]; // Keep English for brand names
    } else if (translated[key]) {
      finalData[key] = translated[key];
    } else if (existingData[key]) {
      finalData[key] = existingData[key];
    } else {
      finalData[key] = enData[key]; // Fallback to English
    }
  }

  fs.writeFileSync(targetPath, JSON.stringify(finalData, null, 2) + '\n');
  console.log(`  [OK] ${lang}.json saved (${Object.keys(finalData).length} keys)`);
}

async function main() {
  const targetLangs = process.argv.slice(2) as Locale[];

  const langs = targetLangs.length > 0
    ? targetLangs.filter(l => l !== 'en' && l in LOCALES)
    : ALL_LOCALES.filter(l => l !== 'en');

  if (targetLangs.length > 0) {
    const invalid = targetLangs.filter(l => !(l in LOCALES));
    if (invalid.length > 0) {
      console.error(`Invalid locales: ${invalid.join(', ')}`);
      console.error(`Available: ${ALL_LOCALES.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`Translating content to ${langs.length} languages...\n`);

  let completed = 0;
  for (const lang of langs) {
    completed++;
    console.log(`[${completed}/${langs.length}] ${lang}:`);

    try {
      await translateForLanguage(lang);
    } catch (err) {
      console.error(`  [ERROR] ${lang}:`, err);
    }

    if (completed < langs.length) {
      await delay(2000);
    }
  }

  console.log(`\nDone! Translated ${completed} languages.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
