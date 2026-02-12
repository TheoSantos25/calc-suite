import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'voltage' | 'current' | 'resistance' | 'power'

const modes: { value: Mode; label: string }[] = [
  { value: 'voltage', label: 'Find Voltage' },
  { value: 'current', label: 'Find Current' },
  { value: 'resistance', label: 'Find Resistance' },
  { value: 'power', label: 'Find Power' },
]

const formulaWheel = [
  { header: 'Find Voltage (V)', formulas: ['V = I x R', 'V = P / I', 'V = sqrt(P x R)'] },
  { header: 'Find Current (I)', formulas: ['I = V / R', 'I = P / V', 'I = sqrt(P / R)'] },
  { header: 'Find Resistance (R)', formulas: ['R = V / I', 'R = V² / P', 'R = P / I²'] },
  { header: 'Find Power (P)', formulas: ['P = V x I', 'P = I² x R', 'P = V² / R'] },
]

export default function OhmsLawPage() {
  const [mode, setMode] = useState<Mode>('voltage')
  const [current, setCurrent] = useState(2)
  const [resistance, setResistance] = useState(100)
  const [voltage, setVoltage] = useState(12)
  const [currentForR, setCurrentForR] = useState(0.5)
  const [currentForP, setCurrentForP] = useState(2)
  const [voltageForP, setVoltageForP] = useState(12)

  const results = useMemo(() => {
    let V: number, I: number, R: number, P: number

    switch (mode) {
      case 'voltage':
        I = current
        R = resistance
        V = I * R
        P = V * I
        break
      case 'current':
        V = voltage
        R = resistance
        I = R !== 0 ? V / R : 0
        P = V * I
        break
      case 'resistance':
        V = voltage
        I = currentForR
        R = I !== 0 ? V / I : 0
        P = V * I
        break
      case 'power':
        V = voltageForP
        I = currentForP
        R = I !== 0 ? V / I : 0
        P = V * I
        break
    }

    return { V, I, R, P }
  }, [mode, current, resistance, voltage, currentForR, currentForP, voltageForP])

  const fmt = (n: number, decimals = 4): string => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 0.001)) {
      return n.toExponential(3)
    }
    return parseFloat(n.toFixed(decimals)).toLocaleString()
  }

  return (
    <CalculatorShell
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, resistance, and power using Ohm's Law (V = IR) and the power equation (P = VI)."
    >
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
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
          {mode === 'voltage' && (
            <>
              <NumberInput
                label="Current (I)"
                value={current}
                onChange={setCurrent}
                suffix="A"
                step={0.1}
              />
              <NumberInput
                label="Resistance (R)"
                value={resistance}
                onChange={setResistance}
                suffix="\u03A9"
                step={1}
              />
            </>
          )}
          {mode === 'current' && (
            <>
              <NumberInput
                label="Voltage (V)"
                value={voltage}
                onChange={setVoltage}
                suffix="V"
                step={0.1}
              />
              <NumberInput
                label="Resistance (R)"
                value={resistance}
                onChange={setResistance}
                suffix="\u03A9"
                step={1}
              />
            </>
          )}
          {mode === 'resistance' && (
            <>
              <NumberInput
                label="Voltage (V)"
                value={voltage}
                onChange={setVoltage}
                suffix="V"
                step={0.1}
              />
              <NumberInput
                label="Current (I)"
                value={currentForR}
                onChange={setCurrentForR}
                suffix="A"
                step={0.01}
              />
            </>
          )}
          {mode === 'power' && (
            <>
              <NumberInput
                label="Voltage (V)"
                value={voltageForP}
                onChange={setVoltageForP}
                suffix="V"
                step={0.1}
              />
              <NumberInput
                label="Current (I)"
                value={currentForP}
                onChange={setCurrentForP}
                suffix="A"
                step={0.1}
              />
            </>
          )}
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard label="Voltage (V)" value={`${fmt(results.V)} V`} color="text-yellow-500" />
        <ResultCard label="Current (I)" value={`${fmt(results.I)} A`} color="text-teal-500" />
        <ResultCard label="Resistance (R)" value={`${fmt(results.R)} \u03A9`} color="text-orange-500" />
      </ResultGrid>

      <ResultGrid>
        <ResultCard label="Power (P)" value={`${fmt(results.P)} W`} color="text-red-500" />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Ohm's Law Formula Wheel
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formulaWheel.map((section) => (
            <div
              key={section.header}
              className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4"
            >
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {section.header}
              </h4>
              <ul className="space-y-1">
                {section.formulas.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-slate-600 dark:text-slate-300 font-mono"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
