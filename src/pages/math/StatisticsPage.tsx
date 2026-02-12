import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

export default function StatisticsPage() {
  const [input, setInput] = useState('10, 20, 30, 40, 50, 30, 25')

  const results = useMemo(() => {
    const numbers = input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '' && !isNaN(Number(s)))
      .map(Number)

    if (numbers.length === 0) {
      return {
        count: 0,
        sum: 'N/A',
        mean: 'N/A',
        median: 'N/A',
        mode: 'N/A',
        range: 'N/A',
        variance: 'N/A',
        stdDev: 'N/A',
        min: 'N/A',
        max: 'N/A',
      }
    }

    const count = numbers.length
    const sum = numbers.reduce((acc, n) => acc + n, 0)
    const mean = sum / count
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const range = max - min

    // Median
    const sorted = [...numbers].sort((a, b) => a - b)
    let median: number
    if (count % 2 === 0) {
      median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    } else {
      median = sorted[Math.floor(count / 2)]
    }

    // Mode
    const freqMap = new Map<number, number>()
    for (const n of numbers) {
      freqMap.set(n, (freqMap.get(n) || 0) + 1)
    }
    const maxFreq = Math.max(...freqMap.values())
    let modeStr: string
    if (maxFreq === 1) {
      modeStr = 'No mode'
    } else {
      const modes = Array.from(freqMap.entries())
        .filter(([, freq]) => freq === maxFreq)
        .map(([val]) => val)
      modeStr = modes.join(', ')
    }

    // Variance (population)
    const variance =
      numbers.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count
    const stdDev = Math.sqrt(variance)

    return {
      count,
      sum: sum.toFixed(4),
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: modeStr,
      range: range.toFixed(4),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      min: min.toFixed(4),
      max: max.toFixed(4),
    }
  }, [input])

  return (
    <CalculatorShell
      title="Statistics Calculator"
      description="Enter a set of numbers to calculate common statistical measures including mean, median, mode, variance, and more."
    >
      <GlassCard className="p-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
            Enter numbers (comma-separated)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 10, 20, 30, 40, 50"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {results.count} number{results.count !== 1 ? 's' : ''} detected
          </p>
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Count"
          value={results.count.toString()}
          color="text-pink-500"
        />
        <ResultCard
          label="Sum"
          value={results.sum}
          color="text-purple-500"
        />
        <ResultCard
          label="Mean (Average)"
          value={results.mean}
          color="text-blue-500"
        />
        <ResultCard
          label="Median"
          value={results.median}
          color="text-emerald-500"
        />
        <ResultCard
          label="Mode"
          value={results.mode}
          color="text-amber-500"
        />
        <ResultCard
          label="Range"
          value={results.range}
          color="text-pink-500"
        />
        <ResultCard
          label="Variance"
          value={results.variance}
          color="text-purple-500"
        />
        <ResultCard
          label="Standard Deviation"
          value={results.stdDev}
          color="text-blue-500"
        />
        <ResultCard
          label="Minimum"
          value={results.min}
          color="text-emerald-500"
        />
        <ResultCard
          label="Maximum"
          value={results.max}
          color="text-amber-500"
        />
      </ResultGrid>
    </CalculatorShell>
  )
}
