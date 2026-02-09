import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { salaryToHourly } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function SalaryToHourlyPage() {
  const [annualSalary, setAnnualSalary] = useState(75000)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)

  const results = useMemo(
    () => salaryToHourly(annualSalary, hoursPerWeek),
    [annualSalary, hoursPerWeek],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Pay Amount',
        data: [
          Math.round(results.hourly * 100) / 100,
          Math.round(results.daily * 100) / 100,
          Math.round(results.weekly),
          Math.round(results.biweekly),
          Math.round(results.monthly),
          Math.round(results.annual),
        ],
      },
    ],
    [results],
  )

  return (
    <CalculatorShell
      title="Salary to Hourly Calculator"
      description="Convert your annual salary into hourly, daily, weekly, bi-weekly, and monthly pay breakdowns."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Annual Salary"
            value={annualSalary}
            onChange={setAnnualSalary}
            min={15000}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Hours per Week"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            min={20}
            max={60}
            step={1}
            suffix="hrs"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Hourly"
          value={formatCurrency(results.hourly)}
          color="text-emerald-500"
        />
        <ResultCard
          label="Daily"
          value={formatCurrency(results.daily)}
          color="text-blue-500"
        />
        <ResultCard
          label="Weekly"
          value={formatCurrency(results.weekly)}
          color="text-purple-500"
        />
        <ResultCard
          label="Bi-weekly"
          value={formatCurrency(results.biweekly)}
          color="text-cyan-500"
        />
        <ResultCard
          label="Monthly"
          value={formatCurrency(results.monthly)}
          color="text-orange-500"
        />
        <ResultCard
          label="Annual"
          value={formatCurrency(results.annual)}
          color="text-slate-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Pay Breakdown by Period
        </h3>
        <BarChart
          series={chartSeries}
          categories={['Hourly', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Annual']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
