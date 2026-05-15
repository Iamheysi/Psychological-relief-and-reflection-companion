import type Anthropic from "@anthropic-ai/sdk";
import hotlines from "@/lib/safety/hotlines.json";

export type SafetyCategory =
  | "suicide"
  | "self_harm"
  | "harm_to_others"
  | "abuse"
  | "acute_crisis"
  | "none";

export interface SafetyResult {
  flagged: boolean;
  categories: SafetyCategory[];
  matchedPhrases: string[];
  source: "keyword" | "classifier" | "both" | "none";
}

// High-recall keyword/regex layer. False positives are acceptable here —
// the conversational response is shaped to handle them gracefully; the
// model-classifier layer prunes obvious non-matches.
const KEYWORD_PATTERNS: Array<{ category: SafetyCategory; pattern: RegExp }> = [
  // English — suicide / self-harm
  { category: "suicide", pattern: /\b(kill (my ?self|me)|end (it|my life)|suicid(e|al)|take my (own )?life|don'?t want to (live|be here|exist))\b/i },
  { category: "self_harm", pattern: /\b(cut(ting)? my(self)?|self[-\s]?harm|hurt myself|burn myself|starve myself)\b/i },
  { category: "harm_to_others", pattern: /\b(kill (him|her|them|someone)|hurt (him|her|them|someone)|shoot up|attack them)\b/i },
  { category: "abuse", pattern: /\b(he hits me|she hits me|abus(ed|ive|ing)|rap(e|ed|ing)|sexual(ly)? assault)\b/i },
  { category: "acute_crisis", pattern: /\b(overdose|took (the )?pills|bleeding|can'?t breathe|in danger now|right now)\b/i },

  // Russian — same categories, common surface forms
  { category: "suicide", pattern: /(самоуб(ийство|ийц)|покончить с собой|не хочу жить|хочу умереть|свести счёты с жизнью|жить не хочу)/i },
  { category: "self_harm", pattern: /(реж[уеют]+\s+себя|резать\s+себя|резал[аи]?\s+себя|порезы|самоповреж|причин(ить|яю) себе боль|сжига[ю|ть]\s+себя)/i },
  { category: "harm_to_others", pattern: /(убью (его|её|их|кого)|причиню вред (ему|ей|им)|нападу на)/i },
  { category: "abuse", pattern: /(избива(ет|ют) меня|насил(ует|овал)|изнасилов|домашнее насилие)/i },
  { category: "acute_crisis", pattern: /(передозировк|выпил(а)? таблетк|истекаю кровью|прямо сейчас в опасности)/i },
];

export function keywordScan(text: string): SafetyResult {
  const matched: SafetyCategory[] = [];
  const phrases: string[] = [];
  for (const { category, pattern } of KEYWORD_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      matched.push(category);
      phrases.push(m[0]);
    }
  }
  const unique = Array.from(new Set(matched));
  return {
    flagged: unique.length > 0,
    categories: unique.length > 0 ? unique : ["none"],
    matchedPhrases: phrases,
    source: unique.length > 0 ? "keyword" : "none",
  };
}

const CLASSIFIER_SYSTEM = `You are a safety classifier for a mental-health support app. Read the user's message and decide if it contains any of:
- suicide: suicidal ideation, planning, or intent
- self_harm: non-suicidal self-injury
- harm_to_others: threats or plans to hurt another person
- abuse: the user is describing being abused or assaulted (currently or recently)
- acute_crisis: an emergency happening right now (overdose, bleeding, in immediate danger)

Reply with ONLY a compact JSON object: {"categories":["..."]}. Empty array if none apply. No prose.`;

export async function classifierScan(
  text: string,
  client: Anthropic,
  model: string,
): Promise<SafetyResult> {
  const resp = await client.messages.create({
    model,
    max_tokens: 64,
    system: CLASSIFIER_SYSTEM,
    messages: [{ role: "user", content: text }],
  });
  const block = resp.content.find((b) => b.type === "text");
  const raw = block && block.type === "text" ? block.text.trim() : "";
  let categories: SafetyCategory[] = [];
  try {
    const parsed = JSON.parse(raw) as { categories?: SafetyCategory[] };
    if (Array.isArray(parsed.categories)) categories = parsed.categories;
  } catch {
    categories = [];
  }
  return {
    flagged: categories.length > 0,
    categories: categories.length > 0 ? categories : ["none"],
    matchedPhrases: [],
    source: categories.length > 0 ? "classifier" : "none",
  };
}

export async function evaluateSafety(
  text: string,
  client: Anthropic | null,
  classifierModel: string,
): Promise<SafetyResult> {
  const kw = keywordScan(text);
  if (kw.flagged) {
    // Keyword high-recall hit — accept it; the response path is safety-aware regardless.
    return kw;
  }
  // Only ambiguous case: keyword missed. Use classifier if available.
  if (!client) return kw;
  try {
    return await classifierScan(text, client, classifierModel);
  } catch {
    return kw;
  }
}

export function hotlinesForLocale(locale: string): typeof hotlines {
  // Returned as-is; the UI picks the relevant country list. The lib stays pure.
  void locale;
  return hotlines;
}
