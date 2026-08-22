import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import type { DailyVerse } from "../types/verse";

const CACHE_KEY = "bloom:daily-verse";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface CachedVerse {
  date: string; // YYYY-MM-DD
  verse: DailyVerse;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyVerse() {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedVerse = JSON.parse(cachedRaw);
          if (cached.date === todayKey()) {
            setVerse(cached.verse);
            setIsLoading(false);
            return;
          }
        }
      } catch {}
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<DailyVerse>("/verses/today");
      setVerse(response.data);
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ date: todayKey(), verse: response.data }),
        );
      } catch {}
    } catch (err: unknown) {
      console.error("Failed to load daily verse", err);
      setError("Could not load today's verse.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerse();

    const interval = setInterval(() => fetchVerse(true), TWENTY_FOUR_HOURS);
    return () => clearInterval(interval);
  }, [fetchVerse]);

  return { verse, isLoading, error, refetch: () => fetchVerse(true) };
}
