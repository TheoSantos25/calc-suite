import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'fma' | 'work' | 'ke'

const modes: { value: Mode; label: string }[] = [
  { value: 'fma', label: 'F = ma' },
  { value: 'work', label: 'Work = F\u00D7d' },
  { value: 'ke', label: 'KE = \u00BDmv\u00B2' },
]

const GRAVITY = 9.8

export default function ForceMotionPage() {
  const [mode, setMode] = useState<Mode>('fma')

  // F = ma inputs
  const [mass, setMass] = useState(10)
  const [acceleration, setAcceleration] = useState(9.8)

  // Work = F*d inputs
  const [force, setForce] = useState(50)
  const [workDistance, setWorkDistance] = useState(10)

  // KE = 0.5*m*v^2 inputs
  const [keMass, setKeMass] = useState(5)
  const [velocity, setVelocity] = useState(10)

  const results = useMemo(() => {
    switch (mode) {
      case 'fma': {
        const F = mass * acceleration
        const weight = mass * GRAVITY
        return {
          primary: { label: 'Force (F)', value: F, unit: 'N', color: 'text-blue-500' as const },
          extras: [
            { label: 'Weight (F = mg)', value: weight, unit: 'N', color: 'text-amber-500' as const },
            { label: 'Momentum (p = mv)', value: mass * acceleration, unit: 'kg\u00B7m/s', color: 'text-purple-500' as const },
          ],
        }
      }
      case 'work': {
        const W = force * workDistance
        return {
          primary: { label: 'Work (W)', value: W, unit: 'J', color: 'text-emerald-500' as const },
          extras: [
            { label: 'Work in kJ', value: W / 1000, unit: 'kJ', color: 'text-teal-500' as const },
            { label: 'Work in cal', value: W / 4.184, unit: 'cal', color: 'text-orange-500' as const },
          ],
        }
      }
      case 'ke': {
        const KE = 0.5 * keMass * velocity * velocity
        return {
          primary: { label: 'Kinetic Energy (KE)', value: KE, unit: 'J', color: 'text-red-500' as const },
          extras: [
            { label: 'KE in kJ', value: KE / 1000, unit: 'kJ', color: 'text-teal-500' as const },
            { label: 'Momentum (p = mv)', value: keMass * velocity, unit: 'kg\u00B7m/s', color: 'text-purple-500' as const },
          ],
        }
      }
    }
  }, [mode, mass, acceleration, force, workDistance, keMass, velocity])

  const fmt = (n: number, decimals = 4): string => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 0.001)) {
      return n.toExponential(3)
    }
    return parseFloat(n.toFixed(decimals)).toLocaleString()
  }

  return (
    <CalculatorShell
      title="Force & Motion Calculator"
      description="Calculate force, work, and kinetic energy using Newton's laws of motion."
    >
      <GlassCard className="p-6">
        <div className="flex gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mode === 'fma' && (
            <>
              <NumberInput
                label="Mass (m)"
                value={mass}
                onChange={setMass}
                suffix="kg"
                min={0}
                step={0.1}
              />
              <NumberInput
                label="Acceleration (a)"
                value={acceleration}
                onChange={setAcceleration}
                suffix="m/s\u00B2"
                step={0.1}
              />
            </>
          )}
          {mode === 'work' && (
            <>
              <NumberInput
                label="Force (F)"
                value={force}
                onChange={setForce}
                suffix="N"
                min={0}
                step={1}
              />
              <NumberInput
                label="Distance (d)"
                value={workDistance}
                onChange={setWorkDistance}
                suffix="m"
                min={0}
                step={0.1}
              />
            </>
          )}
          {mode === 'ke' && (
            <>
              <NumberInput
                label="Mass (m)"
                value={keMass}
                onChange={setKeMass}
                suffix="kg"
                min={0}
                step={0.1}
              />
              <NumberInput
                label="Velocity (v)"
                value={velocity}
                onChange={setVelocity}
                suffix="m/s"
                step={0.1}
              />
            </>
          )}
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label={results.primary.label}
          value={`${fmt(results.primary.value)} ${results.primary.unit}`}
          color={results.primary.color}
        />
        {results.extras.map((extra) => (
          <ResultCard
            key={extra.label}
            label={extra.label}
            value={`${fmt(extra.value)} ${extra.unit}`}
            color={extra.color}
          />
        ))}
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Key Formulas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Newton's 2nd Law
            </h4>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-300">F = m x a</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Force equals mass times acceleration
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Work
            </h4>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-300">W = F x d</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Work equals force times distance
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Kinetic Energy
            </h4>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-300">KE = {'\u00BD'}mv{'\u00B2'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Half of mass times velocity squared
            </p>
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
