import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { debtConsolidation } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

interface Debt {
  name: string
  balance: number
  rate: number
  minPayment: number
}

const defaultDebts: Debt[] = [
  { name: 'Credit Card 1', balance: 5000, rate: 22, minPayment: 150 },
  { name: 'Credit Card 2', balance: 3000, rate: 18, minPayment: 90 },
]

export default function DebtConsolidationPage() {
  const [debts, setDebts] = useState<Debt[]>(defaultDebts)
  const [consolidatedRate, setConsolidatedRate] = useState(8)
  const [consolidatedTerm, setConsolidatedTerm] = useState('60')

  const updateDebt = (index: number, field: keyof Debt, value: string | number) => {
    setDebts((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addDebt = () => {
    if (debts.length < 6) {
      setDebts((prev) => [
        ...prev,
        { name: `Debt ${prev.length + 1}`, balance: 2000, rate: 15, minPayment: 60 },
      ])
    }
  }

  const removeDebt = (index: number) => {
    if (debts.length > 1) {
      setDebts((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const results = useMemo(() => {
    return debtConsolidation(debts, consolidatedRate, parseInt(consolidatedTerm))
  }, [debts, consolidatedRate, consolidatedTerm])

  return (
    <CalculatorShell
      title="Debt Consolidation Calculator"
      description="See how consolidating your debts into a single loan could save you money and simplify payments."
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Your Debts
          </h3>
          {debts.length < 6 && (
            <button
              onClick={addDebt}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors"
            >
              + Add Debt
            </button>
          )}
        </div>
        <div className="space-y-6">
          {debts.map((debt, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(index, 'name', e.target.value)}
                  className="text-sm font-semibold bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0"
                />
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(index)}
                    className="px-3 py-1 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NumberInput
                  label="Balance"
                  value={debt.balance}
                  onChange={(v) => updateDebt(index, 'balance', v)}
                  prefix="$"
                />
                <NumberInput
                  label="Interest Rate (%)"
                  value={debt.rate}
                  onChange={(v) => updateDebt(index, 'rate', v)}
                  suffix="%"
                />
                <NumberInput
                  label="Min Payment"
                  value={debt.minPayment}
                  onChange={(v) => updateDebt(index, 'minPayment', v)}
                  prefix="$"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Consolidation Loan Terms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Consolidated Interest Rate"
            value={consolidatedRate}
            onChange={setConsolidatedRate}
            min={3}
            max={20}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Consolidated Loan Term"
            value={consolidatedTerm}
            onChange={setConsolidatedTerm}
            options={[
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '72', label: '72 months (6 years)' },
              { value: '84', label: '84 months (7 years)' },
              { value: '96', label: '96 months (8 years)' },
              { value: '120', label: '120 months (10 years)' },
            ]}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Total Debt"
          value={formatCurrency(results.totalBalance)}
          color="text-slate-500"
        />
        <ResultCard
          label="Current Total Monthly"
          value={formatCurrency(results.totalMinPayments)}
          color="text-rose-500"
        />
        <ResultCard
          label="New Monthly Payment"
          value={formatCurrency(results.consolidatedPayment)}
          color="text-emerald-500"
        />
        <ResultCard
          label="Interest Saved"
          value={formatCurrency(Math.max(0, results.interestSaved))}
          color="text-blue-500"
          subtitle={results.interestSaved > 0 ? 'You save by consolidating' : 'Consolidation may cost more'}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Total Interest Comparison
        </h3>
        <BarChart
          series={[
            {
              name: 'Total Interest',
              data: [
                Math.round(results.totalInterestSeparate),
                Math.round(results.totalInterestConsolidated),
              ],
            },
          ]}
          categories={['Separate Payments', 'Consolidated']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
