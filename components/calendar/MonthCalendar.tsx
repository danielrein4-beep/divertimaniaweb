"use client";

import { ReactNode, useState } from "react";
import { DIAS_SEMANA, MESES, formatDateStr, getMonthMatrix } from "@/lib/date";

export default function MonthCalendar({
  renderDay,
  initialYear,
  initialMonth,
}: {
  renderDay: (dateStr: string, dayNum: number) => ReactNode;
  initialYear?: number;
  initialMonth?: number;
}) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth());

  const weeks = getMonthMatrix(year, month);

  function goPrev() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="card-glass rounded-2xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mes anterior"
          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-neon-green hover:text-neon-green"
        >
          ←
        </button>
        <h3 className="font-display text-lg font-bold">
          {MESES[month]} {year}
        </h3>
        <button
          type="button"
          onClick={goNext}
          aria-label="Mes siguiente"
          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-neon-green hover:text-neon-green"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week, wi) =>
          week.map((day, di) => (
            <div key={`${wi}-${di}`} className="aspect-square">
              {day ? renderDay(formatDateStr(year, month, day), day) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
