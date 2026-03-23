const stats = [
  { label: "Frontend target", value: "Vercel" },
  { label: "Chain", value: "Solana Devnet" },
  { label: "Program stack", value: "Rust + Anchor" },
  { label: "Default mode", value: "Demo-safe" },
];

export function StatsStrip() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="panel-subtle p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">{item.label}</div>
          <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
