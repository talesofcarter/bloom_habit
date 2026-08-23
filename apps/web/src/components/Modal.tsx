import { useEffect, useState, type ReactNode } from "react";
import { IconX } from "@tabler/icons-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const frame = requestAnimationFrame(() => setIsEntered(true));
      return () => cancelAnimationFrame(frame);
    }

    setIsEntered(false);
    const timeout = setTimeout(() => setIsMounted(false), 500);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isEntered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — docked to the right edge, slides in from fully offscreen */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-y-0 right-0 w-full max-w-md md:max-w-lg bg-bg-base border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isEntered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="shrink-0 bg-bg-base/95 backdrop-blur-xl border-b border-white/5 px-6 md:px-8 py-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-300"
          >
            <IconX size={18} stroke={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
