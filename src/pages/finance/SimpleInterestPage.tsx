import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { AreaChart } from '@/components/charts/AreaChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { simpleInterest } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function SimpleInterestPage() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(5)
  const [years, setYears] = useState(10)

  const results = useMemo(
    () => simpleInterest(principal, rate, years),
    [principal, rate, years],
  )

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const areaChartSeries = useMemo(
    () => [
      {
        name: 'Total Balance',
        data: results.yearlyData.map((d) => Math.round(d.balance)),
      },
    ],
    [results.yearlyData],
  )

  const donutSeries = useMemo(
    () => [Math.round(principal), Math.round(results.interest)],
    [principal, results.interest],
  )

  return (
    <CalculatorShell
      title="Simple Interest Calculator"
      description="Calculate interest earned on a principal amount without compounding."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={0}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Annual Interest Rate"
            value={rate}
            onChange={setRate}
            min={0}
            max={20}
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
          label="Total Amount"
          value={formatCurrency(results.total)}
          color="text-emerald-500"
          subtitle={`After ${years} years`}
        />
        <ResultCard
          label="Interest Earned"
          value={formatCurrency(results.interest)}
          color="text-purple-500"
          subtitle="Simple interest"
        />
        <ResultCard
          label="Principal"
          value={formatCurrency(principal)}
          color="text-blue-500"
          subtitle="Initial investment"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Balance Growth
            </h3>
            <AreaChart
              series={areaChartSeries}
              categories={chartCategories}
              height={300}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Principal vs Interest
            </h3>
            <DonutChart
              series={donutSeries}
              labels={['Principal', 'Interest Earned']}
              height={300}
            />
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
