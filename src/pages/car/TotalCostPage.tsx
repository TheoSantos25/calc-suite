import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { BarChart } from '@/components/charts/BarChart'
import { totalCostOfOwnership } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'
import { US_STATES, getStateSalesTaxRate } from '@/utils/stateTaxData'

const stateOptions = [
  { value: '', label: 'Select State (Optional)' },
  ...US_STATES.map((s) => ({ value: s.code, label: s.name })),
]

export default function TotalCostPage() {
  const [purchasePrice, setPurchasePrice] = useState(35000)
  const [downPayment, setDownPayment] = useState(5000)
  const [loanRate, setLoanRate] = useState(6.0)
  const [loanTermMonths, setLoanTermMonths] = useState('60')
  const [yearsOwned, setYearsOwned] = useState(5)
  const [stateCode, setStateCode] = useState('')
  const [annualInsurance, setAnnualInsurance] = useState(1500)
  const [annualMaintenance, setAnnualMaintenance] = useState(800)
  const [monthlyFuel, setMonthlyFuel] = useState(150)
  const [depreciationRate, setDepreciationRate] = useState(15)

  const salesTaxRate = stateCode ? getStateSalesTaxRate(stateCode) : 0
  const salesTaxAmount = purchasePrice * salesTaxRate / 100

  const results = useMemo(() => {
    return totalCostOfOwnership(
      purchasePrice,
      downPayment,
      loanRate,
      parseInt(loanTermMonths),
      yearsOwned,
      annualInsurance,
      annualMaintenance,
      monthlyFuel,
      depreciationRate
    )
  }, [purchasePrice, downPayment, loanRate, loanTermMonths, yearsOwned, annualInsurance, annualMaintenance, monthlyFuel, depreciationRate])

  const donutData = useMemo(() => {
    const series = results.breakdown.map((item) => Math.round(Math.max(0, item.value)))
    const labels = results.breakdown.map((item) => item.label)
    return { series, labels }
  }, [results.breakdown])

  const yearlyBarData = useMemo(() => {
    const categories: string[] = []
    const data: number[] = []
    for (let year = 1; year <= yearsOwned; year++) {
      categories.push(`Year ${year}`)
      data.push(Math.round(results.costPerYear))
    }
    return { categories, data }
  }, [yearsOwned, results.costPerYear])

  return (
    <CalculatorShell
      title="Total Cost of Ownership"
      description="Calculate the true total cost of owning a vehicle including financing, insurance, maintenance, fuel, and depreciation."
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Purchase & Financing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={5000}
            max={100000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={30000}
            step={500}
            prefix="$"
          />
          <SliderInput
            label="Loan Interest Rate"
            value={loanRate}
            onChange={setLoanRate}
            min={0}
            max={12}
            step={0.1}
            suffix="%"
          />
          <SelectInput
            label="Loan Term"
            value={loanTermMonths}
            onChange={setLoanTermMonths}
            options={[
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '72', label: '72 months (6 years)' },
            ]}
          />
          <SelectInput
            label="State"
            value={stateCode}
            onChange={setStateCode}
            options={stateOptions}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Ongoing Costs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Years Owned"
            value={yearsOwned}
            onChange={setYearsOwned}
            min={1}
            max={15}
            step={1}
          />
          <SliderInput
            label="Annual Insurance"
            value={annualInsurance}
            onChange={setAnnualInsurance}
            min={500}
            max={5000}
            step={100}
            prefix="$"
          />
          <SliderInput
            label="Annual Maintenance"
            value={annualMaintenance}
            onChange={setAnnualMaintenance}
            min={0}
            max={3000}
            step={100}
            prefix="$"
          />
          <SliderInput
            label="Monthly Fuel"
            value={monthlyFuel}
            onChange={setMonthlyFuel}
            min={50}
            max={500}
            step={25}
            prefix="$"
          />
          <SliderInput
            label="Depreciation Rate"
            value={depreciationRate}
            onChange={setDepreciationRate}
            min={5}
            max={25}
            step={1}
            suffix="%"
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Total Cost"
          value={formatCurrency(results.totalCost)}
          color="text-rose-500"
        />
        <ResultCard
          label="Cost Per Month"
          value={formatCurrency(results.costPerMonth)}
          color="text-blue-500"
        />
        <ResultCard
          label="Cost Per Year"
          value={formatCurrency(results.costPerYear)}
          color="text-purple-500"
        />
        <ResultCard
          label="Resale Value"
          value={formatCurrency(results.resaleValue)}
          color="text-emerald-500"
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
            Cost Breakdown
          </h3>
          <DonutChart
            series={donutData.series}
            labels={donutData.labels}
            height={300}
          />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Yearly Costs
          </h3>
          <BarChart
            series={[{ name: 'Annual Cost', data: yearlyBarData.data }]}
            categories={yearlyBarData.categories}
            height={300}
          />
        </GlassCard>
      </div>
    </CalculatorShell>
  )
}
