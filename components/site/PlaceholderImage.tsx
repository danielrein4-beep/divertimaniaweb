import React from "react";
import { Sparkles, Heart, Smile, Music, Palette, Tent, Camera } from "lucide-react";

interface PlaceholderImageProps {
  label: string;
  categoria?: string;
  className?: string;
  /** Solo la inicial grande, sin textos (para tarjetas que ya muestran el nombre encima). */
  compact?: boolean;
}

export default function PlaceholderImage({
  label,
  categoria = "",
  className = "",
  compact = false,
}: PlaceholderImageProps) {
  // Configuración por categoría
  const getTheme = () => {
    const cat = categoria.toLowerCase();
    if (cat.includes("infantil")) {
      return {
        gradient: "from-neon-green/20 via-[#1a1a1a] to-[#141414]",
        border: "border-neon-green/30",
        iconColor: "text-neon-green",
        Icon: Sparkles,
      };
    }
    if (cat.includes("baby")) {
      return {
        gradient: "from-magenta/25 via-[#1a1a1a] to-[#141414]",
        border: "border-magenta/30",
        iconColor: "text-magenta",
        Icon: Heart,
      };
    }
    if (cat.includes("personaje")) {
      return {
        gradient: "from-[#00e5ff]/20 via-[#1a1a1a] to-[#141414]",
        border: "border-[#00e5ff]/30",
        iconColor: "text-[#00e5ff]",
        Icon: Smile,
      };
    }
    if (cat.includes("adulto")) {
      return {
        gradient: "from-gold/25 via-[#1a1a1a] to-[#141414]",
        border: "border-gold/30",
        iconColor: "text-gold",
        Icon: Music,
      };
    }
    if (cat.includes("creativa")) {
      return {
        gradient: "from-orange-500/25 via-[#1a1a1a] to-[#141414]",
        border: "border-orange-500/30",
        iconColor: "text-orange-400",
        Icon: Palette,
      };
    }
    if (cat.includes("atraccion")) {
      return {
        gradient: "from-purple-500/25 via-[#1a1a1a] to-[#141414]",
        border: "border-purple-500/30",
        iconColor: "text-purple-400",
        Icon: Tent,
      };
    }
    return {
      gradient: "from-white/10 via-[#1a1a1a] to-[#141414]",
      border: "border-white/15",
      iconColor: "text-white/60",
      Icon: Camera,
    };
  };

  const theme = getTheme();
  const IconComponent = theme.Icon;

  if (compact) {
    return (
      <div
        aria-hidden
        className={`relative flex items-start justify-center overflow-hidden bg-gradient-to-br pt-[18%] ${theme.gradient} select-none ${className}`}
      >
        <span className={`font-display text-[5.5rem] font-extrabold leading-none opacity-30 ${theme.iconColor}`}>
          {label.trim().charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-gradient-to-br ${theme.gradient} border ${theme.border} select-none ${className}`}
    >
      {/* Círculo central iluminado con el icono temático */}
      <div className="relative mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
        <IconComponent className={`w-7 h-7 ${theme.iconColor}`} />
      </div>

      <p className="type-h3 text-foreground font-bold text-sm sm:text-base line-clamp-2 px-2 max-w-[200px]">
        {label}
      </p>

      <span className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
        Foto próximamente
      </span>
    </div>
  );
}
