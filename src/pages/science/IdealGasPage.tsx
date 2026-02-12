import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'pressure' | 'volume' | 'moles' | 'temperature'

const modes: { value: Mode; label: string }[] = [
  { value: 'pressure', label: 'Find P' },
  { value: 'volume', label: 'Find V' },
  { value: 'moles', label: 'Find n' },
  { value: 'temperature', label: 'Find T' },
]

const R = 8.314 // J/(mol*K)

export default function IdealGasPage() {
  const [mode, setMode] = useState<Mode>('pressure')
  const [pressure, setPressure] = useState(101325)
  const [volume, setVolume] = useState(0.0224)
  const [moles, setMoles] = useState(1)
  const [temperature, setTemperature] = useState(273.15)

  const results = useMemo(() => {
    let P: number, V: number, n: number, T: number

    switch (mode) {
      case 'pressure':
        V = volume
        n = moles
        T = temperature
        P = V !== 0 ? (n * R * T) / V : 0
        break
      case 'volume':
        P = pressure
        n = moles
        T = temperature
        V = P !== 0 ? (n * R * T) / P : 0
        break
      case 'moles':
        P = pressure
        V = volume
        T = temperature
        n = R * T !== 0 ? (P * V) / (R * T) : 0
        break
      case 'temperature':
        P = pressure
        V = volume
        n = moles
        T = n * R !== 0 ? (P * V) / (n * R) : 0
        break
    }

    const tempCelsius = T - 273.15
    const pressureAtm = P / 101325

    return { P, V, n, T, tempCelsius, pressureAtm }
  }, [mode, pressure, volume, moles, temperature])

  const fmt = (n: number, decimals = 4): string => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 0.0001)) {
      return n.toExponential(4)
    }
    return parseFloat(n.toFixed(decimals)).toLocaleString()
  }

  return (
    <CalculatorShell
      title="Ideal Gas Law Calculator"
      description="Calculate pressure, volume, moles, or temperature using the Ideal Gas Law: PV = nRT."
    >
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">Gas Constant (R):</span>{' '}
          <span className="font-mono">8.314 J/(mol{'\u00B7'}K)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mode === 'pressure' && (
            <>
              <NumberInput
                label="Volume (V)"
                value={volume}
                onChange={setVolume}
                suffix="m\u00B3"
                min={0}
                step={0.001}
              />
              <NumberInput
                label="Moles (n)"
                value={moles}
                onChange={setMoles}
                suffix="mol"
                min={0}
                step={0.1}
              />
              <NumberInput
                label="Temperature (T)"
                value={temperature}
                onChange={setTemperature}
                suffix="K"
                min={0}
                step={1}
              />
            </>
          )}
          {mode === 'volume' && (
            <>
              <NumberInput
                label="Pressure (P)"
                value={pressure}
                onChange={setPressure}
                suffix="Pa"
                min={0}
                step={100}
              />
              <NumberInput
                label="Moles (n)"
                value={moles}
                onChange={setMoles}
                suffix="mol"
                min={0}
                step={0.1}
              />
              <NumberInput
                label="Temperature (T)"
                value={temperature}
                onChange={setTemperature}
                suffix="K"
                min={0}
                step={1}
              />
            </>
          )}
          {mode === 'moles' && (
            <>
              <NumberInput
                label="Pressure (P)"
                value={pressure}
                onChange={setPressure}
                suffix="Pa"
                min={0}
                step={100}
              />
              <NumberInput
                label="Volume (V)"
                value={volume}
                onChange={setVolume}
                suffix="m\u00B3"
                min={0}
                step={0.001}
              />
              <NumberInput
                label="Temperature (T)"
                value={temperature}
                onChange={setTemperature}
                suffix="K"
                min={0}
                step={1}
              />
            </>
          )}
          {mode === 'temperature' && (
            <>
              <NumberInput
                label="Pressure (P)"
                value={pressure}
                onChange={setPressure}
                suffix="Pa"
                min={0}
                step={100}
              />
              <NumberInput
                label="Volume (V)"
                value={volume}
                onChange={setVolume}
                suffix="m\u00B3"
                min={0}
                step={0.001}
              />
              <NumberInput
                label="Moles (n)"
                value={moles}
                onChange={setMoles}
                suffix="mol"
                min={0}
                step={0.1}
              />
            </>
          )}
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Pressure (P)" value={`${fmt(results.P)} Pa`} color="text-blue-500" />
        <ResultCard label="Volume (V)" value={`${fmt(results.V)} m\u00B3`} color="text-emerald-500" />
        <ResultCard label="Moles (n)" value={`${fmt(results.n)} mol`} color="text-amber-500" />
      </ResultGrid>

      <ResultGrid>
        <ResultCard label="Temperature (T)" value={`${fmt(results.T)} K`} color="text-red-500" />
        <ResultCard label="Temperature (\u00B0C)" value={`${fmt(results.tempCelsius, 2)} \u00B0C`} color="text-orange-500" />
        <ResultCard label="Pressure (atm)" value={`${fmt(results.pressureAtm, 4)} atm`} color="text-indigo-500" />
      </ResultGrid>
    </CalculatorShell>
  )
}
