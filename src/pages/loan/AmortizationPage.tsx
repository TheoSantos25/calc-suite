import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { AmortizationTable } from '@/components/ui/AmortizationTable'
import { AreaChart } from '@/components/charts/AreaChart'
import { amortizationSchedule, solveLoanAmount } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

const termOptions = [
  { value: '5', label: '5 years' },
  { value: '10', label: '10 years' },
  { value: '15', label: '15 years' },
  { value: '20', label: '20 years' },
  { value: '25', label: '25 years' },
  { value: '30', label: '30 years' },
]

export default function AmortizationPage() {
  const [loanAmount, setLoanAmount] = useState(250000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTermYears, setLoanTermYears] = useState('30')

  const years = parseInt(loanTermYears)

  const schedule = useMemo(
    () => amortizationSchedule(loanAmount, interestRate, years),
    [loanAmount, interestRate, years],
  )

  const results = useMemo(() => {
    if (schedule.length === 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0 }
    }
    const monthlyPayment = schedule[0].payment
    const totalInterest = schedule[schedule.length - 1].totalInterest
    const totalPaid = loanAmount + totalInterest
    return { monthlyPayment, totalInterest, totalPaid }
  }, [schedule, loanAmount])

  const handleEditMonthlyPayment = (newPayment: number) => {
    const newLoanAmount = solveLoanAmount(newPayment, interestRate, years)
    if (newLoanAmount >= 10000 && newLoanAmount <= 1000000) {
      setLoanAmount(Math.round(newLoanAmount / 5000) * 5000)
    }
  }

  const yearlyChartData = useMemo(() => {
    const categories: string[] = []
    const principalData: number[] = []
    const interestData: number[] = []

    let yearPrincipal = 0
    let yearInterest = 0

    for (const row of schedule) {
      yearPrincipal += row.principal
      yearInterest += row.interest

      if (row.period % 12 === 0) {
        const yearNum = row.period / 12
        categories.push(`Year ${yearNum}`)
        principalData.push(Math.round(yearPrincipal))
        interestData.push(Math.round(yearInterest))
        yearPrincipal = 0
        yearInterest = 0
      }
    }

    // Handle remaining months that don't complete a full year
    if (schedule.length % 12 !== 0) {
      categories.push(`Year ${Math.ceil(schedule.length / 12)}`)
      principalData.push(Math.round(yearPrincipal))
      interestData.push(Math.round(yearInterest))
    }

    return {
      categories,
      series: [
        { name: 'Principal', data: principalData },
        { name: 'Interest', data: interestData },
      ],
    }
  }, [schedule])

  return (
    <CalculatorShell
      title="Amortization Calculator"
      description="View a full amortization schedule showing how each payment is split between principal and interest over the life of your loan."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={1000000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={15}
            step={0.125}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={loanTermYears}
            onChange={setLoanTermYears}
            options={termOptions}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Monthly Payment"
          value={formatCurrency(results.monthlyPayment)}
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
          label="Total Paid"
          value={formatCurrency(results.totalPaid)}
          color="text-blue-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Yearly Principal vs Interest Breakdown
        </h3>
        <AreaChart
          series={yearlyChartData.series}
          categories={yearlyChartData.categories}
          height={300}
        />
      </GlassCard>

      <AmortizationTable schedule={schedule} />
    </CalculatorShell>
  )
}
