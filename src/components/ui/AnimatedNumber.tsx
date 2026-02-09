import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatter?: (n: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 800,
  formatter = (n) => Math.round(n).toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const animated = useAnimatedCounter(value, duration)

  return <span className={className}>{formatter(animated)}</span>
}
