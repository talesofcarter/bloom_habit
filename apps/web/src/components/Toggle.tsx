interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  helperText?: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  helperText,
}: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group w-fit">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500/80 border border-white/10 transition-colors duration-300" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
          {label}
        </span>
        {helperText && (
          <span className="text-[10px] text-white/30">{helperText}</span>
        )}
      </div>
    </label>
  );
}
