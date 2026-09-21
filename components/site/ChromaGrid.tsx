"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export interface ChromaGridItem {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
}

export interface ChromaGridProps {
  items?: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 4,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<any>(null);
  const setY = useRef<any>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaGridItem[] = [
    {
      image: "/images/bolas-disco-equipo.jpg",
      title: "Daniel Reina",
      subtitle: "Director & Animador Principal",
      handle: "@danielreina",
      borderColor: "#9dff3c",
      gradient: "linear-gradient(145deg, #9dff3c, #0a0a0f)",
    },
    {
      image: "/images/princesa-rapunzel.jpg",
      title: "Valeria Morales",
      subtitle: "Coordinadora de Shows Infantiles",
      handle: "@valeriamorales",
      borderColor: "#ff4fd8",
      gradient: "linear-gradient(210deg, #ff4fd8, #0a0a0f)",
    },
    {
      image: "/images/dia-piscina-espuma.png",
      title: "Carlos Mendoza",
      subtitle: "Animador & Dinámicas de Piscina",
      handle: "@carlosmendoza",
      borderColor: "#00f0ff",
      gradient: "linear-gradient(165deg, #00f0ff, #0a0a0f)",
    },
    {
      image: "/images/baby-shower.png",
      title: "Mariana Gómez",
      subtitle: "Especialista en Baby Shower",
      handle: "@marianagomez",
      borderColor: "#ffd166",
      gradient: "linear-gradient(195deg, #ffd166, #0a0a0f)",
    },
    {
      image: "/images/bolas-disco-duo.jpg",
      title: "Alejandro Pérez",
      subtitle: "Showman & Coreógrafo",
      handle: "@alejandroperez",
      borderColor: "#a78bfa",
      gradient: "linear-gradient(225deg, #a78bfa, #0a0a0f)",
    },
    {
      image: "/images/diverti-artistas.png",
      title: "Sofía Hernández",
      subtitle: "Tallerista & Estación Creativa",
      handle: "@sofiahernandez",
      borderColor: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e, #0a0a0f)",
    },
    {
      image: "/images/espumania-foam.png",
      title: "Javier Torres",
      subtitle: "Operador de Cañón & Efectos",
      handle: "@javiertorres",
      borderColor: "#10b981",
      gradient: "linear-gradient(145deg, #10b981, #0a0a0f)",
    },
    {
      image: "/images/rapunzel-cumpleanos.png",
      title: "Camila Rivas",
      subtitle: "Personajes & Animación Temática",
      handle: "@camilarivas",
      borderColor: "#fb923c",
      gradient: "linear-gradient(210deg, #fb923c, #0a0a0f)",
    },
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    if (setX.current) setX.current(pos.current.x);
    if (setY.current) setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        if (setX.current) setX.current(pos.current.x);
        if (setY.current) setY.current(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: fadeOut,
        overwrite: true,
      });
    }
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        ["--r" as string]: `${radius}px`,
        ["--cols" as string]: columns,
        ["--rows" as string]: rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={c.id ?? i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            ["--card-border" as string]: c.borderColor || "#9dff3c",
            ["--card-gradient" as string]: c.gradient || "linear-gradient(145deg, #9dff3c, #0a0a0f)",
            cursor: c.url ? "pointer" : "default",
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
