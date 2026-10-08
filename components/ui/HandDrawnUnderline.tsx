import React from "react";

export default function HandDrawnUnderline({
  className = "text-neon-green",
  width = 140,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 240 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: `${width}px`, height: "auto" }}
      className={`inline-block pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3 13.5C45.2 6.8 112.5 3.2 236 10.2M22 15.2C65.4 10.5 138.8 8.1 218 14.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
