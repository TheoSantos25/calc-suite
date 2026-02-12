import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { ApexOptions } from 'apexcharts'

function evaluateExpression(expr: string, x: number): number {
  try {
    const sanitized = expr
      .replace(/\^/g, '**')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/\bpi\b/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E')
    const fn = new Function('x', 'return ' + sanitized)
    const result = fn(x)
    return typeof result === 'number' ? result : NaN
  } catch {
    return NaN
  }
}

const presets = [
  { label: 'x\u00B2', expr: 'x^2' },
  { label: 'sin(x)', expr: 'sin(x)' },
  { label: 'x\u00B3-3x', expr: 'x^3-3*x' },
  { label: '1/x', expr: '1/x' },
  { label: '\u221Ax', expr: 'sqrt(x)' },
  { label: '2^x', expr: '2^x' },
]

export default function FunctionPlotterPage() {
  const [expression, setExpression] = useState('x^2')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)

  const { points, error } = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    let hasError = false

    if (xMin >= xMax) {
      return { points: [], error: 'X-min must be less than X-max' }
    }

    const step = (xMax - xMin) / 199
    for (let i = 0; i < 200; i++) {
      const x = xMin + i * step
      const y = evaluateExpression(expression, x)
      if (i === 0 && isNaN(y)) {
        hasError = true
      }
      pts.push({ x: parseFloat(x.toFixed(4)), y: isFinite(y) ? parseFloat(y.toFixed(6)) : NaN })
    }

    // Check if ALL points are NaN (invalid expression)
    const allNaN = pts.every((p) => isNaN(p.y))
    if (allNaN) {
      return { points: [], error: 'Invalid expression. Check your syntax.' }
    }

    return { points: pts, error: hasError && pts.filter((p) => !isNaN(p.y)).length === 0 ? 'Invalid expression' : null }
  }, [expression, xMin, xMax])

  const stats = useMemo(() => {
    const validPoints = points.filter((p) => !isNaN(p.y) && isFinite(p.y))
    if (validPoints.length === 0) {
      return { fAtZero: 'N/A', minY: 'N/A', maxY: 'N/A' }
    }

    const fAtZero = evaluateExpression(expression, 0)
    const yValues = validPoints.map((p) => p.y)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    return {
      fAtZero: isFinite(fAtZero) ? fAtZero.toFixed(4) : 'Undefined',
      minY: minY.toFixed(4),
      maxY: maxY.toFixed(4),
    }
  }, [points, expression])

  const chartOptions: ApexOptions = {
    xaxis: {
      type: 'numeric',
      title: { text: 'x' },
      labels: {
        formatter: (val: string) => parseFloat(val).toFixed(1),
      },
    },
    yaxis: {
      title: { text: 'f(x)' },
      labels: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#6366f1'],
    tooltip: {
      x: {
        formatter: (val: number) => `x = ${val.toFixed(3)}`,
      },
    },
  }

  const series = [
    {
      name: 'f(x)',
      data: points.filter((p) => !isNaN(p.y)).map((p) => ({ x: p.x, y: p.y })),
    },
  ]

  return (
    <CalculatorShell
      title="Function Plotter"
      description="Plot mathematical functions by entering an expression. Supports sin, cos, tan, sqrt, log, exp, abs, pi, and e."
    >
      <GlassCard className="p-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
              Expression f(x)
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. x^2, sin(x), 2*x+1"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary focus:outline-none transition-colors font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.expr}
                type="button"
                onClick={() => setExpression(preset.expr)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="X-Range Min"
              value={xMin}
              onChange={setXMin}
              min={-100}
              max={0}
              step={1}
            />
            <SliderInput
              label="X-Range Max"
              value={xMax}
              onChange={setXMax}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="p-4">
          <p className="text-sm text-rose-500 font-medium">{error}</p>
        </GlassCard>
      )}

      <ResultGrid>
        <ResultCard label="f(0)" value={stats.fAtZero} color="text-indigo-500" />
        <ResultCard label="Min y (in range)" value={stats.minY} color="text-emerald-500" />
        <ResultCard label="Max y (in range)" value={stats.maxY} color="text-rose-500" />
      </ResultGrid>

      {points.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Graph of f(x) = {expression}
          </h3>
          <ChartWrapper options={chartOptions} series={series} type="line" height={400} />
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
