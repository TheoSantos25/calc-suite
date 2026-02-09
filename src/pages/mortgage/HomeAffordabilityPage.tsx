import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { homeAffordability } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { US_STATES, getStatePropertyTaxRate } from '@/utils/stateTaxData'
import { getSuggestedRate, CreditScoreBadge } from '@/utils/creditScoreRates'

const termOptions = [
  { value: '15', label: '15 Years' },
  { value: '30', label: '30 Years' },
]

const stateOptions = [
  { value: '', label: 'Select State (Optional)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function HomeAffordabilityPage() {
  const [annualIncome, setAnnualIncome] = useState(100000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [downPayment, setDownPayment] = useState(60000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState('30')
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2)
  const [insurance, setInsurance] = useState(1200)
  const [maxDTI, setMaxDTI] = useState(36)
  const [stateCode, setStateCode] = useState('')
  const [creditScore, setCreditScore] = useState(720)

  const handleStateChange = (code: string) => {
    setStateCode(code)
    if (code) {
      setPropertyTaxRate(getStatePropertyTaxRate(code))
    }
  }

  const handleCreditScoreChange = (score: number) => {
    setCreditScore(score)
    const loanType = loanTerm === '15' ? 'mortgage15' as const : 'mortgage30' as const
    const suggested = getSuggestedRate(score, loanType)
    setInterestRate(suggested.typical)
  }

  const results = useMemo(() => {
    return homeAffordability(
      annualIncome,
      monthlyDebts,
      downPayment,
      interestRate,
      parseInt(loanTerm),
      propertyTaxRate,
      insurance,
      maxDTI,
    )
  }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, maxDTI])

  const barCategories = useMemo(() => ['Home Price Breakdown'], [])

  const barSeries = useMemo(
    () => [
      {
        name: 'Down Payment',
        data: [Math.round(downPayment)],
      },
      {
        name: 'Max Loan Amount',
        data: [Math.round(results.maxLoanAmount)],
      },
    ],
    [downPayment, results.maxLoanAmount],
  )

  return (
    <CalculatorShell
      title="Home Affordability Calculator"
      description="Determine how much home you can afford based on your income, debts, and financial situation."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Annual Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            min={20000}
            max={500000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Monthly Debts"
            value={monthlyDebts}
            onChange={setMonthlyDebts}
            min={0}
            max={5000}
            step={50}
            prefix="$"
          />
          <SliderInput
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={500000}
            step={5000}
            prefix="$"
          />
          <SelectInput
            label="Loan Term"
            value={loanTerm}
            onChange={setLoanTerm}
            options={termOptions}
          />
          <SelectInput
            label="State"
            value={stateCode}
            onChange={handleStateChange}
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
            max={12}
            step={0.125}
            suffix="%"
          />
          <SliderInput
            label="Property Tax Rate"
            value={propertyTaxRate}
            onChange={setPropertyTaxRate}
            min={0}
            max={5}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Annual Insurance"
            value={insurance}
            onChange={setInsurance}
            prefix="$"
            min={0}
            max={10000}
            step={100}
          />
          <SliderInput
            label="Max Debt-to-Income Ratio"
            value={maxDTI}
            onChange={setMaxDTI}
            min={20}
            max={50}
            step={1}
            suffix="%"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Max Home Price"
          value={formatCurrency(results.maxHomePrice)}
          color="text-emerald-500"
          subtitle={`With ${formatCurrency(downPayment)} down`}
        />
        <ResultCard
          label="Max Loan Amount"
          value={formatCurrency(results.maxLoanAmount)}
          color="text-blue-500"
          subtitle={`${loanTerm}-year mortgage`}
        />
        <ResultCard
          label="Est. Monthly Payment"
          value={formatCurrency(results.estimatedMonthlyPayment)}
          color="text-purple-500"
          subtitle={`At ${maxDTI}% DTI`}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Max Home Price Components
        </h3>
        <BarChart
          series={barSeries}
          categories={barCategories}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
