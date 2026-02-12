import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'density' | 'mass' | 'volume'

const modes: { value: Mode; label: string }[] = [
  { value: 'density', label: 'Find Density' },
  { value: 'mass', label: 'Find Mass' },
  { value: 'volume', label: 'Find Volume' },
]

const commonMaterials = [
  { name: 'Water', density: 1000 },
  { name: 'Air', density: 1.225 },
  { name: 'Iron', density: 7874 },
  { name: 'Gold', density: 19320 },
  { name: 'Aluminum', density: 2700 },
  { name: 'Wood (Oak)', density: 600 },
  { name: 'Concrete', density: 2400 },
  { name: 'Ice', density: 917 },
]

export default function DensityPage() {
  const [mode, setMode] = useState<Mode>('density')
  const [density, setDensity] = useState(1000)
  const [mass, setMass] = useState(500)
  const [volume, setVolume] = useState(0.5)

  const results = useMemo(() => {
    let rho: number, m: number, v: number

    switch (mode) {
      case 'density':
        m = mass
        v = volume
        rho = v !== 0 ? m / v : 0
        break
      case 'mass':
        rho = density
        v = volume
        m = rho * v
        break
      case 'volume':
        rho = density
        m = mass
        v = rho !== 0 ? m / rho : 0
        break
    }

    return { rho, m, v }
  }, [mode, density, mass, volume])

  const fmt = (n: number, decimals = 4): string => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 0.001)) {
      return n.toExponential(3)
    }
    return parseFloat(n.toFixed(decimals)).toLocaleString()
  }

  return (
    <CalculatorShell
      title="Density Calculator"
      description="Calculate density, mass, or volume using the formula \u03C1 = m / V. Includes a reference table of common material densities."
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
          {mode === 'density' && (
            <>
              <NumberInput
                label="Mass (m)"
                value={mass}
                onChange={setMass}
                suffix="kg"
                min={0}
                step={1}
              />
              <NumberInput
                label="Volume (V)"
                value={volume}
                onChange={setVolume}
                suffix="m\u00B3"
                min={0}
                step={0.01}
              />
            </>
          )}
          {mode === 'mass' && (
            <>
              <NumberInput
                label="Density (\u03C1)"
                value={density}
                onChange={setDensity}
                suffix="kg/m\u00B3"
                min={0}
                step={1}
              />
              <NumberInput
                label="Volume (V)"
                value={volume}
                onChange={setVolume}
                suffix="m\u00B3"
                min={0}
                step={0.01}
              />
            </>
          )}
          {mode === 'volume' && (
            <>
              <NumberInput
                label="Density (\u03C1)"
                value={density}
                onChange={setDensity}
                suffix="kg/m\u00B3"
                min={0}
                step={1}
              />
              <NumberInput
                label="Mass (m)"
                value={mass}
                onChange={setMass}
                suffix="kg"
                min={0}
                step={1}
              />
            </>
          )}
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Density (\u03C1)" value={`${fmt(results.rho)} kg/m\u00B3`} color="text-blue-500" />
        <ResultCard label="Mass (m)" value={`${fmt(results.m)} kg`} color="text-emerald-500" />
        <ResultCard label="Volume (V)" value={`${fmt(results.v)} m\u00B3`} color="text-purple-500" />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Common Material Densities
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600 first:rounded-tl-lg">
                  Material
                </th>
                <th className="text-right p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600 last:rounded-tr-lg">
                  Density (kg/m{'\u00B3'})
                </th>
              </tr>
            </thead>
            <tbody>
              {commonMaterials.map((mat, i) => (
                <tr
                  key={mat.name}
                  className={
                    i % 2 === 0
                      ? 'bg-white dark:bg-slate-800'
                      : 'bg-slate-50 dark:bg-slate-800/60'
                  }
                >
                  <td className="p-3 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                    {mat.name}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    {mat.density.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
