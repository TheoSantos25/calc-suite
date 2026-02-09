import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { carLoan, amortizationSchedule, solveLoanAmountFromMonths } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { getSuggestedRate, CreditScoreBadge } from '@/utils/creditScoreRates'

export default function PersonalLoanPage() {
  const [loanAmount, setLoanAmount] = useState(15000)
  const [interestRate, setInterestRate] = useState(10)
  const [loanTerm, setLoanTerm] = useState('36')
  const [creditScore, setCreditScore] = useState(720)

  const termMonths = parseInt(loanTerm)

  const handleCreditScoreChange = (score: number) => {
    setCreditScore(score)
    const suggested = getSuggestedRate(score, 'personal')
    setInterestRate(suggested.typical)
  }

  const results = useMemo(() => {
    return carLoan(loanAmount, 0, interestRate, termMonths)
  }, [loanAmount, interestRate, termMonths])

  const totalRepayment = results.monthlyPayment * termMonths

  const handleEditMonthlyPayment = (newPayment: number) => {
    const newLoanAmount = solveLoanAmountFromMonths(newPayment, interestRate, termMonths)
    if (newLoanAmount >= 1000 && newLoanAmount <= 100000) {
      setLoanAmount(Math.round(newLoanAmount / 500) * 500)
    }
  }

  const balanceData = useMemo(() => {
    const termYears = termMonths / 12
    const schedule = amortizationSchedule(loanAmount, interestRate, termYears)
    const balances: number[] = []
    const categories: string[] = []

    const step = Math.max(1, Math.floor(schedule.length / 30))
    for (let i = 0; i < schedule.length; i += step) {
      balances.push(Math.round(schedule[i].balance))
      categories.push(`Mo ${schedule[i].period}`)
    }
    const last = schedule[schedule.length - 1]
    if (categories[categories.length - 1] !== `Mo ${last.period}`) {
      balances.push(Math.round(last.balance))
      categories.push(`Mo ${last.period}`)
    }

    return { balances, categories }
  }, [loanAmount, interestRate, termMonths])

  return (
    <CalculatorShell
      title="Personal Loan Calculator"
      description="Calculate monthly payments, total interest, and visualize payoff for personal loans."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={1000}
            max={100000}
            step={500}
            prefix="$"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Credit Score</span>
              <CreditScoreBadge score={creditScore} />
            </div>
            <SliderInput
              label=""
              value={creditScore}
              onChange={handleCreditScoreChange}
              min={300}
              max={850}
              step={5}
            />
          </div>
          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={30}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={loanTerm}
            onChange={setLoanTerm}
            options={[
              { value: '12', label: '12 months (1 year)' },
              { value: '24', label: '24 months (2 years)' },
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '72', label: '72 months (6 years)' },
              { value: '84', label: '84 months (7 years)' },
            ]}
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
          label="Total Repayment"
          value={formatCurrency(totalRepayment)}
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
            Loan Balance Over Time
          </h3>
          <AreaChart
            series={[{ name: 'Balance', data: balanceData.balances }]}
            categories={balanceData.categories}
            height={300}
          />
        </GlassCard>
      </div>
    </CalculatorShell>
  )
}
