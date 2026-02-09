import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { investmentGrowth } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function InvestmentGrowthPage() {
  const [principal, setPrincipal] = useState(50000)
  const [monthlyContribution, setMonthlyContribution] = useState(1000)
  const [annualReturn, setAnnualReturn] = useState(8)
  const [years, setYears] = useState(25)
  const [annualFee, setAnnualFee] = useState(0.5)
  const [inflationRate, setInflationRate] = useState(3)

  const results = useMemo(
    () =>
      investmentGrowth(
        principal,
        monthlyContribution,
        annualReturn,
        years,
        annualFee,
        inflationRate,
      ),
    [principal, monthlyContribution, annualReturn, years, annualFee, inflationRate],
  )

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const lineChartSeries = useMemo(
    () => [
      {
        name: 'Nominal Value',
        data: results.yearlyData.map((d) => Math.round(d.nominal)),
      },
      {
        name: 'Inflation-Adjusted Value',
        data: results.yearlyData.map((d) => Math.round(d.real)),
      },
    ],
    [results.yearlyData],
  )

  const totalGains = useMemo(
    () => Math.max(0, results.finalNominal - results.totalContributions),
    [results.finalNominal, results.totalContributions],
  )

  const donutSeries = useMemo(
    () => [Math.round(results.totalContributions), Math.round(totalGains)],
    [results.totalContributions, totalGains],
  )

  return (
    <CalculatorShell
      title="Investment Growth Calculator"
      description="Project your investment growth accounting for fees and inflation to see both nominal and real returns."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SliderInput
            label="Initial Investment"
            value={principal}
            onChange={setPrincipal}
            min={0}
            max={1000000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Monthly Contribution"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            min={0}
            max={10000}
            step={100}
            prefix="$"
          />
          <SliderInput
            label="Expected Annual Return"
            value={annualReturn}
            onChange={setAnnualReturn}
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
          <SliderInput
            label="Annual Fee"
            value={annualFee}
            onChange={setAnnualFee}
            min={0}
            max={3}
            step={0.05}
            suffix="%"
          />
          <SliderInput
            label="Inflation Rate"
            value={inflationRate}
            onChange={setInflationRate}
            min={0}
            max={10}
            step={0.1}
            suffix="%"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Nominal Value"
          value={formatCurrency(results.finalNominal)}
          color="text-emerald-500"
          subtitle={`After ${years} years`}
        />
        <ResultCard
          label="Inflation-Adjusted Value"
          value={formatCurrency(results.finalReal)}
          color="text-purple-500"
          subtitle="In today's dollars"
        />
        <ResultCard
          label="Total Contributions"
          value={formatCurrency(results.totalContributions)}
          color="text-blue-500"
          subtitle="Principal + deposits"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Nominal vs Inflation-Adjusted Growth
            </h3>
            <LineChart
              series={lineChartSeries}
              categories={chartCategories}
              height={300}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Contributions vs Investment Gains
            </h3>
            <DonutChart
              series={donutSeries}
              labels={['Total Contributions', 'Investment Gains']}
              height={300}
            />
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
