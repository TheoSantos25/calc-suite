import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { refinanceCalculator } from '@/utils/financial'
import { formatCurrency, formatNumber } from '@/utils/formatters'

const newTermOptions = [
  { value: '180', label: '15 Years (180 months)' },
  { value: '360', label: '30 Years (360 months)' },
]

export default function RefinancePage() {
  const [currentBalance, setCurrentBalance] = useState(250000)
  const [currentRate, setCurrentRate] = useState(7)
  const [currentRemainingMonths, setCurrentRemainingMonths] = useState(300)
  const [newRate, setNewRate] = useState(5.5)
  const [newTermMonths, setNewTermMonths] = useState('360')
  const [closingCosts, setClosingCosts] = useState(5000)

  const results = useMemo(() => {
    return refinanceCalculator(
      currentBalance,
      currentRate,
      currentRemainingMonths,
      newRate,
      parseInt(newTermMonths),
      closingCosts,
    )
  }, [currentBalance, currentRate, currentRemainingMonths, newRate, newTermMonths, closingCosts])

  const maxMonths = useMemo(
    () => Math.max(currentRemainingMonths, parseInt(newTermMonths)),
    [currentRemainingMonths, newTermMonths],
  )

  const chartCategories = useMemo(() => {
    const years = Math.ceil(maxMonths / 12)
    return Array.from({ length: years }, (_, i) => `Year ${i + 1}`)
  }, [maxMonths])

  const chartSeries = useMemo(() => {
    const years = Math.ceil(maxMonths / 12)
    const currentCumulative: number[] = []
    const newCumulative: number[] = []

    let currentTotal = 0
    let newTotal = closingCosts

    for (let year = 1; year <= years; year++) {
      const monthsThisYear = Math.min(12, currentRemainingMonths - (year - 1) * 12)
      if (monthsThisYear > 0) {
        currentTotal += results.currentPayment * monthsThisYear
      }
      currentCumulative.push(Math.round(currentTotal))

      const newMonthsThisYear = Math.min(12, parseInt(newTermMonths) - (year - 1) * 12)
      if (newMonthsThisYear > 0) {
        newTotal += results.newPayment * newMonthsThisYear
      }
      newCumulative.push(Math.round(newTotal))
    }

    return [
      { name: 'Current Loan', data: currentCumulative },
      { name: 'Refinanced Loan', data: newCumulative },
    ]
  }, [maxMonths, currentRemainingMonths, newTermMonths, results.currentPayment, results.newPayment, closingCosts])

  return (
    <CalculatorShell
      title="Refinance Calculator"
      description="Compare your current mortgage to a refinanced loan and find your break-even point."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Current Balance"
            value={currentBalance}
            onChange={setCurrentBalance}
            min={50000}
            max={1000000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Current Rate"
            value={currentRate}
            onChange={setCurrentRate}
            min={0}
            max={12}
            step={0.125}
            suffix="%"
          />
          <SliderInput
            label="Remaining Months"
            value={currentRemainingMonths}
            onChange={setCurrentRemainingMonths}
            min={12}
            max={360}
            step={12}
          />
          <SliderInput
            label="New Rate"
            value={newRate}
            onChange={setNewRate}
            min={0}
            max={12}
            step={0.125}
            suffix="%"
          />
          <SelectInput
            label="New Loan Term"
            value={newTermMonths}
            onChange={setNewTermMonths}
            options={newTermOptions}
          />
          <NumberInput
            label="Closing Costs"
            value={closingCosts}
            onChange={setClosingCosts}
            prefix="$"
            min={0}
            max={20000}
            step={500}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Current Payment"
          value={formatCurrency(results.currentPayment)}
          color="text-slate-500"
          subtitle="Monthly"
        />
        <ResultCard
          label="New Payment"
          value={formatCurrency(results.newPayment)}
          color="text-emerald-500"
          subtitle="Monthly"
        />
        <ResultCard
          label="Monthly Savings"
          value={formatCurrency(results.monthlySavings)}
          color="text-blue-500"
          subtitle={results.monthlySavings > 0 ? 'You save each month' : 'Higher payment'}
        />
        <ResultCard
          label="Break-Even"
          value={results.breakEvenMonths === Infinity ? 'N/A' : `${formatNumber(results.breakEvenMonths)} months`}
          color="text-purple-500"
          subtitle={results.breakEvenMonths === Infinity ? 'No savings' : 'To recoup closing costs'}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Cumulative Cost Comparison
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
