import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'speed' | 'distance' | 'time'

const modes: { value: Mode; label: string }[] = [
  { value: 'speed', label: 'Find Speed' },
  { value: 'distance', label: 'Find Distance' },
  { value: 'time', label: 'Find Time' },
]

export default function SpeedDistanceTimePage() {
  const [mode, setMode] = useState<Mode>('speed')
  const [speed, setSpeed] = useState(60)
  const [distance, setDistance] = useState(120)
  const [time, setTime] = useState(2)

  const results = useMemo(() => {
    let s: number, d: number, t: number

    switch (mode) {
      case 'speed':
        d = distance
        t = time
        s = t !== 0 ? d / t : 0
        break
      case 'distance':
        s = speed
        t = time
        d = s * t
        break
      case 'time':
        s = speed
        d = distance
        t = s !== 0 ? d / s : 0
        break
    }

    const speedMph = s * 0.621371
    const speedMs = s / 3.6
    const distanceMiles = d * 0.621371
    const distanceMeters = d * 1000
    const timeMinutes = t * 60

    return { s, d, t, speedMph, speedMs, distanceMiles, distanceMeters, timeMinutes }
  }, [mode, speed, distance, time])

  const fmt = (n: number, decimals = 4): string => {
    return parseFloat(n.toFixed(decimals)).toLocaleString()
  }

  return (
    <CalculatorShell
      title="Speed / Distance / Time Calculator"
      description="Calculate speed, distance, or time and convert between common units of measurement."
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
          {mode === 'speed' && (
            <>
              <NumberInput
                label="Distance"
                value={distance}
                onChange={setDistance}
                suffix="km"
                min={0}
                step={1}
              />
              <NumberInput
                label="Time"
                value={time}
                onChange={setTime}
                suffix="hrs"
                min={0}
                step={0.1}
              />
            </>
          )}
          {mode === 'distance' && (
            <>
              <NumberInput
                label="Speed"
                value={speed}
                onChange={setSpeed}
                suffix="km/h"
                min={0}
                step={1}
              />
              <NumberInput
                label="Time"
                value={time}
                onChange={setTime}
                suffix="hrs"
                min={0}
                step={0.1}
              />
            </>
          )}
          {mode === 'time' && (
            <>
              <NumberInput
                label="Speed"
                value={speed}
                onChange={setSpeed}
                suffix="km/h"
                min={0}
                step={1}
              />
              <NumberInput
                label="Distance"
                value={distance}
                onChange={setDistance}
                suffix="km"
                min={0}
                step={1}
              />
            </>
          )}
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Speed" value={`${fmt(results.s, 2)} km/h`} color="text-blue-500" />
        <ResultCard label="Distance" value={`${fmt(results.d, 2)} km`} color="text-emerald-500" />
        <ResultCard label="Time" value={`${fmt(results.t, 4)} hrs`} color="text-purple-500" />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Unit Conversions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-blue-500 mb-2">Speed</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.s, 2)} km/h
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.speedMph, 2)} mph
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.speedMs, 2)} m/s
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-emerald-500 mb-2">Distance</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.d, 2)} km
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.distanceMiles, 2)} miles
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.distanceMeters, 0)} meters
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
            <h4 className="text-sm font-semibold text-purple-500 mb-2">Time</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.t, 4)} hours
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {fmt(results.timeMinutes, 2)} minutes
            </p>
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
