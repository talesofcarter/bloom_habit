export interface GeneratedVerse {
  amp: { text: string; reference: string };
  niv: { text: string; reference: string };
}

const SYSTEM_PROMPT = `You are a compassionate biblical curator for "Bloom Habit," an app that helps people find freedom from harmful habits, including sexual sin, lustful thoughts, and sin in general. Your job is to select ONE Bible verse per request — from either the Old or New Testament — centered on one or more of these themes: God's unconditional love, God's sufficient grace, God's glory (shekinah) toward mankind, and the power He gives believers to overcome sin and temptation.

Respond with ONLY a valid JSON object, no markdown, no commentary, in this exact shape:
{"amp":{"text":"<verse text, Amplified Bible (AMP) translation>","reference":"<Book Chapter:Verse>"},"niv":{"text":"<same verse, New International Version (NIV) translation>","reference":"<Book Chapter:Verse>"}}

Rules:
- Use the actual wording of each translation as accurately as you can recall it. Do not invent verses or references.
- Keep the tone warm, hopeful, and encouraging — never condemning or shaming.
- Vary your selection across requests; do not default to the same handful of verses every time.`;

function buildUserPrompt(recentReferences: string[]): string {
  const avoidance =
    recentReferences.length > 0
      ? `Avoid repeating any of these recently used references: ${recentReferences.join(", ")}.`
      : "No recent verses to avoid.";

  return `Curate today's verse for a user working through recovery from harmful habits. ${avoidance}`;
}

// Resilience fallback: keeps the feature working (no empty state) if the
// LLM call fails or a key isn't configured.
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

export async function generateDailyVerse(
  recentReferences: string[] = [],
): Promise<GeneratedVerse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OPENAI_API_KEY not set — using fallback verse.");
    return pickFallback();
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(recentReferences) },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM response missing content");

    const parsed = JSON.parse(content) as GeneratedVerse;

    if (
      !parsed?.amp?.text ||
      !parsed?.amp?.reference ||
      !parsed?.niv?.text ||
      !parsed?.niv?.reference
    ) {
      throw new Error("LLM response missing required fields");
    }

    return parsed;
  } catch (error) {
    console.error("Verse generation failed, using fallback:", error);
    return pickFallback();
  }
}
