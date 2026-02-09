import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { percentageCalculator } from '@/utils/financial'
import { formatNumber } from '@/utils/formatters'

type Mode = 'whatIs' | 'whatPercent' | 'ofWhat'

const modes: { value: Mode; label: string }[] = [
  { value: 'whatIs', label: 'What is X% of Y?' },
  { value: 'whatPercent', label: 'X is what % of Y?' },
  { value: 'ofWhat', label: 'X is Y% of what?' },
]

export default function PercentagePage() {
  const [mode, setMode] = useState<Mode>('whatIs')
  const [inputX, setInputX] = useState(25)
  const [inputY, setInputY] = useState(200)

  const result = useMemo(() => {
    return percentageCalculator(mode, inputX, inputY)
  }, [mode, inputX, inputY])

  const resultLabel = useMemo(() => {
    switch (mode) {
      case 'whatIs':
        return `${inputX}% of ${formatNumber(inputY, 2)} is`
      case 'whatPercent':
        return `${formatNumber(inputX, 2)} is this % of ${formatNumber(inputY, 2)}`
      case 'ofWhat':
        return `${formatNumber(inputY, 2)} is ${inputX}% of`
    }
  }, [mode, inputX, inputY])

  const resultValue = useMemo(() => {
    if (mode === 'whatPercent') {
      return `${formatNumber(result, 2)}%`
    }
    return formatNumber(result, 2)
  }, [mode, result])

  return (
    <CalculatorShell
      title="Percentage Calculator"
      description="Quickly calculate percentages with three common modes: find a percentage, find what percent, or find the total."
    >
      <GlassCard className="p-6">
        <div className="flex gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mode === 'whatIs' && (
            <>
              <NumberInput
                label="Percentage (%)"
                value={inputX}
                onChange={setInputX}
                suffix="%"
              />
              <NumberInput
                label="Amount"
                value={inputY}
                onChange={setInputY}
              />
            </>
          )}
          {mode === 'whatPercent' && (
            <>
              <NumberInput
                label="Value"
                value={inputX}
                onChange={setInputX}
              />
              <NumberInput
                label="Total"
                value={inputY}
                onChange={setInputY}
              />
            </>
          )}
          {mode === 'ofWhat' && (
            <>
              <NumberInput
                label="Percentage (%)"
                value={inputX}
                onChange={setInputX}
                suffix="%"
              />
              <NumberInput
                label="Value"
                value={inputY}
                onChange={setInputY}
              />
            </>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-8">
        <ResultCard
          label={resultLabel}
          value={resultValue}
          color="text-emerald-500"
        />
      </GlassCard>
    </CalculatorShell>
  )
}
