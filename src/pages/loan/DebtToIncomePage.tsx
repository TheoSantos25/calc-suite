import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { debtToIncomeRatio } from '@/utils/financial'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function DebtToIncomePage() {
  const [monthlyIncome, setMonthlyIncome] = useState(6000)
  const [mortgage, setMortgage] = useState(1500)
  const [carPayment, setCarPayment] = useState(400)
  const [studentLoans, setStudentLoans] = useState(300)
  const [creditCards, setCreditCards] = useState(200)
  const [otherDebts, setOtherDebts] = useState(0)

  const results = useMemo(() => {
    const totalDebts = mortgage + carPayment + studentLoans + creditCards + otherDebts
    const ratio = debtToIncomeRatio(totalDebts, monthlyIncome)
    const remainingIncome = monthlyIncome - totalDebts

    let ratingColor: string
    let ratingLabel: string
    if (ratio < 36) {
      ratingColor = 'text-emerald-500'
      ratingLabel = 'Good'
    } else if (ratio <= 43) {
      ratingColor = 'text-yellow-500'
      ratingLabel = 'Caution'
    } else {
      ratingColor = 'text-rose-500'
      ratingLabel = 'High Risk'
    }

    let barColor: string
    if (ratio < 36) {
      barColor = 'bg-emerald-500'
    } else if (ratio <= 43) {
      barColor = 'bg-yellow-500'
    } else {
      barColor = 'bg-rose-500'
    }

    return { totalDebts, ratio, remainingIncome, ratingColor, ratingLabel, barColor }
  }, [monthlyIncome, mortgage, carPayment, studentLoans, creditCards, otherDebts])

  const donutSeries = useMemo(
    () => [Math.round(results.totalDebts), Math.max(0, Math.round(results.remainingIncome))],
    [results.totalDebts, results.remainingIncome],
  )

  return (
    <CalculatorShell
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your debt-to-income ratio to understand your financial health and borrowing capacity."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <SliderInput
              label="Monthly Gross Income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              min={1000}
              max={30000}
              step={250}
              prefix="$"
            />
          </div>
          <NumberInput
            label="Mortgage / Rent"
            value={mortgage}
            onChange={setMortgage}
            prefix="$"
            min={0}
            max={10000}
            step={50}
          />
          <NumberInput
            label="Car Payment"
            value={carPayment}
            onChange={setCarPayment}
            prefix="$"
            min={0}
            max={2000}
            step={25}
          />
          <NumberInput
            label="Student Loans"
            value={studentLoans}
            onChange={setStudentLoans}
            prefix="$"
            min={0}
            max={3000}
            step={25}
          />
          <NumberInput
            label="Credit Cards"
            value={creditCards}
            onChange={setCreditCards}
            prefix="$"
            min={0}
            max={2000}
            step={25}
          />
          <NumberInput
            label="Other Debts"
            value={otherDebts}
            onChange={setOtherDebts}
            prefix="$"
            min={0}
            max={5000}
            step={50}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="DTI Ratio"
          value={formatPercent(results.ratio)}
          color={results.ratingColor}
          subtitle={results.ratingLabel}
        />
        <ResultCard
          label="Monthly Debts"
          value={formatCurrency(results.totalDebts)}
          color="text-slate-500"
        />
        <ResultCard
          label="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          color="text-slate-500"
        />
        <ResultCard
          label="Remaining Income"
          value={formatCurrency(Math.max(0, results.remainingIncome))}
          color="text-emerald-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          DTI Status
        </h3>
        <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>0%</span>
          <span>36%</span>
          <span>43%</span>
          <span>100%</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          {/* Zone markers */}
          <div className="absolute inset-0 flex">
            <div className="bg-emerald-200 dark:bg-emerald-900/50" style={{ width: '36%' }} />
            <div className="bg-yellow-200 dark:bg-yellow-900/50" style={{ width: '7%' }} />
            <div className="bg-rose-200 dark:bg-rose-900/50" style={{ width: '57%' }} />
          </div>
          {/* Indicator */}
          <div
            className={`absolute top-0 h-full w-1.5 rounded-full ${results.barColor} shadow-md transition-all duration-300`}
            style={{ left: `${Math.min(results.ratio, 100)}%` }}
          />
        </div>
        <div className="mt-3 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Good (&lt;36%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Caution (36-43%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> High Risk (&gt;43%)
          </span>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Debts vs Remaining Income
        </h3>
        <DonutChart
          series={donutSeries}
          labels={['Total Debts', 'Remaining Income']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
