import { useState, useMemo, useEffect } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SelectInput } from '@/components/ui/SelectInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { unitConversions, convertUnit } from '@/utils/financial'
import { formatNumber } from '@/utils/formatters'

const categoryOptions = [
  { value: 'length', label: 'Length' },
  { value: 'weight', label: 'Weight' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'volume', label: 'Volume' },
  { value: 'area', label: 'Area' },
  { value: 'speed', label: 'Speed' },
]

function getUnitKeys(category: string): string[] {
  return Object.keys(unitConversions[category] ?? {})
}

function getUnitOptions(category: string) {
  return getUnitKeys(category).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }))
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState(() => getUnitKeys('length')[0])
  const [toUnit, setToUnit] = useState(() => getUnitKeys('length')[1])
  const [value, setValue] = useState(1)

  useEffect(() => {
    const keys = getUnitKeys(category)
    setFromUnit(keys[0])
    setToUnit(keys[1] ?? keys[0])
  }, [category])

  const result = useMemo(() => {
    return convertUnit(value, category, fromUnit, toUnit)
  }, [value, category, fromUnit, toUnit])

  const unitOptions = useMemo(() => getUnitOptions(category), [category])

  const commonConversions = useMemo(() => {
    const keys = getUnitKeys(category)
    const conversions: { from: string; to: string; result: string }[] = []
    for (let i = 0; i < keys.length && conversions.length < 6; i++) {
      for (let j = i + 1; j < keys.length && conversions.length < 6; j++) {
        const converted = convertUnit(1, category, keys[i], keys[j])
        conversions.push({
          from: keys[i],
          to: keys[j],
          result: formatNumber(converted, 4),
        })
      }
    }
    return conversions
  }, [category])

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <CalculatorShell
      title="Unit Converter"
      description="Convert between common units of length, weight, temperature, volume, area, and speed."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          <NumberInput
            label="Value"
            value={value}
            onChange={setValue}
          />
        </div>

        <div className="flex items-end gap-3 mt-6">
          <div className="flex-1">
            <SelectInput
              label="From"
              value={fromUnit}
              onChange={setFromUnit}
              options={unitOptions}
            />
          </div>
          <button
            onClick={handleSwap}
            className="mb-0.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-lg"
            title="Swap units"
          >
            ↔
          </button>
          <div className="flex-1">
            <SelectInput
              label="To"
              value={toUnit}
              onChange={setToUnit}
              options={unitOptions}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-8">
        <ResultCard
          label="Conversion Result"
          value={`${formatNumber(value, 4)} ${capitalize(fromUnit)} = ${formatNumber(result, 4)} ${capitalize(toUnit)}`}
          color="text-emerald-500"
        />
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Common {capitalize(category)} Conversions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonConversions.map((conv) => (
            <div
              key={`${conv.from}-${conv.to}`}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300"
            >
              1 {capitalize(conv.from)} = {conv.result} {capitalize(conv.to)}
            </div>
          ))}
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
