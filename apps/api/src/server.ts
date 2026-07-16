import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Security & Parsing Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Bloom Habit API is active and secure.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `[server]: Bloom Habit API is running at http://localhost:${PORT}`,
  );
});
