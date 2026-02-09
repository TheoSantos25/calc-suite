import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { AreaChart } from '@/components/charts/AreaChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { compoundInterest } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly (12x/year)' },
  { value: 'quarterly', label: 'Quarterly (4x/year)' },
  { value: 'annually', label: 'Annually (1x/year)' },
]

const frequencyMap: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  annually: 1,
}

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualRate, setAnnualRate] = useState(7)
  const [years, setYears] = useState(20)
  const [frequency, setFrequency] = useState('monthly')

  const results = useMemo(() => {
    const compoundsPerYear = frequencyMap[frequency] ?? 12
    return compoundInterest(principal, annualRate, compoundsPerYear, years, monthlyContribution)
  }, [principal, annualRate, frequency, years, monthlyContribution])

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const areaChartSeries = useMemo(
    () => [
      {
        name: 'Total Contributions',
        data: results.yearlyData.map((d) => Math.round(d.contributions)),
      },
      {
        name: 'Interest Earned',
        data: results.yearlyData.map((d) => Math.round(d.interest)),
      },
    ],
    [results.yearlyData],
  )

  const donutSeries = useMemo(
    () => [Math.round(results.totalContributions), Math.round(results.totalInterest)],
    [results.totalContributions, results.totalInterest],
  )

  return (
    <CalculatorShell
      title="Compound Interest Calculator"
      description="See how your savings grow over time with the power of compound interest and regular contributions."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Initial Principal"
            value={principal}
            onChange={setPrincipal}
            min={0}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Monthly Contribution"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            min={0}
            max={5000}
            step={50}
            prefix="$"
          />
          <SliderInput
            label="Annual Interest Rate"
            value={annualRate}
            onChange={setAnnualRate}
            min={0}
            max={20}
            step={0.1}
            suffix="%"
          />
          <SliderInput
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            step={1}
            suffix="years"
          />
          <SelectInput
            label="Compounding Frequency"
            value={frequency}
            onChange={setFrequency}
            options={frequencyOptions}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Final Balance"
          value={formatCurrency(results.finalBalance)}
          color="text-emerald-500"
          subtitle={`After ${years} years`}
        />
        <ResultCard
          label="Total Contributions"
          value={formatCurrency(results.totalContributions)}
          color="text-blue-500"
          subtitle="Principal + deposits"
        />
        <ResultCard
          label="Total Interest Earned"
          value={formatCurrency(results.totalInterest)}
          color="text-purple-500"
          subtitle="From compounding"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Growth Over Time
            </h3>
            <AreaChart
              series={areaChartSeries}
              categories={chartCategories}
              height={300}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Contributions vs Interest
            </h3>
            <DonutChart
              series={donutSeries}
              labels={['Total Contributions', 'Interest Earned']}
              height={300}
            />
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
