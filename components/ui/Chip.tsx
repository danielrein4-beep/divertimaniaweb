import React, { ButtonHTMLAttributes } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
}

export default function Chip({
  children,
  selected = false,
  icon,
  className = "",
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-medium transition-all duration-150 select-none cursor-pointer border ${
        selected
          ? "bg-neon-green/15 text-neon-green border-neon-green font-semibold shadow-[0_0_12px_rgba(157,255,60,0.2)]"
          : "bg-[#181824] text-foreground/80 border-white/10 hover:border-white/20 hover:text-foreground active:scale-95"
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
