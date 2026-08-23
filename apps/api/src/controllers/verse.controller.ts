import { Response } from "express";
import { prisma } from "../lib/prisma";
import { generateDailyVerse } from "../lib/llm";
import { AuthRequest } from "../middleware/auth.middleware";

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

const toDto = (verse: {
  id: string;
  date: Date;
  ampText: string;
  ampRef: string;
  nivText: string;
  nivRef: string;
  createdAt: Date;
}) => ({
  id: verse.id,
  date: verse.date,
  amp: { text: verse.ampText, reference: verse.ampRef },
  niv: { text: verse.nivText, reference: verse.nivRef },
  createdAt: verse.createdAt,
});

export const getTodayVerse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  console.log(`[verse:controller] GET /verses/today — userId=${req.userId}`);

  try {
    const today = startOfTodayUTC();
    console.log(
      `[verse:controller] Checking cache for date=${today.toISOString()}`,
    );

    const existing = await prisma.verse.findUnique({ where: { date: today } });

    if (existing) {
      console.log(
        `[verse:controller] Cache hit — returning stored verse (id=${existing.id}, ref=${existing.ampRef}). No LLM call made.`,
      );
      res.status(200).json(toDto(existing));
      return;
    }

    console.log(
      "[verse:controller] Cache miss — no verse stored for today yet.",
    );

    const recent = await prisma.verse.findMany({
      orderBy: { date: "desc" },
      take: 30,
      select: { ampRef: true },
    });
    console.log(
      `[verse:controller] Fetched ${recent.length} recent reference(s) to avoid repeats.`,
    );

    console.log("[verse:controller] Handing off to generateDailyVerse()...");
    const generated = await generateDailyVerse(recent.map((v) => v.ampRef));
    console.log(
      `[verse:controller] generateDailyVerse() returned ref=${generated.amp.reference}. Persisting to DB...`,
    );

    const created = await prisma.verse.create({
      data: {
        date: today,
        ampText: generated.amp.text,
        ampRef: generated.amp.reference,
        nivText: generated.niv.text,
        nivRef: generated.niv.reference,
      },
    });

    console.log(
      `[verse:controller] Saved verse row id=${created.id}. Responding 201.`,
    );
    res.status(201).json(toDto(created));
  } catch (error: any) {
    if (error.code === "P2002") {
      console.warn(
        "[verse:controller] Unique constraint hit (P2002) — likely a race with another request. Re-fetching today's row.",
      );
      const today = startOfTodayUTC();
      const existing = await prisma.verse.findUnique({
        where: { date: today },
      });
      if (existing) {
        console.log(
          `[verse:controller] Recovered row id=${existing.id} after race. Responding 200.`,
        );
        res.status(200).json(toDto(existing));
        return;
      }
    }

    console.error("[verse:controller] Get Today Verse Error:", error);
    res.status(500).json({ error: "Failed to load today's verse." });
  }
};

export const getVerseHistory = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  console.log("[verse:controller] GET /verses — fetching full archive.");
  try {
    const verses = await prisma.verse.findMany({ orderBy: { date: "desc" } });
    console.log(
      `[verse:controller] Returning ${verses.length} archived verse(s).`,
    );
    res.status(200).json(verses.map(toDto));
  } catch (error) {
    console.error("[verse:controller] Get Verse History Error:", error);
    res.status(500).json({ error: "Failed to load verse archive." });
  }
};
