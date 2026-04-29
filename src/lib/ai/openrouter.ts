import { db } from '../db/index';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

async function getSettingValue(key: string): Promise<string | null> {
  try {
    const result = db.select().from(settings).where(eq(settings.key, key)).get();
    return result?.value || null;
  } catch {
    return null;
  }
}

export async function generateCompletion(
  messages: ChatMessage[],
  options?: CompletionOptions,
): Promise<string> {
  const apiKey = options?.model
    ? await getSettingValue('openrouter_api_key')
    : await getSettingValue('openrouter_api_key');
  const model = options?.model || (await getSettingValue('openrouter_model')) || 'x-ai/grok-4.1-fast';

  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bigbasscrashgame.com',
      'X-Title': 'BigBassCrashGame Content Generator',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.8,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateArticle(
  lang: string,
  keyword: string,
  pageType: string,
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert iGaming content writer. Write in ${lang} language.
Write SEO-optimized, engaging, factual content about the Big Bass Crash game by Pragmatic Play.
Use Markdown formatting (## for h2, ### for h3, **bold**, *italic*, - for lists).
Include the primary keyword "${keyword}" naturally in the first paragraph and throughout the text.
The content should be 2000-3000 words.
Do NOT invent false statistics. Use factual information about the game.
Include sections with relevant ## headings.
Make the content comprehensive, covering all aspects a player would want to know.`,
    },
    {
      role: 'user',
      content: `Write a comprehensive ${pageType} article about Big Bass Crash game targeting the keyword "${keyword}". Include game features, RTP information, volatility, strategies, and tips for players.`,
    },
  ];

  return generateCompletion(messages, { maxTokens: 8192 });
}

export async function generateComment(
  agentPersonality: string,
  pageContext: string,
  lang: string,
  existingComments: string[],
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are ${agentPersonality}. Write a short, natural-sounding comment (2-4 sentences) in ${lang} about ${pageContext}.
The comment should feel authentic, like a real user wrote it.
Vary your style. Sometimes ask questions, sometimes share experiences, sometimes give opinions.
Do NOT be overly positive -- be balanced and realistic.
Do NOT repeat points from these existing comments: ${existingComments.slice(0, 5).join(' | ')}`,
    },
    {
      role: 'user',
      content: `Write one comment about Big Bass Crash game for the ${pageContext} page.`,
    },
  ];

  return generateCompletion(messages, { temperature: 0.9, maxTokens: 256 });
}

export async function generateDiscussion(
  personas: Array<{ name: string; personality: string }>,
  casinoNames: string[],
  lang: string,
): Promise<Array<{ author: string; content: string }>> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `Generate a natural discussion thread between ${personas.length} people debating which casino is best to play Big Bass Crash. Write in ${lang}.
The personas are: ${personas.map((p) => `${p.name} (${p.personality})`).join(', ')}.
The casinos being discussed: ${casinoNames.join(', ')}.
Format as JSON array: [{"author": "Name", "content": "message"}, ...].
Make it feel like a real forum discussion with disagreements, recommendations, and personal experiences. 8-12 messages total.`,
    },
    {
      role: 'user',
      content: 'Generate the discussion thread.',
    },
  ];

  const result = await generateCompletion(messages, { maxTokens: 4096 });

  try {
    // Extract JSON from the response
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }
  return [];
}

export async function generateExpertReview(
  expertName: string,
  expertBio: string,
  lang: string,
  keyword: string,
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are ${expertName}, ${expertBio}. Write a detailed expert review of Big Bass Crash game by Pragmatic Play in ${lang}.
Write in first person. Reference your experience and expertise. Use Markdown formatting.
Target keyword: "${keyword}". 2500-3500 words.
Include: first impressions, gameplay analysis, RTP & volatility analysis, bonus features review, comparison with similar crash games, final verdict with score.
Be honest and balanced -- mention both pros and cons.`,
    },
    {
      role: 'user',
      content: 'Write the expert review.',
    },
  ];

  return generateCompletion(messages, { maxTokens: 8192 });
}

export async function generateFaqs(
  lang: string,
  keyword: string,
  count: number = 8,
): Promise<Array<{ q: string; a: string }>> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `Generate ${count} frequently asked questions and answers about Big Bass Crash game. Write in ${lang}.
Focus on: gameplay, RTP, strategies, where to play, is it safe, how multipliers work, etc.
Format as JSON array: [{"q": "question", "a": "answer"}, ...]
Keep answers concise but informative (2-3 sentences each).
Include the keyword "${keyword}" naturally where it fits.`,
    },
    {
      role: 'user',
      content: `Generate ${count} FAQs about Big Bass Crash game.`,
    },
  ];

  const result = await generateCompletion(messages, { maxTokens: 2048 });

  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }
  return [];
}

export async function translateUiStrings(
  sourceStrings: Record<string, string>,
  targetLang: string,
): Promise<Record<string, string>> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `Translate the following JSON object values from English to ${targetLang}. Keep the JSON keys exactly the same. Only translate the values. Return valid JSON only.`,
    },
    {
      role: 'user',
      content: JSON.stringify(sourceStrings, null, 2),
    },
  ];

  const result = await generateCompletion(messages, { temperature: 0.3, maxTokens: 4096 });

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }
  return sourceStrings;
}
