import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { aprCalculator } from '@/utils/financial'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function APRPage() {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [totalFees, setTotalFees] = useState(1500)
  const [interestRate, setInterestRate] = useState(6.5)
  const [termMonths, setTermMonths] = useState('60')

  const results = useMemo(() => {
    return aprCalculator(loanAmount, totalFees, interestRate, parseInt(termMonths))
  }, [loanAmount, totalFees, interestRate, termMonths])

  return (
    <CalculatorShell
      title="APR Calculator"
      description="Calculate the true Annual Percentage Rate (APR) of a loan by factoring in fees and closing costs."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={1000}
            max={500000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Total Fees"
            value={totalFees}
            onChange={setTotalFees}
            min={0}
            max={20000}
            step={100}
            prefix="$"
          />
          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={20}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={termMonths}
            onChange={setTermMonths}
            options={[
              { value: '12', label: '12 months (1 year)' },
              { value: '24', label: '24 months (2 years)' },
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '120', label: '120 months (10 years)' },
              { value: '180', label: '180 months (15 years)' },
              { value: '240', label: '240 months (20 years)' },
              { value: '360', label: '360 months (30 years)' },
            ]}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="True APR"
          value={formatPercent(results.apr)}
          color="text-emerald-500"
        />
        <ResultCard
          label="Nominal Rate"
          value={formatPercent(results.nominalRate)}
          color="text-slate-500"
        />
        <ResultCard
          label="Monthly Payment"
          value={formatCurrency(results.monthlyPayment)}
          color="text-blue-500"
        />
        <ResultCard
          label="Total Fees"
          value={formatCurrency(results.totalFees)}
          color="text-orange-500"
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(results.totalInterest)}
          color="text-rose-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Nominal Rate vs True APR
        </h3>
        <BarChart
          series={[
            {
              name: 'Rate (%)',
              data: [
                parseFloat(results.nominalRate.toFixed(2)),
                parseFloat(results.apr.toFixed(2)),
              ],
            },
          ]}
          categories={['Nominal Rate', 'True APR']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
