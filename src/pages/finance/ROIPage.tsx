import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { roi } from '@/utils/financial'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function ROIPage() {
  const [initialInvestment, setInitialInvestment] = useState(50000)
  const [finalValue, setFinalValue] = useState(75000)

  const results = useMemo(
    () => roi(initialInvestment, finalValue),
    [initialInvestment, finalValue],
  )

  const isPositive = results.roiPercent >= 0

  const barChartSeries = useMemo(
    () => [
      {
        name: 'Amount',
        data: [Math.round(initialInvestment), Math.round(finalValue)],
      },
    ],
    [initialInvestment, finalValue],
  )

  return (
    <CalculatorShell
      title="ROI Calculator"
      description="Calculate the return on investment to evaluate the profitability of an investment."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Initial Investment"
            value={initialInvestment}
            onChange={setInitialInvestment}
            prefix="$"
            min={0}
            max={10000000}
            step={1000}
          />
          <NumberInput
            label="Final Value"
            value={finalValue}
            onChange={setFinalValue}
            prefix="$"
            min={0}
            max={10000000}
            step={1000}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="ROI Percentage"
          value={formatPercent(results.roiPercent)}
          color={isPositive ? 'text-emerald-500' : 'text-red-500'}
          subtitle={isPositive ? 'Positive return' : 'Negative return'}
        />
        <ResultCard
          label={isPositive ? 'Net Gain' : 'Net Loss'}
          value={formatCurrency(Math.abs(results.gain))}
          color={isPositive ? 'text-emerald-500' : 'text-red-500'}
          subtitle={isPositive ? 'Profit earned' : 'Loss incurred'}
        />
        <ResultCard
          label="Initial Investment"
          value={formatCurrency(initialInvestment)}
          color="text-blue-500"
          subtitle="Starting amount"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Initial Investment vs Final Value
        </h3>
        <BarChart
          series={barChartSeries}
          categories={['Initial Investment', 'Final Value']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
