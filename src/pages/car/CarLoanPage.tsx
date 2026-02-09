import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { carLoan, solveVehiclePrice } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { US_STATES, getStateSalesTaxRate } from '@/utils/stateTaxData'
import { getSuggestedRate, CreditScoreBadge } from '@/utils/creditScoreRates'

const stateOptions = [
  { value: '', label: 'Select State (Optional)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function CarLoanPage() {
  const [vehiclePrice, setVehiclePrice] = useState(35000)
  const [downPayment, setDownPayment] = useState(5000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState('60')
  const [stateCode, setStateCode] = useState('')
  const [creditScore, setCreditScore] = useState(720)

  const termMonths = parseInt(loanTerm)

  const handleCreditScoreChange = (score: number) => {
    setCreditScore(score)
    const suggested = getSuggestedRate(score, 'autoNew')
    setInterestRate(suggested.typical)
  }

  const salesTaxRate = stateCode ? getStateSalesTaxRate(stateCode) : 0
  const salesTaxAmount = vehiclePrice * salesTaxRate / 100

  const results = useMemo(() => {
    return carLoan(vehiclePrice, downPayment, interestRate, termMonths)
  }, [vehiclePrice, downPayment, interestRate, termMonths])

  const principal = vehiclePrice - downPayment

  const handleEditMonthlyPayment = (newPayment: number) => {
    const newPrice = solveVehiclePrice(newPayment, downPayment, interestRate, termMonths)
    if (newPrice >= 5000 && newPrice <= 150000) {
      setVehiclePrice(Math.round(newPrice / 1000) * 1000)
    }
  }

  const balanceData = useMemo(() => {
    const r = interestRate / 100 / 12
    const payment = results.monthlyPayment
    const balances: number[] = []
    const categories: string[] = []
    let balance = principal

    for (let month = 1; month <= termMonths; month++) {
      const interestPortion = balance * r
      const principalPortion = payment - interestPortion
      balance = Math.max(0, balance - principalPortion)
      balances.push(Math.round(balance))
      categories.push(`Mo ${month}`)
    }

    return { balances, categories }
  }, [principal, interestRate, termMonths, results.monthlyPayment])

  return (
    <CalculatorShell
      title="Car Loan Calculator"
      description="Calculate your monthly car payment, total interest, and visualize your loan payoff over time."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Vehicle Price"
            value={vehiclePrice}
            onChange={setVehiclePrice}
            min={5000}
            max={150000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={50000}
            step={500}
            prefix="$"
          />
          <SelectInput
            label="State"
            value={stateCode}
            onChange={setStateCode}
            options={stateOptions}
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
            max={15}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={loanTerm}
            onChange={setLoanTerm}
            options={[
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
          label="Total Cost"
          value={formatCurrency(results.totalCost)}
          color="text-blue-500"
        />
        {salesTaxAmount > 0 && (
          <ResultCard
            label="Sales Tax"
            value={formatCurrency(salesTaxAmount)}
            color="text-amber-500"
            subtitle={`${salesTaxRate}% state rate`}
          />
        )}
      </ResultGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Principal vs Interest
          </h3>
          <DonutChart
            series={[Math.round(principal), Math.round(results.totalInterest)]}
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
