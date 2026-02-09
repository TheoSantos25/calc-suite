import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { calculateTip } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

const tipPresets = [15, 18, 20, 25]

export default function TipPage() {
  const [billAmount, setBillAmount] = useState(50)
  const [tipPercent, setTipPercent] = useState(18)
  const [numPeople, setNumPeople] = useState(1)

  const results = useMemo(() => {
    return calculateTip(billAmount, tipPercent, numPeople)
  }, [billAmount, tipPercent, numPeople])

  const donutSeries = useMemo(
    () => [Math.round(billAmount * 100) / 100, Math.round(results.tipAmount * 100) / 100],
    [billAmount, results.tipAmount],
  )

  return (
    <CalculatorShell
      title="Tip Calculator"
      description="Calculate tips, split bills between people, and see a breakdown of your total."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Bill Amount"
            value={billAmount}
            onChange={setBillAmount}
            prefix="$"
            min={0}
            max={10000}
            step={0.01}
          />
          <div className="space-y-1.5">
            <SliderInput
              label="Tip Percentage"
              value={tipPercent}
              onChange={setTipPercent}
              min={0}
              max={50}
              step={1}
              suffix="%"
            />
            <div className="flex gap-2 mt-3">
              {tipPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTipPercent(preset)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    tipPercent === preset
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
          <SliderInput
            label="Number of People"
            value={numPeople}
            onChange={setNumPeople}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Tip Amount"
          value={formatCurrency(results.tipAmount)}
          color="text-emerald-500"
        />
        <ResultCard
          label="Total Bill"
          value={formatCurrency(results.total)}
          color="text-blue-500"
        />
        <ResultCard
          label="Per Person Total"
          value={formatCurrency(results.perPerson)}
          color="text-purple-500"
          subtitle={numPeople > 1 ? `Split ${numPeople} ways` : 'Single diner'}
        />
        <ResultCard
          label="Tip Per Person"
          value={formatCurrency(results.tipPerPerson)}
          color="text-cyan-500"
          subtitle={numPeople > 1 ? `Split ${numPeople} ways` : 'Single diner'}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Bill vs Tip
        </h3>
        <DonutChart
          series={donutSeries}
          labels={['Bill Amount', 'Tip Amount']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
