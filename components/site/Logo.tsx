import Image from "next/image";

const ASPECT_RATIO = 2564 / 1468;

export default function Logo({ height = 40, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Divertimania"
      width={Math.round(height * ASPECT_RATIO)}
      height={height}
      priority
      className={`h-auto object-contain ${className}`}
      style={{ height }}
    />
  );
}
