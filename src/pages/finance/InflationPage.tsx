import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { inflationAdjusted } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function InflationPage() {
  const [currentAmount, setCurrentAmount] = useState(100000)
  const [inflationRate, setInflationRate] = useState(3)
  const [years, setYears] = useState(20)

  const results = useMemo(
    () => inflationAdjusted(currentAmount, inflationRate, years),
    [currentAmount, inflationRate, years],
  )

  const purchasingPowerLost = useMemo(
    () => currentAmount - results.futureValue,
    [currentAmount, results.futureValue],
  )

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const lineChartSeries = useMemo(
    () => [
      {
        name: 'Purchasing Power',
        data: results.yearlyData.map((d) => Math.round(d.value)),
      },
    ],
    [results.yearlyData],
  )

  return (
    <CalculatorShell
      title="Inflation Calculator"
      description="See how inflation erodes your purchasing power over time."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Current Amount"
            value={currentAmount}
            onChange={setCurrentAmount}
            min={0}
            max={1000000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Annual Inflation Rate"
            value={inflationRate}
            onChange={setInflationRate}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
          />
          <SliderInput
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            step={1}
            suffix="years"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Future Purchasing Power"
          value={formatCurrency(results.futureValue)}
          color="text-emerald-500"
          subtitle={`What ${formatCurrency(currentAmount)} buys in ${years} years`}
        />
        <ResultCard
          label="Purchasing Power Lost"
          value={formatCurrency(purchasingPowerLost)}
          color="text-red-500"
          subtitle={`${((purchasingPowerLost / currentAmount) * 100).toFixed(1)}% reduction`}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Purchasing Power Over Time
        </h3>
        <LineChart
          series={lineChartSeries}
          categories={chartCategories}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
