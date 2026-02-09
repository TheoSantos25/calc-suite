import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateBMI } from '@/utils/financial'
import { formatNumber } from '@/utils/formatters'

type UnitSystem = 'imperial' | 'metric'

const bmiRanges = [
  { label: 'Underweight', max: 18.5, color: '#3b82f6', bg: 'bg-blue-500' },
  { label: 'Normal', max: 25, color: '#22c55e', bg: 'bg-green-500' },
  { label: 'Overweight', max: 30, color: '#f59e0b', bg: 'bg-yellow-500' },
  { label: 'Obese', max: 50, color: '#ef4444', bg: 'bg-red-500' },
]

export default function BMIPage() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [weightLbs, setWeightLbs] = useState(160)
  const [heightFt, setHeightFt] = useState(5)
  const [heightIn, setHeightIn] = useState(8)
  const [weightKg, setWeightKg] = useState(70)
  const [heightCm, setHeightCm] = useState(170)

  const results = useMemo(() => {
    let kg: number
    let meters: number

    if (unitSystem === 'imperial') {
      kg = weightLbs * 0.453592
      meters = (heightFt * 12 + heightIn) * 0.0254
    } else {
      kg = weightKg
      meters = heightCm / 100
    }

    return calculateBMI(kg, meters)
  }, [unitSystem, weightLbs, heightFt, heightIn, weightKg, heightCm])

  const bmiPosition = useMemo(() => {
    const minBMI = 10
    const maxBMI = 45
    const clampedBMI = Math.min(Math.max(results.bmi, minBMI), maxBMI)
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100
  }, [results.bmi])

  return (
    <CalculatorShell
      title="BMI Calculator"
      description="Calculate your Body Mass Index and see where you fall on the BMI scale."
    >
      <GlassCard className="p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              unitSystem === 'imperial'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Imperial (lbs/ft)
          </button>
          <button
            onClick={() => setUnitSystem('metric')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              unitSystem === 'metric'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Metric (kg/cm)
          </button>
        </div>

        {unitSystem === 'imperial' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Weight"
              value={weightLbs}
              onChange={setWeightLbs}
              min={80}
              max={400}
              step={1}
              suffix="lbs"
            />
            <SliderInput
              label="Height (feet)"
              value={heightFt}
              onChange={setHeightFt}
              min={3}
              max={7}
              step={1}
              suffix="ft"
            />
            <SliderInput
              label="Height (inches)"
              value={heightIn}
              onChange={setHeightIn}
              min={0}
              max={11}
              step={1}
              suffix="in"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Weight"
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={200}
              step={0.5}
              suffix="kg"
            />
            <SliderInput
              label="Height"
              value={heightCm}
              onChange={setHeightCm}
              min={100}
              max={250}
              step={1}
              suffix="cm"
            />
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <ResultCard
          label="Your BMI"
          value={formatNumber(results.bmi, 1)}
          color={
            results.bmi < 18.5
              ? 'text-blue-500'
              : results.bmi < 25
                ? 'text-green-500'
                : results.bmi < 30
                  ? 'text-yellow-500'
                  : 'text-red-500'
          }
          subtitle={results.category}
        />
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          BMI Scale
        </h3>

        <div className="relative mb-8">
          {/* Scale bar */}
          <div className="flex h-6 rounded-full overflow-hidden">
            <div className="bg-blue-500 flex-1" title="Underweight" />
            <div className="bg-green-500 flex-[1.86]" title="Normal" />
            <div className="bg-yellow-500 flex-[1.43]" title="Overweight" />
            <div className="bg-red-500 flex-[4.29]" title="Obese" />
          </div>

          {/* Position indicator */}
          <div
            className="absolute -top-2 transition-all duration-300"
            style={{ left: `${bmiPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-white" />
          </div>

          {/* Labels under the scale */}
          <div className="flex mt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex-1 text-left">10</div>
            <div style={{ position: 'absolute', left: `${((18.5 - 10) / 35) * 100}%`, transform: 'translateX(-50%)' }}>
              18.5
            </div>
            <div style={{ position: 'absolute', left: `${((25 - 10) / 35) * 100}%`, transform: 'translateX(-50%)' }}>
              25
            </div>
            <div style={{ position: 'absolute', left: `${((30 - 10) / 35) * 100}%`, transform: 'translateX(-50%)' }}>
              30
            </div>
            <div className="flex-1 text-right">45</div>
          </div>
        </div>

        {/* Category legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {bmiRanges.map((range) => (
            <div
              key={range.label}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50"
            >
              <div className={`w-3 h-3 rounded-full ${range.bg}`} />
              <div className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-medium">{range.label}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">
                  {range.label === 'Underweight'
                    ? '< 18.5'
                    : range.label === 'Normal'
                      ? '18.5 - 25'
                      : range.label === 'Overweight'
                        ? '25 - 30'
                        : '> 30'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
