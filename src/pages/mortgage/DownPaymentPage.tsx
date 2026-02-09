import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { downPaymentSavings } from '@/utils/financial'
import { formatCurrency, formatNumber } from '@/utils/formatters'

export default function DownPaymentPage() {
  const [homePrice, setHomePrice] = useState(350000)
  const [targetPercent, setTargetPercent] = useState(20)
  const [currentSavings, setCurrentSavings] = useState(15000)
  const [monthlySaving, setMonthlySaving] = useState(1000)
  const [savingsRate, setSavingsRate] = useState(4)

  const results = useMemo(() => {
    return downPaymentSavings(
      homePrice,
      targetPercent,
      currentSavings,
      monthlySaving,
      savingsRate,
    )
  }, [homePrice, targetPercent, currentSavings, monthlySaving, savingsRate])

  const yearsNeeded = useMemo(
    () => (results.monthsNeeded / 12).toFixed(1),
    [results.monthsNeeded],
  )

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Savings',
        data: results.yearlyData.map((d) => Math.round(d.savings)),
      },
      {
        name: 'Target',
        data: results.yearlyData.map(() => Math.round(results.target)),
      },
    ],
    [results.yearlyData, results.target],
  )

  return (
    <CalculatorShell
      title="Down Payment Calculator"
      description="Plan your savings strategy to reach your down payment goal for a home purchase."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Target Down Payment"
            value={targetPercent}
            onChange={setTargetPercent}
            min={3}
            max={30}
            step={1}
            suffix="%"
          />
          <NumberInput
            label="Current Savings"
            value={currentSavings}
            onChange={setCurrentSavings}
            prefix="$"
            min={0}
            max={500000}
            step={1000}
          />
          <SliderInput
            label="Monthly Savings"
            value={monthlySaving}
            onChange={setMonthlySaving}
            min={0}
            max={5000}
            step={50}
            prefix="$"
          />
          <SliderInput
            label="Savings Interest Rate"
            value={savingsRate}
            onChange={setSavingsRate}
            min={0}
            max={8}
            step={0.1}
            suffix="%"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Target Amount"
          value={formatCurrency(results.target)}
          color="text-emerald-500"
          subtitle={`${targetPercent}% of ${formatCurrency(homePrice)}`}
        />
        <ResultCard
          label="Months Needed"
          value={formatNumber(results.monthsNeeded)}
          color="text-blue-500"
          subtitle={results.monthsNeeded === 0 ? 'Already saved!' : 'To reach target'}
        />
        <ResultCard
          label="Years Needed"
          value={yearsNeeded}
          color="text-purple-500"
          subtitle={results.monthsNeeded === 0 ? 'Already saved!' : 'To reach target'}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Savings Growth Toward Target
        </h3>
        <LineChart
          series={chartSeries}
          categories={chartCategories}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
