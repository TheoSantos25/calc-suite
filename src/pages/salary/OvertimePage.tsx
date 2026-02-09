import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { BarChart } from '@/components/charts/BarChart'
import { overtimeCalculator } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

const multiplierOptions = [
  { value: '1.5', label: '1.5x (Time and a half)' },
  { value: '2', label: '2x (Double time)' },
  { value: '2.5', label: '2.5x (Double time and a half)' },
]

export default function OvertimePage() {
  const [hourlyRate, setHourlyRate] = useState(25)
  const [regularHours, setRegularHours] = useState(40)
  const [overtimeHours, setOvertimeHours] = useState(5)
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5')

  const multiplier = parseFloat(overtimeMultiplier)

  const results = useMemo(
    () => overtimeCalculator(hourlyRate, regularHours, overtimeHours, multiplier),
    [hourlyRate, regularHours, overtimeHours, multiplier],
  )

  const regularOnlyWeekly = useMemo(
    () => hourlyRate * regularHours,
    [hourlyRate, regularHours],
  )

  const donutSeries = useMemo(
    () => [Math.round(results.regularPay), Math.round(results.overtimePay)],
    [results.regularPay, results.overtimePay],
  )

  const barSeries = useMemo(
    () => [
      {
        name: 'Without Overtime',
        data: [Math.round(regularOnlyWeekly)],
      },
      {
        name: 'With Overtime',
        data: [Math.round(results.totalWeekly)],
      },
    ],
    [regularOnlyWeekly, results.totalWeekly],
  )

  return (
    <CalculatorShell
      title="Overtime Calculator"
      description="Calculate your overtime pay and see how extra hours impact your weekly, monthly, and annual earnings."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Hourly Rate"
            value={hourlyRate}
            onChange={setHourlyRate}
            min={7}
            max={150}
            step={0.5}
            prefix="$"
          />
          <SliderInput
            label="Regular Hours per Week"
            value={regularHours}
            onChange={setRegularHours}
            min={20}
            max={50}
            step={1}
            suffix="hrs"
          />
          <SliderInput
            label="Overtime Hours per Week"
            value={overtimeHours}
            onChange={setOvertimeHours}
            min={0}
            max={40}
            step={1}
            suffix="hrs"
          />
          <SelectInput
            label="Overtime Multiplier"
            value={overtimeMultiplier}
            onChange={setOvertimeMultiplier}
            options={multiplierOptions}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Regular Pay"
          value={formatCurrency(results.regularPay)}
          color="text-slate-500"
          subtitle="Per week"
        />
        <ResultCard
          label="Overtime Pay"
          value={formatCurrency(results.overtimePay)}
          color="text-emerald-500"
          subtitle="Per week"
        />
        <ResultCard
          label="Total Weekly"
          value={formatCurrency(results.totalWeekly)}
          color="text-blue-500"
        />
        <ResultCard
          label="Total Annual"
          value={formatCurrency(results.totalAnnual)}
          color="text-purple-500"
        />
        <ResultCard
          label="Effective Hourly Rate"
          value={formatCurrency(results.effectiveHourlyRate)}
          color="text-cyan-500"
        />
      </ResultGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Regular vs Overtime Pay
          </h3>
          <DonutChart
            series={donutSeries}
            labels={['Regular Pay', 'Overtime Pay']}
            height={300}
          />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Weekly Earnings Comparison
          </h3>
          <BarChart
            series={barSeries}
            categories={['Weekly Pay']}
            height={300}
          />
        </GlassCard>
      </div>
    </CalculatorShell>
  )
}
