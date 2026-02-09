import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'
import { leaseVsBuy } from '@/utils/financial'
import { formatCurrency } from '@/utils/formatters'

export default function LeaseVsBuyPage() {
  const [vehiclePrice, setVehiclePrice] = useState(40000)
  const [buyDownPayment, setBuyDownPayment] = useState(5000)
  const [loanRate, setLoanRate] = useState(6.0)
  const [loanTermMonths, setLoanTermMonths] = useState('60')
  const [leaseMonthly, setLeaseMonthly] = useState(450)
  const [leaseTermMonths, setLeaseTermMonths] = useState('36')
  const [leaseDownPayment, setLeaseDownPayment] = useState(2000)
  const [depreciationRate, setDepreciationRate] = useState(15)

  const results = useMemo(() => {
    return leaseVsBuy(
      vehiclePrice,
      buyDownPayment,
      loanRate,
      parseInt(loanTermMonths),
      leaseMonthly,
      parseInt(leaseTermMonths),
      leaseDownPayment,
      0,
      depreciationRate
    )
  }, [vehiclePrice, buyDownPayment, loanRate, loanTermMonths, leaseMonthly, leaseTermMonths, leaseDownPayment, depreciationRate])

  return (
    <CalculatorShell
      title="Lease vs Buy Calculator"
      description="Compare the total cost of leasing versus buying a vehicle to make the best financial decision."
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Vehicle & Buy Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Vehicle Price"
            value={vehiclePrice}
            onChange={setVehiclePrice}
            min={10000}
            max={100000}
            step={1000}
            prefix="$"
          />
          <SliderInput
            label="Buy Down Payment"
            value={buyDownPayment}
            onChange={setBuyDownPayment}
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
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '72', label: '72 months (6 years)' },
            ]}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Lease Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Monthly Lease Payment"
            value={leaseMonthly}
            onChange={setLeaseMonthly}
            min={100}
            max={1500}
            step={25}
            prefix="$"
          />
          <SelectInput
            label="Lease Term"
            value={leaseTermMonths}
            onChange={setLeaseTermMonths}
            options={[
              { value: '24', label: '24 months (2 years)' },
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
            ]}
          />
          <SliderInput
            label="Lease Down Payment"
            value={leaseDownPayment}
            onChange={setLeaseDownPayment}
            min={0}
            max={10000}
            step={500}
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
          label="Total Lease Cost"
          value={formatCurrency(results.totalLeaseCost)}
          color="text-orange-500"
        />
        <ResultCard
          label="Total Buy Cost"
          value={formatCurrency(results.totalBuyCost)}
          color="text-blue-500"
        />
        <ResultCard
          label="Monthly Lease"
          value={formatCurrency(results.monthlyLease)}
          color="text-orange-500"
        />
        <ResultCard
          label="Monthly Buy"
          value={formatCurrency(results.monthlyBuy)}
          color="text-blue-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Total Cost Comparison
        </h3>
        <BarChart
          series={[
            {
              name: 'Total Cost',
              data: [
                Math.round(results.totalLeaseCost),
                Math.round(results.totalBuyCost),
              ],
            },
          ]}
          categories={['Lease', 'Buy']}
          height={300}
        />
      </GlassCard>
    </CalculatorShell>
  )
}
