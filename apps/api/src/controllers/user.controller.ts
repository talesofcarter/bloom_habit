import { Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const updatePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ error: "Please provide both your current and new passwords." });
      return;
    }

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // 2. Verify the current password is correct
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Incorrect current password." });
      return;
    }

    // 3. Enforce password strength
    if (newPassword.length < 8) {
      res
        .status(400)
        .json({ error: "New password must be at least 8 characters." });
      return;
    }

    // 4. Hash the new password and update the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ error: "Failed to update password." });
  }
};

export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    // 1. Delete the user. Because of `onDelete: Cascade` in your schema,
    await prisma.user.delete({
      where: { id: userId as string },
    });

    // 2. Destroy the secure session cookie
    res.clearCookie("jwt");

    res.status(200).json({ message: "Account and all data securely deleted." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ error: "Failed to delete account." });
  }
};
