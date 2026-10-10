import React from "react";
import HandDrawnUnderline from "./HandDrawnUnderline";

export interface SectionHeaderProps {
  badge?: string;
  title: string;
  underlineWord?: string;
  subtitle?: string;
  align?: "left" | "center";
  tilt?: "left" | "right" | "none";
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  underlineWord,
  subtitle,
  align = "left",
  tilt = "none",
  className = "",
}: SectionHeaderProps) {
  const tiltClass =
    tilt === "left"
      ? "-rotate-1"
      : tilt === "right"
      ? "rotate-1"
      : "";

  return (
    <div
      className={`flex flex-col gap-2 ${
        align === "center" ? "items-center text-center mx-auto" : "items-start text-left"
      } ${className}`}
    >
      {badge && (
        <span className="inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-neon-green uppercase mb-1">
          {badge}
        </span>
      )}

      <h2
        className={`type-h2 font-extrabold text-foreground tracking-tight transition-transform ${tiltClass}`}
      >
        {underlineWord && title.includes(underlineWord) ? (
          <>
            {title.split(underlineWord)[0]}
            <span className="relative inline-block text-neon-green">
              {underlineWord}
              <span className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <HandDrawnUnderline width={130} />
              </span>
            </span>
            {title.split(underlineWord)[1]}
          </>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p className="type-body text-muted max-w-2xl mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
