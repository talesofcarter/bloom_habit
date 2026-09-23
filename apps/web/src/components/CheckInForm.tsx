import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { isAxiosError } from "axios";
import { IconCircleCheck } from "@tabler/icons-react";
import InlineNotice from "./InlineNotice";
import Toggle from "./Toggle";

interface CreateCheckInPayload {
  title: string;
  note: string;
  isRelapse: boolean;
  date?: string;
}

interface UpdateCheckInPayload {
  title: string;
  note: string;
  isRelapse: boolean;
}

export interface ExistingCheckIn {
  id: string;
  title: string;
  note: string;
  isRelapse: boolean;
}

interface CheckInFormProps {
  onSuccess: () => void;
  /** ISO date (YYYY-MM-DD) to create the check-in for. Defaults to today when omitted. */
  date?: string;
  /** When provided, the form edits this entry instead of creating a new one. */
  existingCheckIn?: ExistingCheckIn | null;
}

export default function CheckInForm({
  onSuccess,
  date,
  existingCheckIn = null,
}: CheckInFormProps) {
  const isEditing = existingCheckIn !== null;

  const [title, setTitle] = useState(existingCheckIn?.title ?? "");
  const [note, setNote] = useState(existingCheckIn?.note ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRelapse, setIsRelapse] = useState(
    existingCheckIn?.isRelapse ?? false,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !note.trim()) {
      setError("Please fill out both the title and your note.");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && existingCheckIn) {
        const payload: UpdateCheckInPayload = { title, note, isRelapse };
        await api.put(`/check-ins/${existingCheckIn.id}`, payload);
      } else {
        const payload: CreateCheckInPayload = {
          title,
          note,
          isRelapse,
          ...(date ? { date } : {}),
        };
        await api.post("/check-ins", payload);
      }

      setSuccess(true);

      if (!isEditing) {
        setTitle("");
        setNote("");
        setIsRelapse(false);
      }

      onSuccess();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to save check-in.");
      } else {
        setError("An unexpected network error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
          <IconCircleCheck size={24} stroke={2} />
        </div>
        <h3 className="text-white font-medium">
          {isEditing ? "Check-in updated!" : "Check-in complete!"}
        </h3>
        <p className="text-white/60 text-sm">
          Your progress has been securely recorded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <InlineNotice variant="notice">{error}</InlineNotice>}

      <div>
        <label
          htmlFor="checkin-title"
          className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
        >
          Title
        </label>
        <input
          id="checkin-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="e.g., Day 12: Feeling stronger"
          className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all duration-300 disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="checkin-note"
          className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
        >
          Notes
        </label>
        <textarea
          id="checkin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isLoading}
          placeholder="Reflect on your day, your triggers, or your victories…"
          rows={4}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all duration-300 resize-none disabled:opacity-50"
        />
      </div>

      <div className="pt-1 pb-5 border-b border-white/5">
        <Toggle
          checked={isRelapse}
          onChange={setIsRelapse}
          label="I experienced a setback"
          helperText="Be honest. Your notes will help you identify triggers."
        />
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest text-xs px-8 py-4 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.15)] hover:shadow-[0_0_25px_rgba(29,185,84,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {isLoading
            ? "Saving…"
            : isEditing
              ? "Save Changes"
              : "Submit Check-In"}
        </button>
      </div>
    </form>
  );
}
