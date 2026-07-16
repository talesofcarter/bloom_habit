import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return;
  }

  try {
    // Verify the token and extract the ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // Attach the user's ID directly to the request object
    req.userId = decoded.userId;

    // Pass control to the next function (our controller)
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session." });
  }
};
