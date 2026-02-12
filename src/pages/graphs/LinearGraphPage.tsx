import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { ApexOptions } from 'apexcharts'

export default function LinearGraphPage() {
  const [m, setM] = useState(1)
  const [b, setB] = useState(0)

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    for (let x = -10; x <= 10; x += 0.5) {
      pts.push({ x, y: m * x + b })
    }
    return pts
  }, [m, b])

  const results = useMemo(() => {
    const xIntercept = m !== 0 ? (-b / m).toFixed(4) : 'None'

    const sign = b >= 0 ? '+' : '-'
    const absB = Math.abs(b)
    let equation: string
    if (m === 0 && b === 0) {
      equation = 'y = 0'
    } else if (m === 0) {
      equation = `y = ${b}`
    } else if (b === 0) {
      equation = m === 1 ? 'y = x' : m === -1 ? 'y = -x' : `y = ${m}x`
    } else {
      const mStr = m === 1 ? '' : m === -1 ? '-' : `${m}`
      equation = `y = ${mStr}x ${sign} ${absB}`
    }

    return {
      slope: m.toString(),
      yIntercept: b.toString(),
      xIntercept,
      equation,
    }
  }, [m, b])

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
    stroke: { curve: 'straight', width: 3 },
    colors: ['#6366f1'],
    tooltip: {
      x: {
        formatter: (val: number) => `x = ${val}`,
      },
    },
  }

  const series = [
    {
      name: 'y = mx + b',
      data: points.map((p) => ({ x: p.x, y: parseFloat(p.y.toFixed(4)) })),
    },
  ]

  return (
    <CalculatorShell
      title="Linear Grapher"
      description="Visualize y = mx + b. Adjust the slope and y-intercept to explore linear functions."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Slope (m)"
            value={m}
            onChange={setM}
            min={-10}
            max={10}
            step={0.5}
          />
          <SliderInput
            label="Y-Intercept (b)"
            value={b}
            onChange={setB}
            min={-20}
            max={20}
            step={1}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Slope" value={results.slope} color="text-sky-500" />
        <ResultCard label="Y-Intercept" value={results.yIntercept} color="text-emerald-500" />
        <ResultCard label="X-Intercept" value={results.xIntercept} color="text-amber-500" />
        <ResultCard label="Equation" value={results.equation} color="text-purple-500" />
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
