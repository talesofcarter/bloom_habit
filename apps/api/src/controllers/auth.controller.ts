import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// Generate JWT and set the cookie
const generateTokenAndSetCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d", // 7 days
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ error: "An account with this email already exists." });
      return;
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user in Supabase
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 4. Generate token & set cookie
    generateTokenAndSetCookie(res, newUser.id);

    // 5. Return user data (never return the password!)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // 2. Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // 3. Generate token & set cookie
    generateTokenAndSetCookie(res, user.id);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Grab the token from the secure cookie
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "No session found." });
      return;
    }

    // 2. Verify the token using jwt secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // 3. Find the user in Supabase
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // 4. Return the user data to restore the frontend state
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session." });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully." });
};
