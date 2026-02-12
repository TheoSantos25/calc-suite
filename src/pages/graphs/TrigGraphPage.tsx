import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { ApexOptions } from 'apexcharts'

const trigFunctions = [
  { value: 'sin', label: 'Sine (sin)' },
  { value: 'cos', label: 'Cosine (cos)' },
  { value: 'tan', label: 'Tangent (tan)' },
]

const trigFnMap: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
}

export default function TrigGraphPage() {
  const [func, setFunc] = useState('sin')
  const [amplitude, setAmplitude] = useState(1)
  const [frequency, setFrequency] = useState(1)
  const [phase, setPhase] = useState(0)
  const [verticalShift, setVerticalShift] = useState(0)

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const trigFn = trigFnMap[func] || Math.sin
    const xMin = -2 * Math.PI
    const xMax = 2 * Math.PI
    const step = (xMax - xMin) / 199

    for (let i = 0; i < 200; i++) {
      const x = xMin + i * step
      let y = amplitude * trigFn(frequency * x + phase) + verticalShift

      // Clamp tan values to avoid infinity spikes
      if (func === 'tan') {
        if (!isFinite(y)) {
          y = NaN
        } else if (y > 10) {
          y = NaN
        } else if (y < -10) {
          y = NaN
        }
      }

      pts.push({
        x: parseFloat(x.toFixed(4)),
        y: isFinite(y) ? parseFloat(y.toFixed(6)) : NaN,
      })
    }
    return pts
  }, [func, amplitude, frequency, phase, verticalShift])

  const results = useMemo(() => {
    const period = (2 * Math.PI) / frequency
    const phaseLabel = phase >= 0
      ? phase.toFixed(2)
      : phase.toFixed(2)

    // Build equation string
    const ampStr = amplitude === 1 ? '' : amplitude.toFixed(1)
    const freqStr = frequency === 1 ? '' : frequency.toFixed(1)
    const phaseStr = phase === 0
      ? ''
      : phase > 0
        ? ` + ${phase.toFixed(2)}`
        : ` - ${Math.abs(phase).toFixed(2)}`
    const shiftStr = verticalShift === 0
      ? ''
      : verticalShift > 0
        ? ` + ${verticalShift.toFixed(1)}`
        : ` - ${Math.abs(verticalShift).toFixed(1)}`

    const innerExpr = `${freqStr}x${phaseStr}`
    const equation = `y = ${ampStr}${func}(${innerExpr})${shiftStr}`

    return {
      period: period.toFixed(4),
      amplitude: amplitude.toFixed(2),
      phaseShift: phaseLabel,
      equation,
    }
  }, [func, amplitude, frequency, phase, verticalShift])

  const chartOptions: ApexOptions = {
    xaxis: {
      type: 'numeric',
      title: { text: 'x (radians)' },
      labels: {
        formatter: (val: string) => {
          const num = parseFloat(val)
          const piMultiple = num / Math.PI
          if (Math.abs(piMultiple) < 0.01) return '0'
          if (Math.abs(piMultiple - 1) < 0.05) return '\u03C0'
          if (Math.abs(piMultiple + 1) < 0.05) return '-\u03C0'
          if (Math.abs(piMultiple - 2) < 0.05) return '2\u03C0'
          if (Math.abs(piMultiple + 2) < 0.05) return '-2\u03C0'
          return num.toFixed(1)
        },
      },
      tickAmount: 8,
    },
    yaxis: {
      title: { text: 'y' },
      labels: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#ec4899'],
    tooltip: {
      x: {
        formatter: (val: number) => `x = ${val.toFixed(3)} rad`,
      },
    },
  }

  const series = [
    {
      name: results.equation,
      data: points
        .filter((p) => !isNaN(p.y))
        .map((p) => ({ x: p.x, y: p.y })),
    },
  ]

  return (
    <CalculatorShell
      title="Trigonometric Grapher"
      description="Visualize y = A\u00B7func(f\u00B7x + \u03C6) + d. Explore amplitude, frequency, phase shift, and vertical shift."
    >
      <GlassCard className="p-6">
        <div className="space-y-6">
          <SelectInput
            label="Trigonometric Function"
            value={func}
            onChange={setFunc}
            options={trigFunctions}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Amplitude (A)"
              value={amplitude}
              onChange={setAmplitude}
              min={0.1}
              max={5}
              step={0.1}
            />
            <SliderInput
              label="Frequency (f)"
              value={frequency}
              onChange={setFrequency}
              min={0.1}
              max={5}
              step={0.1}
            />
            <SliderInput
              label="Phase Shift (\u03C6)"
              value={phase}
              onChange={setPhase}
              min={-3.14}
              max={3.14}
              step={0.1}
            />
            <SliderInput
              label="Vertical Shift (d)"
              value={verticalShift}
              onChange={setVerticalShift}
              min={-5}
              max={5}
              step={0.5}
            />
          </div>
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Period" value={results.period} color="text-sky-500" />
        <ResultCard label="Amplitude" value={results.amplitude} color="text-pink-500" />
        <ResultCard label="Phase Shift" value={results.phaseShift} color="text-amber-500" />
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
