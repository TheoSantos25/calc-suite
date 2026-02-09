interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg ${hover ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
