export function Companion({ size = 96 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="rounded-full bg-sage/30 animate-breathe motion-reduce:animate-none flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="rounded-full bg-sage/60" style={{ width: size * 0.55, height: size * 0.55 }} />
    </div>
  );
}
