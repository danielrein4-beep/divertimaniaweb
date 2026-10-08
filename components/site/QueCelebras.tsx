"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Cake, Heart, Sparkles, GlassWater, Building2, GraduationCap, TreePine } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import SectionHeader from "@/components/ui/SectionHeader";

const OCASIONES = [
  {
    nombre: "Cumpleaños",
    slug: "cumpleanos",
    sub: "De 1 a 100 años",
    color: "from-neon-green/20 to-transparent",
    border: "hover:border-neon-green",
    icon: Cake,
  },
  {
    nombre: "Baby Shower",
    slug: "baby-shower",
    sub: "Y revelaciones de género",
    color: "from-magenta/25 to-transparent",
    border: "hover:border-magenta",
    icon: Heart,
  },
  {
    nombre: "15 años",
    slug: "quince",
    sub: "Hora loca de alto impacto",
    color: "from-[#00e5ff]/20 to-transparent",
    border: "hover:border-[#00e5ff]",
    icon: Sparkles,
  },
  {
    nombre: "Boda",
    slug: "boda",
    sub: "Animación elegante y fiesta",
    color: "from-gold/25 to-transparent",
    border: "hover:border-gold",
    icon: GlassWater,
  },
  {
    nombre: "Corporativo",
    slug: "corporativo",
    sub: "Eventos empresariales y marcas",
    color: "from-purple-500/20 to-transparent",
    border: "hover:border-purple-400",
    icon: Building2,
  },
  {
    nombre: "Graduación",
    slug: "graduacion",
    sub: "Último timbre y grados",
    color: "from-orange-500/20 to-transparent",
    border: "hover:border-orange-400",
    icon: GraduationCap,
  },
  {
    nombre: "Navidad",
    slug: "navidad",
    sub: "Shows navideños temáticos",
    color: "from-emerald-500/20 to-transparent",
    border: "hover:border-emerald-400",
    icon: TreePine,
  },
];

export default function QueCelebras() {
  const router = useRouter();
  const { updateFormData } = useMiFiesta();

  const handleSelectOcasion = (nombre: string, slug: string) => {
    updateFormData({ tipoEvento: nombre });
    router.push(`/catalogo?ocasion=${slug}`);
  };

  return (
    <section id="que-celebras" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 scroll-mt-20">
      <SectionHeader
        title="¿Qué estás celebrando hoy?"
        underlineWord="celebrando"
        subtitle="Elige la ocasión de tu evento para filtrar el catálogo ideal y armar tu cotización en 2 minutos."
        tilt="left"
        className="mb-8"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {OCASIONES.map((ocasion) => {
          const Icon = ocasion.icon;
          return (
            <button
              key={ocasion.slug}
              type="button"
              onClick={() => handleSelectOcasion(ocasion.nombre, ocasion.slug)}
              className={`group flex flex-col items-center text-center p-4 rounded-2xl bg-[#14141e] border border-white/10 ${ocasion.border} bg-gradient-to-b ${ocasion.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer touch-target`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform mb-3 shadow-inner">
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>

              <span className="type-h3 text-foreground font-bold text-sm sm:text-base leading-tight">
                {ocasion.nombre}
              </span>
              <span className="text-[11px] text-muted mt-1 leading-snug line-clamp-1">
                {ocasion.sub}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
