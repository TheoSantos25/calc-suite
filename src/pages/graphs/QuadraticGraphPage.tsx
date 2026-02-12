import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { ApexOptions } from 'apexcharts'

export default function QuadraticGraphPage() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const step = 20 / 199
    for (let i = 0; i < 200; i++) {
      const x = -10 + i * step
      const y = a * x * x + b * x + c
      pts.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) })
    }
    return pts
  }, [a, b, c])

  const results = useMemo(() => {
    const vertexX = a !== 0 ? -b / (2 * a) : 0
    const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c
    const axisOfSymmetry = a !== 0 ? vertexX : 0
    const discriminant = b * b - 4 * a * c
    const direction = a > 0 ? 'Opens Up' : a < 0 ? 'Opens Down' : 'Linear (a = 0)'

    let roots: string
    if (a === 0) {
      if (b === 0) {
        roots = c === 0 ? 'All real numbers' : 'No roots'
      } else {
        roots = (-c / b).toFixed(4)
      }
    } else if (discriminant > 0) {
      const r1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(4)
      const r2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(4)
      roots = `${r1}, ${r2}`
    } else if (discriminant === 0) {
      roots = (-b / (2 * a)).toFixed(4)
    } else {
      roots = 'No real roots'
    }

    // Build equation string
    const parts: string[] = []
    if (a !== 0) {
      if (a === 1) parts.push('x\u00B2')
      else if (a === -1) parts.push('-x\u00B2')
      else parts.push(`${a}x\u00B2`)
    }
    if (b !== 0) {
      if (parts.length > 0) {
        parts.push(b > 0 ? ` + ${b === 1 ? '' : b}x` : ` - ${b === -1 ? '' : Math.abs(b)}x`)
      } else {
        if (b === 1) parts.push('x')
        else if (b === -1) parts.push('-x')
        else parts.push(`${b}x`)
      }
    }
    if (c !== 0) {
      if (parts.length > 0) {
        parts.push(c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`)
      } else {
        parts.push(`${c}`)
      }
    }
    if (parts.length === 0) parts.push('0')
    const equation = `y = ${parts.join('')}`

    return {
      vertexX: vertexX.toFixed(4),
      vertexY: vertexY.toFixed(4),
      axisOfSymmetry: axisOfSymmetry.toFixed(4),
      discriminant: discriminant.toFixed(4),
      direction,
      roots,
      equation,
    }
  }, [a, b, c])

  const chartOptions: ApexOptions = {
    xaxis: {
      type: 'numeric',
      title: { text: 'x' },
      labels: {
        formatter: (val: string) => parseFloat(val).toFixed(0),
      },
    },
    yaxis: {
      title: { text: 'y' },
      labels: {
        formatter: (val: number) => val.toFixed(1),
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#8b5cf6'],
    tooltip: {
      x: {
        formatter: (val: number) => `x = ${val.toFixed(3)}`,
      },
    },
  }

  const series = [
    {
      name: 'y = ax\u00B2 + bx + c',
      data: points.map((p) => ({ x: p.x, y: p.y })),
    },
  ]

  return (
    <CalculatorShell
      title="Quadratic Grapher"
      description="Visualize y = ax\u00B2 + bx + c. Explore how the coefficients affect the shape and position of the parabola."
    >
      <GlassCard className="p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Equation: <span className="font-mono">{results.equation}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SliderInput
            label="a (coefficient of x\u00B2)"
            value={a}
            onChange={setA}
            min={-5}
            max={5}
            step={0.25}
          />
          <SliderInput
            label="b (coefficient of x)"
            value={b}
            onChange={setB}
            min={-10}
            max={10}
            step={0.5}
          />
          <SliderInput
            label="c (constant)"
            value={c}
            onChange={setC}
            min={-20}
            max={20}
            step={1}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Vertex"
          value={`(${results.vertexX}, ${results.vertexY})`}
          color="text-emerald-500"
        />
        <ResultCard
          label="Axis of Symmetry"
          value={a !== 0 ? `x = ${results.axisOfSymmetry}` : 'N/A'}
          color="text-sky-500"
        />
        <ResultCard
          label="Discriminant"
          value={results.discriminant}
          color="text-amber-500"
        />
        <ResultCard
          label="Roots"
          value={results.roots}
          color="text-purple-500"
        />
        <ResultCard
          label="Direction"
          value={results.direction}
          color="text-rose-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Graph: {results.equation}
        </h3>
        <ChartWrapper options={chartOptions} series={series} type="line" height={400} />
      </GlassCard>
    </CalculatorShell>
  )
}
