"use client";

import React, { useState, useMemo } from "react";
import CatalogoHeader from "./CatalogoHeader";
import CatalogoFiltros from "./CatalogoFiltros";
import CatalogoEmptyState from "./CatalogoEmptyState";
import ServicioCard from "@/components/ui/ServicioCard";
import { CATEGORIAS } from "@/lib/site";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export interface ServicioDTO {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
  edadIdeal: string | null;
  duracion: string | null;
  masPedido: boolean;
  destacado: boolean;
  soloAdultos: boolean;
  ocasiones: string | null;
  orden: number;
}

interface CatalogoClientViewProps {
  initialServicios: ServicioDTO[];
  initialCategoria?: string;
  initialOcasion?: string;
}

export default function CatalogoClientView({
  initialServicios,
  initialCategoria,
  initialOcasion,
}: CatalogoClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(initialCategoria || "Todas");
  const [ocasionActiva, setOcasionActiva] = useState(initialOcasion || "todas");
  const [edadActiva, setEdadActiva] = useState("todas");

  // Filtrado general reactivo
  const serviciosFiltrados = useMemo(() => {
    return initialServicios.filter((servicio) => {
      // 1. REGLA ESTRICTA DE ADULTOS (+18):
      // Si el servicio es solo para adultos, SOLO se muestra si el usuario está en la categoría 'Show para Adultos'
      if (servicio.soloAdultos && categoriaActiva !== "Show para Adultos") {
        return false;
      }

      // 2. Filtro por categoría seleccionada
      if (categoriaActiva !== "Todas" && servicio.categoria !== categoriaActiva) {
        return false;
      }

      // 3. Filtro por ocasión
      if (ocasionActiva !== "todas") {
        if (!servicio.ocasiones || !servicio.ocasiones.includes(ocasionActiva)) {
          return false;
        }
      }

      // 4. Filtro por edad ideal
      if (edadActiva !== "todas") {
        if (!servicio.edadIdeal) return false;
        const edadLower = servicio.edadIdeal.toLowerCase();
        if (edadActiva === "1-4" && !edadLower.includes("1") && !edadLower.includes("2") && !edadLower.includes("3") && !edadLower.includes("4") && !edadLower.includes("todas")) {
          return false;
        }
        if (edadActiva === "5-10" && !edadLower.includes("5") && !edadLower.includes("6") && !edadLower.includes("7") && !edadLower.includes("8") && !edadLower.includes("9") && !edadLower.includes("10") && !edadLower.includes("todas")) {
          return false;
        }
        if (edadActiva === "adultos" && !servicio.soloAdultos && !edadLower.includes("adult") && !edadLower.includes("todas")) {
          return false;
        }
      }

      // 5. Filtro por búsqueda de texto
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const coincideNombre = servicio.nombre.toLowerCase().includes(query);
        const coincideDesc = servicio.descripcion.toLowerCase().includes(query);
        const coincideCat = servicio.categoria.toLowerCase().includes(query);
        const coincideOcasion = (servicio.ocasiones || "").toLowerCase().includes(query);

        if (!coincideNombre && !coincideDesc && !coincideCat && !coincideOcasion) {
          return false;
        }
      }

      return true;
    });
  }, [initialServicios, categoriaActiva, ocasionActiva, edadActiva, searchQuery]);

  const hayFiltrosActivos =
    searchQuery.trim().length > 0 || ocasionActiva !== "todas" || edadActiva !== "todas";

  const handleClearFilters = () => {
    setSearchQuery("");
    setOcasionActiva("todas");
    setEdadActiva("todas");
    setCategoriaActiva("Todas");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado y buscador */}
      <CatalogoHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Pestañas de categoría y filtros secundarios */}
      <CatalogoFiltros
        categoriaActiva={categoriaActiva}
        onCategoriaChange={setCategoriaActiva}
        ocasionActiva={ocasionActiva}
        onOcasionChange={setOcasionActiva}
        edadActiva={edadActiva}
        onEdadChange={setEdadActiva}
      />

      {/* Renderizado de servicios */}
      <div className="mt-4">
        {/* Caso 1: Filtros de búsqueda / secundarios activos */}
        {hayFiltrosActivos ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-muted">
                {serviciosFiltrados.length === 1
                  ? "1 resultado encontrado"
                  : `${serviciosFiltrados.length} resultados encontrados`}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-neon-green hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>

            {serviciosFiltrados.length === 0 ? (
              <CatalogoEmptyState
                searchQuery={searchQuery}
                onSelectSuggestion={(sug) => setSearchQuery(sug)}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {serviciosFiltrados.map((servicio, idx) => (
                  <ServicioCard
                    key={servicio.id}
                    id={servicio.id}
                    nombre={servicio.nombre}
                    categoria={servicio.categoria}
                    descripcion={servicio.descripcion}
                    fotoUrl={servicio.fotoUrl}
                    videoUrl={servicio.videoUrl}
                    posterUrl={servicio.posterUrl}
                    edadIdeal={servicio.edadIdeal}
                    duracion={servicio.duracion}
                    masPedido={servicio.masPedido}
                    destacado={servicio.destacado}
                    soloAdultos={servicio.soloAdultos}
                    priority={idx < 4}
                  />
                ))}
              </div>
            )}
          </div>
        ) : categoriaActiva !== "Todas" ? (
          /* Caso 2: Categoría específica seleccionada */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="type-h2 font-extrabold text-foreground flex items-center gap-2">
                  <span>{categoriaActiva}</span>
                  {categoriaActiva === "Show para Adultos" && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Solo para adultos (+18)
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {serviciosFiltrados.length} opciones disponibles para cotizar
                </p>
              </div>
            </div>

            {serviciosFiltrados.length === 0 ? (
              <CatalogoEmptyState
                searchQuery=""
                onSelectSuggestion={(sug) => setSearchQuery(sug)}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {serviciosFiltrados.map((servicio, idx) => (
                  <ServicioCard
                    key={servicio.id}
                    id={servicio.id}
                    nombre={servicio.nombre}
                    categoria={servicio.categoria}
                    descripcion={servicio.descripcion}
                    fotoUrl={servicio.fotoUrl}
                    videoUrl={servicio.videoUrl}
                    posterUrl={servicio.posterUrl}
                    edadIdeal={servicio.edadIdeal}
                    duracion={servicio.duracion}
                    masPedido={servicio.masPedido}
                    destacado={servicio.destacado}
                    soloAdultos={servicio.soloAdultos}
                    priority={idx < 4}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Caso 3: Vista 'Todas' estructurada por bloques de categoría (máx 4 por categoría) */
          <div className="flex flex-col gap-14">
            {CATEGORIAS.filter((c) => c !== "Show para Adultos").map((categoria) => {
              const itemsDeCategoria = initialServicios.filter((s) => s.categoria === categoria);
              if (itemsDeCategoria.length === 0) return null;

              const muestra = itemsDeCategoria.slice(0, 4);

              return (
                <section key={categoria} className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="type-h3 font-extrabold text-foreground tracking-tight">
                        {categoria}
                      </h2>
                      <span className="text-xs text-muted">
                        {itemsDeCategoria.length} disponibles
                      </span>
                    </div>

                    {itemsDeCategoria.length > 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCategoriaActiva(categoria);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-neon-green hover:underline cursor-pointer touch-target"
                      >
                        <span>Ver los {itemsDeCategoria.length} de {categoria}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {muestra.map((servicio) => (
                      <ServicioCard
                        key={servicio.id}
                        id={servicio.id}
                        nombre={servicio.nombre}
                        categoria={servicio.categoria}
                        descripcion={servicio.descripcion}
                        fotoUrl={servicio.fotoUrl}
                        videoUrl={servicio.videoUrl}
                        posterUrl={servicio.posterUrl}
                        edadIdeal={servicio.edadIdeal}
                        duracion={servicio.duracion}
                        masPedido={servicio.masPedido}
                        destacado={servicio.destacado}
                        soloAdultos={servicio.soloAdultos}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Aviso discreto para categoría de adultos (+18) */}
            <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    ¿Buscas animación para eventos de adultos?
                  </h3>
                  <p className="text-xs text-muted">
                    Shows nocturnos, hora loca y comedia especial para bodas, 15 años y fiestas de adultos.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setCategoriaActiva("Show para Adultos");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="shrink-0 text-red-400 border-red-500/30 hover:border-red-500/60"
              >
                Ver Shows para Adultos (+18) →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
