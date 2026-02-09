import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart } from '@/components/charts/LineChart'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { DonutChart } from '@/components/charts/DonutChart'
import { useCurrencyRates, useHistoricalRates } from '@/hooks/common/useCurrencyRates'
import { pppData, getPPPMultiplier, getCostIcon } from '@/utils/pppData'

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
]

const POPULAR_PAIRS = [
  ['USD', 'EUR'], ['USD', 'GBP'], ['USD', 'JPY'],
  ['EUR', 'GBP'], ['USD', 'CAD'], ['EUR', 'JPY'],
]

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState(1000)

  const { rates, loading, error, refetch } = useCurrencyRates(fromCurrency)
  const { history, loading: histLoading } = useHistoricalRates(fromCurrency, toCurrency)

  const rate = rates?.rates[toCurrency] ?? 0
  const converted = amount * rate

  const fromPPP = pppData[fromCurrency]
  const toPPP = pppData[toCurrency]
  const hasPPP = !!(fromPPP && toPPP && rate > 0)
  const pppMultiplier = hasPPP ? getPPPMultiplier(fromCurrency, toCurrency, rate) : 1

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const chartData = useMemo(() => {
    if (history.length === 0) return { categories: [], data: [] }
    return {
      categories: history.map((p) => p.date.slice(5)), // MM-DD
      data: history.map((p) => parseFloat(p.rate.toFixed(4))),
    }
  }, [history])

  const formatRate = (n: number) => n.toFixed(4)

  return (
    <CalculatorShell
      title="Currency Converter"
      description="Convert between world currencies with live exchange rates and 30-day historical trends."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Amount"
            value={amount}
            onChange={setAmount}
            min={0}
            step={1}
          />
          <div /> {/* spacer */}
          <SelectInput
            label="From"
            value={fromCurrency}
            onChange={setFromCurrency}
            options={CURRENCIES}
          />
          <SelectInput
            label="To"
            value={toCurrency}
            onChange={setToCurrency}
            options={CURRENCIES}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSwap}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 font-medium text-lg hover:scale-110 active:scale-95"
            title="Swap currencies"
          >
            ↔
          </button>
        </div>
      </GlassCard>

      {loading ? (
        <SkeletonCard lines={2} />
      ) : error ? (
        <GlassCard className="p-6 border-l-4 border-rose-500">
          <p className="text-rose-500 font-semibold mb-2">Failed to load rates</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </GlassCard>
      ) : (
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            {amount.toLocaleString()} {fromCurrency} =
          </p>
          <p className="text-4xl font-bold text-emerald-500 mb-2">
            <AnimatedNumber
              value={converted}
              formatter={(n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />
            <span className="text-2xl ml-2 text-slate-600 dark:text-slate-300">{toCurrency}</span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            1 {fromCurrency} = {formatRate(rate)} {toCurrency} &middot; Updated {rates?.date}
          </p>
        </GlassCard>
      )}

      {/* Purchasing Power Parity */}
      {!loading && !error && hasPPP && fromCurrency !== toCurrency && (
        <>
          {/* PPP multiplier badge + adjusted value */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Purchasing Power Parity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Multiplier */}
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Your money goes
                </p>
                <p className={`text-4xl font-bold mb-1 ${pppMultiplier >= 1 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <AnimatedNumber
                    value={pppMultiplier}
                    formatter={(n) => `${n.toFixed(1)}x`}
                  />
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {pppMultiplier >= 1 ? 'further' : 'less far'} in {toPPP.country}
                </p>
              </div>

              {/* Donut: nominal vs PPP value */}
              <div>
                <DonutChart
                  series={[
                    Math.round(converted),
                    Math.round(Math.abs(converted * pppMultiplier - converted)),
                  ]}
                  labels={[
                    'Nominal Value',
                    pppMultiplier >= 1 ? 'Extra Buying Power' : 'Lost Buying Power',
                  ]}
                  height={200}
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {amount.toLocaleString()} {fromCurrency} buys the equivalent of
              </p>
              <p className="text-2xl font-bold text-primary">
                <AnimatedNumber
                  value={converted * pppMultiplier}
                  formatter={(n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                />
                <span className="text-lg ml-1 text-slate-500">{toCurrency}</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                in real purchasing power (vs {converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} {toCurrency} nominal)
              </p>
            </div>
          </GlassCard>

          {/* Cost comparison cards */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              What Things Cost: {fromPPP.country} vs {toPPP.country}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fromPPP.costOfLiving.map((fromItem, idx) => {
                const toItem = toPPP.costOfLiving[idx]
                if (!toItem) return null

                // Convert "from" price to "to" currency at nominal rate for comparison
                const fromInToCurrency = fromItem.localPrice * rate
                const diff = toItem.localPrice - fromInToCurrency
                const cheaper = diff < 0

                return (
                  <div
                    key={fromItem.label}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.06}s`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getCostIcon(fromItem.icon)}</span>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {fromItem.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs gap-2">
                      <div>
                        <p className="text-slate-400 dark:text-slate-500">{fromPPP.country}</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                          {fromItem.localPrice.toLocaleString()} {fromCurrency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 dark:text-slate-500">{toPPP.country}</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                          {toItem.localPrice.toLocaleString()} {toCurrency}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          cheaper
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}
                      >
                        {cheaper ? 'Cheaper' : 'More expensive'} in {toPPP.country}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </>
      )}

      {/* Common conversions */}
      {!loading && !error && rates && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Popular Pairs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_PAIRS.map(([f, t]) => {
              const pairRate = f === fromCurrency
                ? (rates.rates[t] ?? 0)
                : f === toCurrency
                  ? (1 / (rates.rates[f] ?? 1))
                  : 0

              if (pairRate === 0) return null

              return (
                <div
                  key={`${f}-${t}`}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300 flex justify-between items-center"
                >
                  <span className="font-medium">{f}/{t}</span>
                  <span>{pairRate.toFixed(4)}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}

      {/* Historical chart */}
      {histLoading ? (
        <SkeletonCard lines={4} />
      ) : chartData.data.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            30-Day Trend: {fromCurrency}/{toCurrency}
          </h3>
          <LineChart
            series={[{ name: `${fromCurrency}/${toCurrency}`, data: chartData.data }]}
            categories={chartData.categories}
            height={300}
          />
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
