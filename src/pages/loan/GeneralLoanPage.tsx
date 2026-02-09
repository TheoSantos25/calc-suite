import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { monthlyMortgagePayment, amortizationSchedule, solveLoanAmountFromMonths } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

const termOptions = [
  { value: '12', label: '12 months (1 year)' },
  { value: '24', label: '24 months (2 years)' },
  { value: '36', label: '36 months (3 years)' },
  { value: '48', label: '48 months (4 years)' },
  { value: '60', label: '60 months (5 years)' },
  { value: '84', label: '84 months (7 years)' },
  { value: '120', label: '120 months (10 years)' },
  { value: '180', label: '180 months (15 years)' },
  { value: '240', label: '240 months (20 years)' },
  { value: '360', label: '360 months (30 years)' },
]

export default function GeneralLoanPage() {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [interestRate, setInterestRate] = useState(7)
  const [loanTermMonths, setLoanTermMonths] = useState('60')

  const termMonths = parseInt(loanTermMonths)
  const termYears = termMonths / 12

  const results = useMemo(() => {
    const monthly = monthlyMortgagePayment(loanAmount, interestRate, termYears)
    const schedule = amortizationSchedule(loanAmount, interestRate, termYears)
    const totalPaid = monthly * termMonths
    const totalInterest = totalPaid - loanAmount

    return { monthly, totalInterest, totalPaid, schedule }
  }, [loanAmount, interestRate, termYears, termMonths])

  const handleEditMonthlyPayment = (newPayment: number) => {
    const newLoanAmount = solveLoanAmountFromMonths(newPayment, interestRate, termMonths)
    if (newLoanAmount >= 1000 && newLoanAmount <= 1000000) {
      setLoanAmount(Math.round(newLoanAmount / 1000) * 1000)
    }
  }

  const balanceChartData = useMemo(() => {
    const schedule = results.schedule
    const categories: string[] = []
    const balances: number[] = []

    // Sample at yearly intervals (or every 12 months)
    for (let i = 11; i < schedule.length; i += 12) {
      categories.push(`Year ${Math.floor(i / 12) + 1}`)
      balances.push(Math.round(schedule[i].balance))
    }

    // Include final month if it doesn't fall on a year boundary
    if (schedule.length % 12 !== 0 && schedule.length > 0) {
      categories.push(`Year ${Math.ceil(schedule.length / 12)}`)
      balances.push(Math.round(schedule[schedule.length - 1].balance))
    }

    return { categories, balances }
  }, [results.schedule])

  return (
    <CalculatorShell
      title="General Loan Calculator"
      description="Calculate monthly payments, total interest, and visualize the payoff schedule for any type of loan."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={1000}
            max={1000000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={25}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={loanTermMonths}
            onChange={setLoanTermMonths}
            options={termOptions}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Monthly Payment"
          value={formatCurrency(results.monthly)}
          color="text-emerald-500"
          editable
          onEdit={handleEditMonthlyPayment}
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(results.totalInterest)}
          color="text-rose-500"
        />
        <ResultCard
          label="Total Cost"
          value={formatCurrency(results.totalPaid)}
          color="text-blue-500"
        />
      </ResultGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Principal vs Interest
          </h3>
          <DonutChart
            series={[Math.round(loanAmount), Math.round(results.totalInterest)]}
            labels={['Principal', 'Interest']}
            height={300}
          />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Balance Over Time
          </h3>
          <AreaChart
            series={[{ name: 'Remaining Balance', data: balanceChartData.balances }]}
            categories={balanceChartData.categories}
            height={300}
          />
        </GlassCard>
      </div>
    </CalculatorShell>
  )
}
