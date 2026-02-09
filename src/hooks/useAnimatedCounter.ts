import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(target: number, duration = 800): number {
  const [current, setCurrent] = useState(0)
  const prevTarget = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = prevTarget.current
    const diff = target - from
    if (diff === 0) return

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(from + diff * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        prevTarget.current = target
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return current
}
