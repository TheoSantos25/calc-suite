import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { calculateTakeHomePay } from '@/utils/financial'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { US_STATES } from '@/utils/stateTaxData'

const filingStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married Filing Jointly' },
]

const payFrequencyOptions = [
  { value: 'weekly', label: 'Weekly (52/year)' },
  { value: 'biweekly', label: 'Bi-weekly (26/year)' },
  { value: 'monthly', label: 'Monthly (12/year)' },
]

const stateOptions = [
  { value: '', label: 'Federal Only (No State)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function TakeHomePayPage() {
  const [grossAnnualSalary, setGrossAnnualSalary] = useState(75000)
  const [filingStatus, setFilingStatus] = useState('single')
  const [payFrequency, setPayFrequency] = useState('biweekly')
  const [stateCode, setStateCode] = useState('')

  const results = useMemo(
    () => calculateTakeHomePay(grossAnnualSalary, filingStatus as 'single' | 'married', stateCode || undefined),
    [grossAnnualSalary, filingStatus, stateCode],
  )

  const netPerPeriod = useMemo(() => {
    switch (payFrequency) {
      case 'weekly':
        return results.netWeekly
      case 'biweekly':
        return results.netBiweekly
      case 'monthly':
        return results.netMonthly
      default:
        return results.netBiweekly
    }
  }, [payFrequency, results])

  const periodLabel = useMemo(() => {
    switch (payFrequency) {
      case 'weekly':
        return 'Net Weekly Pay'
      case 'biweekly':
        return 'Net Bi-weekly Pay'
      case 'monthly':
        return 'Net Monthly Pay'
      default:
        return 'Net Per Period'
    }
  }, [payFrequency])

  const donutSeries = useMemo(() => {
    const series = [
      Math.round(results.netAnnual),
      Math.round(results.federalTax),
      Math.round(results.socialSecurity),
      Math.round(results.medicare),
    ]
    if (results.stateTax > 0) series.push(Math.round(results.stateTax))
    return series
  }, [results])

  const donutLabels = useMemo(() => {
    const labels = ['Take-Home Pay', 'Federal Tax', 'Social Security', 'Medicare']
    if (results.stateTax > 0) labels.push('State Tax')
    return labels
  }, [results.stateTax])

  return (
    <CalculatorShell
      title="Take-Home Pay Calculator"
      description="Calculate your net pay after federal taxes, state taxes, Social Security, and Medicare deductions."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Gross Annual Salary"
            value={grossAnnualSalary}
            onChange={setGrossAnnualSalary}
            min={15000}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SelectInput
            label="Filing Status"
            value={filingStatus}
            onChange={setFilingStatus}
            options={filingStatusOptions}
          />
          <SelectInput
            label="State"
            value={stateCode}
            onChange={setStateCode}
            options={stateOptions}
          />
          <SelectInput
            label="Pay Frequency"
            value={payFrequency}
            onChange={setPayFrequency}
            options={payFrequencyOptions}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Net Annual Pay"
          value={formatCurrency(results.netAnnual)}
          color="text-emerald-500"
        />
        <ResultCard
          label={periodLabel}
          value={formatCurrency(netPerPeriod)}
          color="text-blue-500"
        />
        <ResultCard
          label="Federal Tax"
          value={formatCurrency(results.federalTax)}
          color="text-rose-500"
        />
        {results.stateTax > 0 && (
          <ResultCard
            label="State Tax"
            value={formatCurrency(results.stateTax)}
            color="text-amber-500"
          />
        )}
        <ResultCard
          label="FICA (SS + Medicare)"
          value={formatCurrency(results.fica)}
          color="text-orange-500"
        />
        <ResultCard
          label="Effective Tax Rate"
          value={formatPercent(results.effectiveRate)}
          color="text-purple-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Pay Breakdown
        </h3>
        <DonutChart
          series={donutSeries}
          labels={donutLabels}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
