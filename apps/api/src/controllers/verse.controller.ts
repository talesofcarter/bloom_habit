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
  try {
    const today = startOfTodayUTC();

    const existing = await prisma.verse.findUnique({ where: { date: today } });

    if (existing) {
      res.status(200).json(toDto(existing));
      return;
    }

    const recent = await prisma.verse.findMany({
      orderBy: { date: "desc" },
      take: 30,
      select: { ampRef: true },
    });

    const generated = await generateDailyVerse(recent.map((v) => v.ampRef));

    const created = await prisma.verse.create({
      data: {
        date: today,
        ampText: generated.amp.text,
        ampRef: generated.amp.reference,
        nivText: generated.niv.text,
        nivRef: generated.niv.reference,
      },
    });

    res.status(201).json(toDto(created));
  } catch (error: any) {
    if (error.code === "P2002") {
      const today = startOfTodayUTC();
      const existing = await prisma.verse.findUnique({
        where: { date: today },
      });
      if (existing) {
        res.status(200).json(toDto(existing));
        return;
      }
    }

    res.status(500).json({ error: "Failed to load today's verse." });
  }
};

export const getVerseHistory = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const verses = await prisma.verse.findMany({ orderBy: { date: "desc" } });

    res.status(200).json(verses.map(toDto));
  } catch (error: unknown) {
    console.error("[verse:controller] Get Verse History Error:", error);
    res.status(500).json({ error: "Failed to load verse archive." });
  }
};
