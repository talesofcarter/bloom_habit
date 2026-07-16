import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createCheckIn = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized request." });
      return;
    }

    // 1. Extract exactly what is in your Prisma schema
    const { title, note, date } = req.body;

    if (!title) {
      res.status(400).json({ error: "A title is required for your check-in." });
      return;
    }

    // 2. Format the date
    const checkInDate = date ? new Date(date) : new Date();

    // 3. Save to Supabase using your exact schema fields
    const newCheckIn = await prisma.checkIn.create({
      data: {
        title,
        note: note || "",
        date: checkInDate,
        userId,
      },
    });

    res.status(201).json(newCheckIn);
  } catch (error: any) {
    // 4. Handle the specific "One Check-In Per Day" unique constraint
    if (error.code === "P2002") {
      res
        .status(400)
        .json({ error: "You have already checked in for this date." });
      return;
    }

    console.error("Create Check-In Error:", error);
    res.status(500).json({ error: "Failed to save check-in." });
  }
};
