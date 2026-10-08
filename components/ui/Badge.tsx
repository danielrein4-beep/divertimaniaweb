import React from "react";

export type BadgeVariant = "neon" | "gold" | "magenta" | "cyan" | "danger" | "neutral";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export default function Badge({
  children,
  variant = "neon",
  icon,
  className = "",
  size = "md",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    neon: "bg-neon-green/10 text-neon-green border-neon-green/20",
    gold: "bg-[#ffd166]/10 text-[#ffd166] border-[#ffd166]/20",
    magenta: "bg-[#ff4fd8]/10 text-[#ff4fd8] border-[#ff4fd8]/20",
    cyan: "bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    neutral: "bg-white/5 text-muted border-white/10",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-sm select-none shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
