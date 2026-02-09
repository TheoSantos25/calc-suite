import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { monthlyMortgagePayment, amortizationSchedule, solveHomePriceFromPayment } from '@/utils/financial'
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

export default function MortgagePaymentPage() {
  const [homePrice, setHomePrice] = useState(350000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanTerm, setLoanTerm] = useState('30')
  const [interestRate, setInterestRate] = useState(6.5)
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2)
  const [homeInsurance, setHomeInsurance] = useState(1200)
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
    const downPaymentAmount = homePrice * (downPaymentPercent / 100)
    const loanAmount = homePrice - downPaymentAmount
    const years = parseInt(loanTerm)
    const pi = monthlyMortgagePayment(loanAmount, interestRate, years)
    const monthlyTax = (homePrice * propertyTaxRate) / 100 / 12
    const monthlyInsurance = homeInsurance / 12
    const pmi = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0
    const totalMonthly = pi + monthlyTax + monthlyInsurance + pmi

    const schedule = amortizationSchedule(loanAmount, interestRate, years)
    const yearlyData = schedule.filter((_, i) => (i + 1) % 12 === 0)

    return {
      loanAmount,
      pi,
      monthlyTax,
      monthlyInsurance,
      pmi,
      totalMonthly,
      yearlyData,
      years,
    }
  }, [homePrice, downPaymentPercent, loanTerm, interestRate, propertyTaxRate, homeInsurance])

  const handleEditMonthlyPayment = (newPayment: number) => {
    const years = parseInt(loanTerm)
    const newHome = solveHomePriceFromPayment(newPayment, downPaymentPercent, interestRate, years, propertyTaxRate, homeInsurance)
    if (newHome >= 50000 && newHome <= 2000000) {
      setHomePrice(Math.round(newHome / 5000) * 5000)
    }
  }

  const donutSeries = useMemo(() => {
    const parts = [
      Math.round(results.pi),
      Math.round(results.monthlyTax),
      Math.round(results.monthlyInsurance),
    ]
    if (results.pmi > 0) parts.push(Math.round(results.pmi))
    return parts
  }, [results.pi, results.monthlyTax, results.monthlyInsurance, results.pmi])

  const donutLabels = useMemo(() => {
    const labels = ['Principal & Interest', 'Property Tax', 'Insurance']
    if (results.pmi > 0) labels.push('PMI')
    return labels
  }, [results.pmi])

  const equityCategories = useMemo(
    () => results.yearlyData.map((_, i) => `Year ${i + 1}`),
    [results.yearlyData],
  )

  const equitySeries = useMemo(
    () => [
      {
        name: 'Equity',
        data: results.yearlyData.map((d) =>
          Math.round(results.loanAmount - d.balance),
        ),
      },
      {
        name: 'Remaining Balance',
        data: results.yearlyData.map((d) => Math.round(d.balance)),
      },
    ],
    [results.yearlyData, results.loanAmount],
  )

  return (
    <CalculatorShell
      title="Mortgage Payment Calculator"
      description="Calculate your monthly mortgage payment including principal, interest, taxes, insurance, and PMI."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
          />
          <SliderInput
            label="Down Payment"
            value={downPaymentPercent}
            onChange={setDownPaymentPercent}
            min={0}
            max={50}
            step={1}
            suffix="%"
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
            label="Home Insurance (Annual)"
            value={homeInsurance}
            onChange={setHomeInsurance}
            prefix="$"
            min={0}
            max={10000}
            step={100}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Monthly Payment"
          value={formatCurrency(results.totalMonthly)}
          color="text-emerald-500"
          subtitle="Total monthly cost"
          editable
          onEdit={handleEditMonthlyPayment}
        />
        <ResultCard
          label="Principal & Interest"
          value={formatCurrency(results.pi)}
          color="text-blue-500"
          subtitle={`Loan: ${formatCurrency(results.loanAmount)}`}
        />
        <ResultCard
          label="Property Tax"
          value={formatCurrency(results.monthlyTax)}
          color="text-orange-500"
          subtitle="Monthly estimate"
        />
        <ResultCard
          label="Insurance"
          value={formatCurrency(results.monthlyInsurance)}
          color="text-purple-500"
          subtitle="Monthly estimate"
        />
        {results.pmi > 0 && (
          <ResultCard
            label="PMI"
            value={formatCurrency(results.pmi)}
            color="text-rose-500"
            subtitle="Until 20% equity"
          />
        )}
      </ResultGrid>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Monthly Payment Breakdown
            </h3>
            <DonutChart
              series={donutSeries}
              labels={donutLabels}
              height={300}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Equity Buildup Over Time
            </h3>
            <AreaChart
              series={equitySeries}
              categories={equityCategories}
              height={300}
            />
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
