import { useState, useRef, useEffect } from "react";
import { IconFlame, IconCheck, IconCalendarEvent } from "@tabler/icons-react";

export default function Home() {
  const [note, setNote] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [note]);

  // Handle the "Zen Mode" overlay click to close
  const handleOverlayClick = () => {
    setIsFocused(false);
    textareaRef.current?.blur();
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      {/* Zen Mode Overlay - Fades in when typing */}
      <div
        className={`fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isFocused
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      />

      <div className="relative z-10 space-y-12 transition-all duration-500">
        {/* Header section fades back slightly during Zen Mode */}
        <header
          className={`transition-opacity duration-500 ${isFocused ? "opacity-30" : "opacity-100"}`}
        >
          <h1 className="text-3xl font-extralight tracking-wide text-white mb-2">
            Good afternoon.
          </h1>
          <p className="text-white/50 tracking-wide text-sm">
            Take a deep breath. How is your journey going today?
          </p>
        </header>

        {/* Quick Stats - Premium micro-cards */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 gap-4 transition-opacity duration-500 ${isFocused ? "opacity-30" : "opacity-100"}`}
        >
          <div className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28">
            <IconFlame
              size={20}
              className="text-brand-green drop-shadow-[0_0_8px_rgba(29,185,84,0.3)]"
            />
            <div>
              <div className="text-2xl font-light text-white tracking-widest">
                12
              </div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mt-1">
                Day Streak
              </div>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28">
            <IconCalendarEvent size={20} className="text-white/50" />
            <div>
              <div className="text-2xl font-light text-white tracking-widest">
                Jul 16
              </div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mt-1">
                Current Date
              </div>
            </div>
          </div>

          <div className="hidden sm:flex bg-white/2 border border-white/5 rounded-2xl p-5 flex-col justify-between h-28">
            <IconCheck size={20} className="text-white/50" />
            <div>
              <div className="text-2xl font-light text-white tracking-widest">
                30
              </div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mt-1">
                Total Check-ins
              </div>
            </div>
          </div>
        </div>

        {/* The Editor Area - Elevates to z-30 during Zen Mode */}
        <div
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isFocused ? "z-30 scale-[1.02] md:scale-[1.05]" : "z-10 scale-100"
          }`}
        >
          <div
            className={`bg-[#0a0a0a] rounded-3xl transition-shadow duration-700 ${
              isFocused ? "shadow-[0_0_40px_rgba(0,0,0,0.5)]" : ""
            }`}
          >
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="What are you feeling right now? Record your triggers, victories, or thoughts..."
              className={`w-full bg-white/3 border rounded-3xl p-6 text-lg tracking-wide text-white placeholder-white/30 resize-none focus:outline-none transition-all duration-500 leading-relaxed min-h-40 ${
                isFocused
                  ? "border-brand-green/30 bg-white/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            />

            {/* Action Bar - Slides in when focused or typing */}
            <div
              className={`flex items-center justify-between px-2 pt-4 transition-all duration-500 ${
                isFocused || note.length > 0
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                {note.length} characters
              </span>
              <button
                className="bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest text-xs uppercase px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.2)] hover:shadow-[0_0_25px_rgba(29,185,84,0.3)] active:scale-[0.98]"
                onClick={(e) => {
                  e.preventDefault();
                  // Check-in logic will go here
                  setIsFocused(false);
                }}
              >
                Log Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
