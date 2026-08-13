import type { ReactNode } from "react";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

interface InlineNoticeProps {
  variant: "notice" | "success";
  children: ReactNode;
  className?: string;
}

const styles = {
  notice: {
    wrapper: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    icon: IconAlertTriangle,
  },
  success: {
    wrapper: "bg-brand-green/10 border-brand-green/20 text-brand-green",
    icon: IconCircleCheck,
  },
};

export default function InlineNotice({
  variant,
  children,
  className = "",
}: InlineNoticeProps) {
  const { wrapper, icon: Icon } = styles[variant];

  return (
    <div
      role={variant === "notice" ? "alert" : "status"}
      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium tracking-wide ${wrapper} ${className}`}
    >
      <Icon size={15} stroke={2} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
