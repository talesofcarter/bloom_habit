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

export const getStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    // 1. Fetch only the dates of the user's check-ins, sorted newest first
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    const totalCheckIns = checkIns.length;
    let currentStreak = 0;

    // 2. Streak Calculation Logic
    if (totalCheckIns > 0) {
      // Normalize today to midnight for clean comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const firstEntry = new Date(checkIns[0].date);
      firstEntry.setHours(0, 0, 0, 0);

      // Calculate days between today and the most recent entry
      const diffTime = today.getTime() - firstEntry.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

      // If the last check-in was today or yesterday, the streak is alive!
      if (diffDays <= 1) {
        let expectedDate = new Date(firstEntry);

        for (let i = 0; i < checkIns.length; i++) {
          const entryDate = new Date(checkIns[i].date);
          entryDate.setHours(0, 0, 0, 0);

          if (entryDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
            // Subtract one day to check the next historical entry
            expectedDate.setDate(expectedDate.getDate() - 1);
          } else {
            // A gap was found, the streak ends here
            break;
          }
        }
      }
    }

    // 3. Return the calculated data
    res.status(200).json({
      totalCheckIns,
      currentStreak,
      lastCheckIn: totalCheckIns > 0 ? checkIns[0].date : null,
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

export const getCheckIns = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    // Fetch all check-ins for this user, ordered newest to oldest
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.status(200).json(checkIns);
  } catch (error) {
    console.error("Get Check-Ins Error:", error);
    res.status(500).json({ error: "Failed to fetch check-in history." });
  }
};
