import { db } from '../src/lib/db';
import { experts } from '../src/lib/db/schema';
import { generateCompletion } from '../src/lib/ai/openrouter';
import { LOCALES, ALL_LOCALES, type Locale } from '../src/i18n/config';
import { eq } from 'drizzle-orm';

interface ExpertProfile {
  name: string;
  title: string;
  bio: string;
  credentials: string[];
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generateExpertForLang(lang: Locale): Promise<void> {
  const locale = LOCALES[lang];
  const langName = locale.name;
  const nativeName = locale.nativeName;

  // Check if expert already exists for this language
  const existing = db.select().from(experts).where(eq(experts.lang, lang)).get();
  if (existing) {
    console.log(`  [SKIP] Expert already exists for ${lang} (${langName})`);
    return;
  }

  console.log(`  [GEN] Generating expert for ${lang} (${langName})...`);

  const prompt = `Generate a fictional expert profile for an iGaming and online casino analyst.
The expert should be culturally appropriate for ${langName}-speaking audiences.

Return ONLY a valid JSON object (no markdown, no code fences) with these fields:
- "name": A culturally appropriate full name for a ${langName}-speaking expert
- "title": A professional title in ${nativeName} (${langName}) language, similar to "Senior Casino Analyst & Crash Game Specialist"
- "bio": 3-4 sentences in ${nativeName} (${langName}) language about their expertise in iGaming, online casinos, and specifically crash games like Big Bass Crash by Pragmatic Play. Mention years of experience, publications, or certifications.
- "credentials": An array of exactly 5 credential strings in ${nativeName} (${langName}) language, similar to ["12+ years in iGaming industry", "BSc Statistics", "Certified Responsible Gambling Advisor", ...]

Example format:
{"name":"...","title":"...","bio":"...","credentials":["...","...","...","...","..."]}`;

  const messages = [
    { role: 'system' as const, content: 'You are a helpful assistant that generates JSON data. Return ONLY valid JSON, no markdown formatting.' },
    { role: 'user' as const, content: prompt },
  ];

  const result = await generateCompletion(messages, { temperature: 0.8, maxTokens: 1024 });

  // Parse JSON from response
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse JSON from response for ${lang}: ${result.substring(0, 200)}`);
  }

  const profile: ExpertProfile = JSON.parse(jsonMatch[0]);

  // Validate required fields
  if (!profile.name || !profile.title || !profile.bio || !Array.isArray(profile.credentials)) {
    throw new Error(`Invalid expert profile for ${lang}: missing required fields`);
  }

  db.insert(experts)
    .values({
      lang,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      credentials: JSON.stringify(profile.credentials),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
    .run();

  console.log(`  [OK] Expert created for ${lang}: ${profile.name} - ${profile.title}`);
}

async function main() {
  const targetLang = process.argv[2] as Locale | undefined;

  if (targetLang) {
    if (!(targetLang in LOCALES)) {
      console.error(`Invalid locale: ${targetLang}`);
      console.error(`Available locales: ${ALL_LOCALES.join(', ')}`);
      process.exit(1);
    }
    console.log(`Generating expert for single language: ${targetLang}`);
    await generateExpertForLang(targetLang);
  } else {
    console.log(`Generating experts for all ${ALL_LOCALES.length} languages...`);
    let completed = 0;

    for (const lang of ALL_LOCALES) {
      completed++;
      console.log(`[${completed}/${ALL_LOCALES.length}] Processing ${lang}...`);

      try {
        await generateExpertForLang(lang);
      } catch (err) {
        console.error(`  [ERROR] Failed for ${lang}:`, err);
      }

      // Rate limit: 3 second delay between API calls
      if (completed < ALL_LOCALES.length) {
        await delay(3000);
      }
    }

    console.log(`\nDone! Processed ${completed} languages.`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
