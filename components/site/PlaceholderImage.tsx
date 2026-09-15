const GRADIENTS = [
  "from-neon-green/30 via-background-card to-background-card",
  "from-magenta/30 via-background-card to-background-card",
  "from-gold/25 via-background-card to-background-card",
  "from-neon-green/20 via-magenta/10 to-background-card",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const gradient = GRADIENTS[hashString(label) % GRADIENTS.length];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className="px-3 text-center text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}
