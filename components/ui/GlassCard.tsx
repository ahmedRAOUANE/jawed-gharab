interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
}

export default function GlassCard({ children, className = "", hoverScale = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hoverScale ? "hover:scale-105 transition-transform duration-300" : ""} ${className}`}
    >
      {children}
    </div>
  );
}