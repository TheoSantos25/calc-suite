import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { carLoan } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { US_STATES, getStateSalesTaxRate } from '@/utils/stateTaxData'
import { getSuggestedRate, CreditScoreBadge } from '@/utils/creditScoreRates'

const stateOptions = [
  { value: '', label: 'Select State (Optional)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function MonthlyPaymentPage() {
  const [vehiclePrice, setVehiclePrice] = useState(35000)
  const [downPayment, setDownPayment] = useState(3000)
  const [tradeInValue, setTradeInValue] = useState(5000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState('60')
  const [stateCode, setStateCode] = useState('')
  const [creditScore, setCreditScore] = useState(720)

  const termMonths = parseInt(loanTerm)
  const totalDown = downPayment + tradeInValue
  const amountFinanced = Math.max(0, vehiclePrice - totalDown)

  const handleCreditScoreChange = (score: number) => {
    setCreditScore(score)
    const suggested = getSuggestedRate(score, 'autoNew')
    setInterestRate(suggested.typical)
  }

  const salesTaxRate = stateCode ? getStateSalesTaxRate(stateCode) : 0
  const salesTaxAmount = vehiclePrice * salesTaxRate / 100

  const results = useMemo(() => {
    return carLoan(vehiclePrice, totalDown, interestRate, termMonths)
  }, [vehiclePrice, totalDown, interestRate, termMonths])

  return (
    <CalculatorShell
      title="Monthly Payment Estimator"
      description="Estimate your monthly car payment with down payment, trade-in value, and loan terms."
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
          <SliderInput
            label="Trade-In Value"
            value={tradeInValue}
            onChange={setTradeInValue}
            min={0}
            max={30000}
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
        />
        <ResultCard
          label="Amount Financed"
          value={formatCurrency(amountFinanced)}
          color="text-blue-500"
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(results.totalInterest)}
          color="text-rose-500"
        />
        <ResultCard
          label="Total Cost"
          value={formatCurrency(results.totalCost)}
          color="text-purple-500"
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

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Principal vs Interest
        </h3>
        <DonutChart
          series={[Math.round(amountFinanced), Math.round(results.totalInterest)]}
          labels={['Principal', 'Interest']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
