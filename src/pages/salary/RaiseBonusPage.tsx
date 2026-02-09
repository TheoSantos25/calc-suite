import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { raiseCalculator } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function RaiseBonusPage() {
  const [currentSalary, setCurrentSalary] = useState(75000)
  const [raisePercent, setRaisePercent] = useState(5)
  const [bonusPercent, setBonusPercent] = useState(10)

  const results = useMemo(
    () => raiseCalculator(currentSalary, raisePercent, bonusPercent),
    [currentSalary, raisePercent, bonusPercent],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Compensation',
        data: [
          Math.round(results.currentSalary),
          Math.round(results.newSalary),
          Math.round(results.totalCompensation),
        ],
      },
    ],
    [results],
  )

  return (
    <CalculatorShell
      title="Raise & Bonus Calculator"
      description="Calculate the impact of a salary raise and bonus on your total compensation."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Current Salary"
            value={currentSalary}
            onChange={setCurrentSalary}
            min={20000}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Raise Percentage"
            value={raisePercent}
            onChange={setRaisePercent}
            min={0}
            max={30}
            step={0.5}
            suffix="%"
          />
          <SliderInput
            label="Bonus Percentage"
            value={bonusPercent}
            onChange={setBonusPercent}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="New Salary"
          value={formatCurrency(results.newSalary)}
          color="text-emerald-500"
        />
        <ResultCard
          label="Raise Amount"
          value={formatCurrency(results.raiseAmount)}
          color="text-blue-500"
          subtitle="Annual increase"
        />
        <ResultCard
          label="Bonus Amount"
          value={formatCurrency(results.bonusAmount)}
          color="text-purple-500"
        />
        <ResultCard
          label="Total Compensation"
          value={formatCurrency(results.totalCompensation)}
          color="text-cyan-500"
          subtitle="Salary + Bonus"
        />
        <ResultCard
          label="Monthly Increase"
          value={formatCurrency(results.monthlyIncrease)}
          color="text-orange-500"
          subtitle="Per month raise"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Compensation Comparison
        </h3>
        <BarChart
          series={chartSeries}
          categories={['Current Salary', 'New Salary', 'Total Compensation']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
