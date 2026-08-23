export interface GeneratedVerse {
  amp: { text: string; reference: string };
  niv: { text: string; reference: string };
}

const API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL_ID = "openai/gpt-oss-120b:together";

const SYSTEM_PROMPT = `You are a compassionate biblical curator for "Bloom Habit," an app that helps people find freedom from harmful habits, including sexual sin, lustful thoughts, and sin in general. Your job is to select ONE Bible verse per request — from either the Old or New Testament — centered on one or more of these themes: God's unconditional love, God's sufficient grace, God's glory (shekinah) toward mankind, and the power He gives believers to overcome sin and temptation.

Respond with ONLY a valid JSON object, no markdown, no code fences, no commentary, in this exact shape:
{"amp":{"text":"<verse text, Amplified Bible (AMP) translation>","reference":"<Book Chapter:Verse>"},"niv":{"text":"<same verse, New International Version (NIV) translation>","reference":"<Book Chapter:Verse>"}}

Rules:
- Use the actual wording of each translation as accurately as you can recall it. Do not invent verses or references.
- Keep the tone warm, hopeful, and encouraging — never condemning or shaming.
- Vary your selection across requests; do not default to the same handful of verses every time.
- Output raw JSON only. Do not wrap it in \`\`\`json or any other formatting.`;

function buildUserPrompt(recentReferences: string[]): string {
  const avoidance =
    recentReferences.length > 0
      ? `Avoid repeating any of these recently used references: ${recentReferences.join(", ")}.`
      : "No recent verses to avoid.";

  return `Curate today's verse for a user working through recovery from harmful habits. ${avoidance}`;
}

const FALLBACK_VERSES: GeneratedVerse[] = [
  {
    amp: {
      text: "My grace is sufficient for you [My loving-kindness and My mercy are more than enough—always available regardless of the situation]; for [My] power is being perfected [and is completed and shows itself most effectively] in [your] weakness.",
      reference: "2 Corinthians 12:9",
    },
    niv: {
      text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'",
      reference: "2 Corinthians 12:9",
    },
  },
  {
    amp: {
      text: "I have been crucified with Christ [in Him I have shared His crucifixion]; it is no longer I who live, but Christ lives in me; and the life I now live in the body I live by faith [by adhering to, relying on, and completely trusting] in the Son of God, who loved me and gave Himself up for me.",
      reference: "Galatians 2:20",
    },
    niv: {
      text: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.",
      reference: "Galatians 2:20",
    },
  },
];

function pickFallback(): GeneratedVerse {
  return FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
}

function extractJson(raw: string): string {
  return raw.replace(/```json\s*|```/g, "").trim();
}

let requestCounter = 0;

// Small structured logger so every line for a given call is easy to
// visually group in the terminal, even if requests overlap.
function makeLogger(requestId: string) {
  const prefix = `[llm:${requestId}]`;
  return {
    info: (msg: string, ...rest: unknown[]) =>
      console.log(`${prefix} ${msg}`, ...rest),
    warn: (msg: string, ...rest: unknown[]) =>
      console.warn(`${prefix} ${msg}`, ...rest),
    error: (msg: string, ...rest: unknown[]) =>
      console.error(`${prefix} ${msg}`, ...rest),
  };
}

export async function generateDailyVerse(
  recentReferences: string[] = [],
): Promise<GeneratedVerse> {
  const requestId = `req_${Date.now()}_${++requestCounter}`;
  const log = makeLogger(requestId);
  const startedAt = Date.now();

  log.info("── Verse generation started ──────────────────────────");
  log.info(`Target model : ${MODEL_ID}`);
  log.info(`Endpoint     : ${API_URL}`);
  log.info(
    `Avoiding     : ${recentReferences.length > 0 ? recentReferences.join(", ") : "(no recent references)"}`,
  );

  const apiKey = process.env.HF_TOKEN;

  if (!apiKey) {
    log.warn("HF_TOKEN is not set in the environment.");
    log.warn("Skipping network call — returning fallback verse.");
    const fallback = pickFallback();
    log.info(`Fallback selected: "${fallback.amp.reference}"`);
    log.info("── Verse generation ended (no network call) ─────────");
    return fallback;
  }

  const userPrompt = buildUserPrompt(recentReferences);
  const requestBody = {
    model: MODEL_ID,
    temperature: 0.9,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  };

  log.info(`HF_TOKEN present, ending in: ...${apiKey.slice(-4)}`);
  log.info(`User prompt  : "${userPrompt}"`);
  log.info("Dispatching request to Hugging Face router...");

  try {
    const dispatchedAt = Date.now();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const roundTripMs = Date.now() - dispatchedAt;
    log.info(`Response received in ${roundTripMs}ms`);
    log.info(`HTTP status  : ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorBody = await response.text();
      log.error(`Request rejected by Hugging Face.`);
      log.error(`Response body: ${errorBody}`);
      throw new Error(`LLM request failed with status ${response.status}`);
    }

    const data = await response.json();
    log.info("Response parsed as JSON successfully.");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      log.error("No 'choices[0].message.content' found in response payload.");
      log.error(`Full payload: ${JSON.stringify(data)}`);
      throw new Error("LLM response missing content");
    }

    log.info(`Raw model output: ${content}`);

    const cleaned = extractJson(content);
    const parsed = JSON.parse(cleaned) as GeneratedVerse;

    if (
      !parsed?.amp?.text ||
      !parsed?.amp?.reference ||
      !parsed?.niv?.text ||
      !parsed?.niv?.reference
    ) {
      log.error("Parsed JSON is missing required fields.");
      log.error(`Parsed value: ${JSON.stringify(parsed)}`);
      throw new Error("LLM response missing required fields");
    }

    log.info(`Verse curated : "${parsed.amp.reference}"`);
    log.info(`AMP text      : ${parsed.amp.text}`);
    log.info(`NIV text      : ${parsed.niv.text}`);

    const totalMs = Date.now() - startedAt;
    log.info(`── Verse generation succeeded in ${totalMs}ms ────────`);

    return parsed;
  } catch (error) {
    const totalMs = Date.now() - startedAt;
    log.error(`Verse generation failed after ${totalMs}ms:`, error);
    log.warn("Falling back to a preset verse so the request doesn't fail.");
    const fallback = pickFallback();
    log.info(`Fallback selected: "${fallback.amp.reference}"`);
    log.info("── Verse generation ended (with fallback) ────────────");
    return fallback;
  }
}
