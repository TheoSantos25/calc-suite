import { GlassCard } from '@/components/ui/GlassCard'

interface SkeletonCardProps {
  lines?: number
  className?: string
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <GlassCard className={`p-5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md mb-3 last:mb-0"
          style={{
            width: i === 0 ? '60%' : i === lines - 1 ? '40%' : '85%',
            background:
              'linear-gradient(90deg, rgba(148,163,184,0.15) 25%, rgba(148,163,184,0.3) 50%, rgba(148,163,184,0.15) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </GlassCard>
  )
}
