import { useState } from "react";
import { IconQuote } from "@tabler/icons-react";
import { verses } from "../data/verses";

export default function BibleVerseCard() {
  // Lazy initializer: picks once per mount, stays stable across re-renders
  // (e.g. when parent stats refresh) rather than reshuffling underneath the user.
  const [verse] = useState(
    () => verses[Math.floor(Math.random() * verses.length)],
  );

  return (
    <div className="relative bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl overflow-hidden">
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-brand-green/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex items-start gap-4 md:gap-5">
        <IconQuote
          size={26}
          className="text-brand-green/40 shrink-0 mt-0.5"
          stroke={1.5}
        />
        <div className="space-y-2.5">
          <p className="text-lg md:text-xl font-light text-white/85 leading-relaxed italic">
            "{verse.text}"
          </p>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-green/70 uppercase">
            {verse.reference}
          </p>
        </div>
      </div>
    </div>
  );
}
