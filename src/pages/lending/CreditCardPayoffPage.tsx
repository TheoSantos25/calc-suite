import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { creditCardPayoff } from '@/utils/financial'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import { getSuggestedRate, CreditScoreBadge } from '@/utils/creditScoreRates'

export default function CreditCardPayoffPage() {
  const [balance, setBalance] = useState(5000)
  const [apr, setApr] = useState(22)
  const [monthlyPayment, setMonthlyPayment] = useState(200)
  const [creditScore, setCreditScore] = useState(720)

  const handleCreditScoreChange = (score: number) => {
    setCreditScore(score)
    const suggested = getSuggestedRate(score, 'creditCard')
    setApr(suggested.typical)
  }

  const results = useMemo(() => {
    return creditCardPayoff(balance, apr, monthlyPayment)
  }, [balance, apr, monthlyPayment])

  const isPaymentTooLow = results.months === Infinity
  const totalPaid = isPaymentTooLow ? 0 : results.totalInterest + balance

  const chartData = useMemo(() => {
    if (isPaymentTooLow || results.monthlyData.length === 0) {
      return { balances: [], categories: [] }
    }

    const data = results.monthlyData
    const balances: number[] = []
    const categories: string[] = []

    const step = Math.max(1, Math.floor(data.length / 30))
    for (let i = 0; i < data.length; i += step) {
      balances.push(Math.round(data[i].balance))
      categories.push(`Mo ${data[i].month}`)
    }
    // Always include the last point
    const last = data[data.length - 1]
    if (categories[categories.length - 1] !== `Mo ${last.month}`) {
      balances.push(Math.round(last.balance))
      categories.push(`Mo ${last.month}`)
    }

    return { balances, categories }
  }, [results.monthlyData, isPaymentTooLow])

  return (
    <CalculatorShell
      title="Credit Card Payoff Calculator"
      description="Find out how long it will take to pay off your credit card balance and how much interest you will pay."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Current Balance"
            value={balance}
            onChange={setBalance}
            min={500}
            max={50000}
            step={100}
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
            label="APR"
            value={apr}
            onChange={setApr}
            min={0}
            max={30}
            step={0.1}
            suffix="%"
          />
          <SliderInput
            label="Monthly Payment"
            value={monthlyPayment}
            onChange={setMonthlyPayment}
            min={25}
            max={2000}
            step={25}
            prefix="$"
          />
        </div>
      </GlassCard>

      {isPaymentTooLow && (
        <GlassCard className="p-6 border-l-4 border-amber-500">
          <p className="text-amber-600 dark:text-amber-400 font-semibold">
            Payment too low! Your monthly payment does not cover the monthly interest. Increase your payment to make progress on the balance.
          </p>
        </GlassCard>
      )}

      <ResultGrid>
        <ResultCard
          label="Months to Payoff"
          value={isPaymentTooLow ? 'N/A' : formatNumber(results.months)}
          color="text-emerald-500"
          subtitle={isPaymentTooLow ? 'Payment too low' : `${Math.floor(results.months / 12)} years ${results.months % 12} months`}
        />
        <ResultCard
          label="Total Interest Paid"
          value={isPaymentTooLow ? 'N/A' : formatCurrency(results.totalInterest)}
          color="text-rose-500"
        />
        <ResultCard
          label="Total Amount Paid"
          value={isPaymentTooLow ? 'N/A' : formatCurrency(totalPaid)}
          color="text-blue-500"
        />
      </ResultGrid>

      {!isPaymentTooLow && chartData.balances.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Balance Over Time
          </h3>
          <LineChart
            series={[{ name: 'Balance', data: chartData.balances }]}
            categories={chartData.categories}
            height={300}
          />
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
