import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import checkInRoutes from "./routes/checkin.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Bloom Habit API is active." });
});

// Auth Routes Integration
app.use("/api/auth", authRoutes);
app.use("/api/check-ins", checkInRoutes);

app.listen(PORT, () => {
  console.log(
    `[server]: Bloom Habit API is running at http://localhost:${PORT}`,
  );
});
