import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { AreaChart } from '@/components/charts/AreaChart'
import { rentVsBuy } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { US_STATES, getStatePropertyTaxRate } from '@/utils/stateTaxData'

const termOptions = [
  { value: '15', label: '15 Years' },
  { value: '30', label: '30 Years' },
]

const stateOptions = [
  { value: '', label: 'Select State (Optional)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function RentVsBuyPage() {
  const [monthlyRent, setMonthlyRent] = useState(1800)
  const [annualRentIncrease, setAnnualRentIncrease] = useState(3)
  const [homePrice, setHomePrice] = useState(400000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [mortgageRate, setMortgageRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState('30')
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2)
  const [stateCode, setStateCode] = useState('')

  const handleStateChange = (code: string) => {
    setStateCode(code)
    if (code) {
      setPropertyTaxRate(getStatePropertyTaxRate(code))
    }
  }
  const [maintenanceRate, setMaintenanceRate] = useState(1)
  const [homeAppreciation, setHomeAppreciation] = useState(3)
  const [years, setYears] = useState(10)

  const results = useMemo(() => {
    const downPaymentAmount = homePrice * (downPaymentPercent / 100)
    return rentVsBuy(
      monthlyRent,
      annualRentIncrease,
      homePrice,
      downPaymentAmount,
      mortgageRate,
      parseInt(loanTerm),
      propertyTaxRate,
      maintenanceRate,
      homeAppreciation,
      years,
    )
  }, [monthlyRent, annualRentIncrease, homePrice, downPaymentPercent, mortgageRate, loanTerm, propertyTaxRate, maintenanceRate, homeAppreciation, years])

  const lastYear = useMemo(
    () => results.yearlyData[results.yearlyData.length - 1],
    [results.yearlyData],
  )

  const chartCategories = useMemo(
    () => results.yearlyData.map((d) => `Year ${d.year}`),
    [results.yearlyData],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Cumulative Rent Cost',
        data: results.yearlyData.map((d) => Math.round(d.cumulativeRent)),
      },
      {
        name: 'Cumulative Buy Cost',
        data: results.yearlyData.map((d) => Math.round(d.cumulativeBuy)),
      },
    ],
    [results.yearlyData],
  )

  return (
    <CalculatorShell
      title="Rent vs. Buy Calculator"
      description="Compare the long-term costs of renting versus buying a home to make an informed decision."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Monthly Rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={500}
            max={5000}
            step={50}
            prefix="$"
          />
          <SliderInput
            label="Annual Rent Increase"
            value={annualRentIncrease}
            onChange={setAnnualRentIncrease}
            min={0}
            max={10}
            step={0.5}
            suffix="%"
          />
          <SliderInput
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={100000}
            max={2000000}
            step={10000}
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
          <SliderInput
            label="Mortgage Rate"
            value={mortgageRate}
            onChange={setMortgageRate}
            min={0}
            max={12}
            step={0.125}
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
          <SliderInput
            label="Property Tax Rate"
            value={propertyTaxRate}
            onChange={setPropertyTaxRate}
            min={0}
            max={5}
            step={0.1}
            suffix="%"
          />
          <SliderInput
            label="Maintenance Rate"
            value={maintenanceRate}
            onChange={setMaintenanceRate}
            min={0}
            max={3}
            step={0.1}
            suffix="%"
          />
          <SliderInput
            label="Home Appreciation"
            value={homeAppreciation}
            onChange={setHomeAppreciation}
            min={0}
            max={10}
            step={0.5}
            suffix="%"
          />
          <SliderInput
            label="Comparison Period"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            suffix="years"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Total Rent Cost"
          value={lastYear ? formatCurrency(lastYear.cumulativeRent) : '$0'}
          color="text-orange-500"
          subtitle={`Over ${years} years`}
        />
        <ResultCard
          label="Total Buy Cost"
          value={lastYear ? formatCurrency(lastYear.cumulativeBuy) : '$0'}
          color="text-blue-500"
          subtitle={`Over ${years} years`}
        />
        <ResultCard
          label="Home Equity"
          value={lastYear ? formatCurrency(lastYear.equity) : '$0'}
          color="text-emerald-500"
          subtitle={`After ${years} years`}
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Cumulative Costs Over Time
        </h3>
        <AreaChart
          series={chartSeries}
          categories={chartCategories}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
