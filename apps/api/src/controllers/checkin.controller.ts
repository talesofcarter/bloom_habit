import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { milestoneConfig, Milestone } from "../config/milestones";

export interface StatsResponse {
  totalCheckIns: number;
  currentStreak: number;
  milestones: Milestone[];
}

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
    const { title, note, date, isRelapse = false } = req.body;

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
        isRelapse,
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

export const getStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;

    // 1. Fetch all check-in dates AND relapse status for this user, ordered newest to oldest
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      select: {
        date: true,
        isRelapse: true, // 👈 CRITICAL FIX: Must explicitly select this field
      },
      orderBy: { date: "desc" },
    });

    const totalCheckIns = checkIns.length;
    let currentStreak = 0;

    // 2. Safely calculate the consecutive streak
    if (totalCheckIns > 0) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      let expectedDate = new Date(today);
      const firstCheckInDate = new Date(checkIns[0].date);
      firstCheckInDate.setUTCHours(0, 0, 0, 0);

      const diffTime = today.getTime() - firstCheckInDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        // SMART LOGIC: If their most recent check-in was a setback, streak is 0.
        if (checkIns[0].isRelapse) {
          currentStreak = 0;
        } else {
          currentStreak = 1;
          expectedDate = new Date(firstCheckInDate);

          // Iterate through history to count consecutive days
          for (let i = 1; i < checkIns.length; i++) {
            // SMART LOGIC: If we hit a historical setback, the streak stops counting here
            if (checkIns[i].isRelapse) break;

            expectedDate.setUTCDate(expectedDate.getUTCDate() - 1);
            const nextDate = new Date(checkIns[i].date);
            nextDate.setUTCHours(0, 0, 0, 0);

            if (nextDate.getTime() === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
    }

    // 3. Evaluate Milestones based on the calculated streak
    const evaluatedMilestones: Milestone[] = milestoneConfig.map(
      (milestone) => ({
        ...milestone,
        earned: currentStreak >= milestone.days,
      }),
    );

    // 4. Return strictly typed response
    const responseData: StatsResponse = {
      totalCheckIns,
      currentStreak,
      milestones: evaluatedMilestones,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to calculate statistics." });
  }
};

export const updateCheckIn = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, note } = req.body;
    const userId = req.userId as string;

    // 1. Verify the check-in exists in the database
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: { id },
    });

    if (!existingCheckIn) {
      res.status(404).json({ error: "Check-in not found." });
      return;
    }

    // 2. Security Check: Ensure the user actually owns this check-in
    if (existingCheckIn.userId !== userId) {
      res.status(403).json({ error: "Unauthorized to edit this entry." });
      return;
    }

    // 3. Validation: Ensure they aren't passing empty strings to wipe their notes
    if (!title?.trim() || !note?.trim()) {
      res.status(400).json({ error: "Title and note cannot be empty." });
      return;
    }

    // 4. Update the record
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id },
      data: {
        title: title.trim(),
        note: note.trim(),
      },
    });

    // Return the updated record back to the frontend
    res.status(200).json(updatedCheckIn);
  } catch (error) {
    console.error("Update Check-In Error:", error);
    res.status(500).json({ error: "Failed to update check-in." });
  }
};
