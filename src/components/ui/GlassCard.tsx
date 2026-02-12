import { useCategoryColor } from '@/context/CategoryColorContext'

const accentMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  rose: 'bg-rose-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
}

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: string | false
}

export function GlassCard({ children, className = '', hover = false, accent }: GlassCardProps) {
  const categoryColor = useCategoryColor()
  const resolvedAccent = accent === false ? null : accent || categoryColor

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-md ${hover ? 'hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300' : ''} ${className}`}
    >
      {resolvedAccent && accentMap[resolvedAccent] && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentMap[resolvedAccent]} rounded-l-2xl`} />
      )}
      {children}
    </div>
  )
}
