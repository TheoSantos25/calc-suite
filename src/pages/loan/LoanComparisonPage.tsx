import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { loanComparison } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

interface LoanOption {
  name: string
  amount: number
  rate: number
  termMonths: string
}

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

const defaultLoans: LoanOption[] = [
  { name: 'Loan A', amount: 50000, rate: 6.5, termMonths: '60' },
  { name: 'Loan B', amount: 50000, rate: 5.9, termMonths: '48' },
]

export default function LoanComparisonPage() {
  const [loans, setLoans] = useState<LoanOption[]>(defaultLoans)

  const updateLoan = (index: number, field: keyof LoanOption, value: string | number) => {
    setLoans((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addLoan = () => {
    if (loans.length < 3) {
      setLoans((prev) => [
        ...prev,
        { name: `Loan ${String.fromCharCode(65 + prev.length)}`, amount: 50000, rate: 7, termMonths: '60' },
      ])
    }
  }

  const removeLoan = (index: number) => {
    if (loans.length > 2) {
      setLoans((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const results = useMemo(() => {
    const loanInputs = loans.map((l) => ({
      name: l.name,
      amount: l.amount,
      rate: l.rate,
      termMonths: parseInt(l.termMonths),
    }))
    return loanComparison(loanInputs)
  }, [loans])

  const bestIndex = useMemo(() => {
    let bestIdx = 0
    let bestCost = Infinity
    for (let i = 0; i < results.length; i++) {
      if (results[i].totalPaid < bestCost) {
        bestCost = results[i].totalPaid
        bestIdx = i
      }
    }
    return bestIdx
  }, [results])

  const chartData = useMemo(() => {
    const categories = results.map((r) => r.name)
    const series = [
      { name: 'Monthly Payment', data: results.map((r) => Math.round(r.monthlyPayment)) },
      { name: 'Total Cost', data: results.map((r) => Math.round(r.totalPaid)) },
    ]
    return { categories, series }
  }, [results])

  return (
    <CalculatorShell
      title="Loan Comparison Calculator"
      description="Compare multiple loan options side by side to find the best deal based on monthly payments and total cost."
    >
      {loans.map((loan, index) => (
        <GlassCard key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {loan.name}
              {index === bestIndex && results.length > 0 && (
                <span className="ml-2 text-sm font-medium text-emerald-500">
                  Best Option
                </span>
              )}
            </h3>
            {loans.length > 2 && (
              <button
                onClick={() => removeLoan(index)}
                className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Loan Name
              </label>
              <input
                type="text"
                value={loan.name}
                onChange={(e) => updateLoan(index, 'name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>
            <NumberInput
              label="Loan Amount"
              value={loan.amount}
              onChange={(v) => updateLoan(index, 'amount', v)}
              prefix="$"
              min={0}
              max={1000000}
              step={1000}
            />
            <NumberInput
              label="Interest Rate (%)"
              value={loan.rate}
              onChange={(v) => updateLoan(index, 'rate', v)}
              suffix="%"
              min={0}
              max={30}
              step={0.1}
            />
            <SelectInput
              label="Loan Term"
              value={loan.termMonths}
              onChange={(v) => updateLoan(index, 'termMonths', v)}
              options={termOptions}
            />
          </div>
        </GlassCard>
      ))}

      {loans.length < 3 && (
        <button
          onClick={addLoan}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors text-sm font-medium"
        >
          + Add Another Loan
        </button>
      )}

      <ResultGrid>
        {results.map((r, i) => (
          <ResultCard
            key={i}
            label={`${r.name} - Monthly`}
            value={formatCurrency(r.monthlyPayment)}
            color={i === bestIndex ? 'text-emerald-500' : 'text-slate-500'}
            subtitle={`Total: ${formatCurrency(r.totalPaid)}`}
          />
        ))}
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Loan Comparison
        </h3>
        <BarChart
          series={chartData.series}
          categories={chartData.categories}
          height={300}
        />
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Comparison Summary
        </h3>
        <div className="overflow-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 dark:bg-slate-900">
                <th className="text-left py-2 px-3 font-semibold text-white">Loan</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Amount</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Rate</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Term</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Monthly</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Total Interest</th>
                <th className="text-right py-2 px-3 font-semibold text-white">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr
                  key={i}
                  className={`border-b border-slate-200 dark:border-slate-700/50 ${
                    i === bestIndex
                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                      : i % 2 === 0
                        ? 'bg-slate-50 dark:bg-slate-800/50'
                        : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-900 dark:text-slate-100 font-medium">
                    {r.name}
                    {i === bestIndex && (
                      <span className="ml-1 text-xs text-emerald-500">Best</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                    {r.rate}%
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                    {r.termMonths} mo
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(r.monthlyPayment)}
                  </td>
                  <td className="py-2 px-3 text-right text-rose-500 dark:text-rose-400">
                    {formatCurrency(r.totalInterest)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400 font-medium">
                    {formatCurrency(r.totalPaid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
