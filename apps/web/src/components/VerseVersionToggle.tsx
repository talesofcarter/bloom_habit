interface VerseVersionToggleProps {
  value: "amp" | "niv";
  onChange: (value: "amp" | "niv") => void;
}

export default function VerseVersionToggle({
  value,
  onChange,
}: VerseVersionToggleProps) {
  return (
    <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full p-1 text-[10px] font-semibold tracking-widest">
      {(["amp", "niv"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-3.5 py-1.5 rounded-full uppercase transition-all duration-300 ${
            value === option
              ? "bg-brand-green text-black shadow-[0_0_12px_rgba(29,185,84,0.35)]"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
