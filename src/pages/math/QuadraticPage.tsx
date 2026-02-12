import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

export default function QuadraticPage() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-5)
  const [c, setC] = useState(6)

  const results = useMemo(() => {
    const discriminant = b * b - 4 * a * c

    let root1: string
    let root2: string
    let rootType: string

    if (a === 0) {
      rootType = 'Not quadratic (a = 0)'
      if (b === 0) {
        root1 = 'Undefined'
        root2 = 'Undefined'
      } else {
        root1 = (-c / b).toFixed(4)
        root2 = 'N/A (linear)'
      }
    } else if (discriminant > 0) {
      rootType = 'Two real roots'
      root1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(4)
      root2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(4)
    } else if (discriminant === 0) {
      rootType = 'One repeated root'
      root1 = (-b / (2 * a)).toFixed(4)
      root2 = root1
    } else {
      rootType = 'No real roots'
      const realPart = (-b / (2 * a)).toFixed(4)
      const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4)
      root1 = `${realPart} + ${imagPart}i`
      root2 = `${realPart} - ${imagPart}i`
    }

    const vertexX = a !== 0 ? -b / (2 * a) : 0
    const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : 0
    const axisOfSymmetry = a !== 0 ? vertexX : 0

    return {
      discriminant,
      root1,
      root2,
      rootType,
      vertexX: vertexX.toFixed(4),
      vertexY: vertexY.toFixed(4),
      axisOfSymmetry: axisOfSymmetry.toFixed(4),
    }
  }, [a, b, c])

  return (
    <CalculatorShell
      title="Quadratic Equation Solver"
      description="Solve ax² + bx + c = 0. Find the roots, discriminant, vertex, and axis of symmetry."
    >
      <GlassCard className="p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Equation: <span className="font-mono">{a}x² + ({b})x + ({c}) = 0</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumberInput
            label="a (coefficient of x²)"
            value={a}
            onChange={setA}
            step={0.1}
          />
          <NumberInput
            label="b (coefficient of x)"
            value={b}
            onChange={setB}
            step={0.1}
          />
          <NumberInput
            label="c (constant)"
            value={c}
            onChange={setC}
            step={0.1}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Root Type: <span className="font-semibold">{results.rootType}</span>
        </p>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Discriminant (b² - 4ac)"
          value={results.discriminant.toFixed(4)}
          color="text-pink-500"
        />
        <ResultCard
          label="Root 1"
          value={results.root1}
          color="text-purple-500"
        />
        <ResultCard
          label="Root 2"
          value={results.root2}
          color="text-blue-500"
        />
        <ResultCard
          label="Vertex X"
          value={a !== 0 ? results.vertexX : 'N/A'}
          color="text-emerald-500"
          subtitle={a !== 0 ? `x = -b / (2a) = ${results.vertexX}` : undefined}
        />
        <ResultCard
          label="Vertex Y"
          value={a !== 0 ? results.vertexY : 'N/A'}
          color="text-emerald-500"
          subtitle={a !== 0 ? `f(${results.vertexX}) = ${results.vertexY}` : undefined}
        />
        <ResultCard
          label="Axis of Symmetry"
          value={a !== 0 ? `x = ${results.axisOfSymmetry}` : 'N/A'}
          color="text-amber-500"
        />
      </ResultGrid>
    </CalculatorShell>
  )
}
