import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Mode = 'findC' | 'findA' | 'findB'

const modes: { value: Mode; label: string }[] = [
  { value: 'findC', label: 'Find c (hypotenuse)' },
  { value: 'findA', label: 'Find a' },
  { value: 'findB', label: 'Find b' },
]

export default function PythagoreanPage() {
  const [mode, setMode] = useState<Mode>('findC')
  const [input1, setInput1] = useState(3)
  const [input2, setInput2] = useState(4)

  const results = useMemo(() => {
    let a: number
    let b: number
    let c: number
    let missingSide: number
    let error = ''

    switch (mode) {
      case 'findC':
        a = input1
        b = input2
        c = Math.sqrt(a * a + b * b)
        missingSide = c
        break
      case 'findA': {
        b = input1
        c = input2
        const aSquared = c * c - b * b
        if (aSquared < 0) {
          error = 'Hypotenuse must be longer than the other side'
          a = 0
          c = input2
          missingSide = 0
        } else {
          a = Math.sqrt(aSquared)
          missingSide = a
        }
        break
      }
      case 'findB': {
        a = input1
        c = input2
        const bSquared = c * c - a * a
        if (bSquared < 0) {
          error = 'Hypotenuse must be longer than the other side'
          b = 0
          c = input2
          missingSide = 0
        } else {
          b = Math.sqrt(bSquared)
          missingSide = b
        }
        break
      }
    }

    // Angles (in degrees)
    let angleA = 0
    let angleB = 0
    if (a > 0 && b > 0 && c > 0 && !error) {
      angleA = (Math.atan(a / b) * 180) / Math.PI
      angleB = 90 - angleA
    }

    return {
      a: a.toFixed(4),
      b: b.toFixed(4),
      c: c.toFixed(4),
      missingSide: error ? 'Invalid' : missingSide.toFixed(4),
      angleA: error ? 'N/A' : angleA.toFixed(2) + '\u00b0',
      angleB: error ? 'N/A' : angleB.toFixed(2) + '\u00b0',
      error,
    }
  }, [mode, input1, input2])

  const inputLabels = useMemo(() => {
    switch (mode) {
      case 'findC':
        return { label1: 'Side a', label2: 'Side b' }
      case 'findA':
        return { label1: 'Side b', label2: 'Side c (hypotenuse)' }
      case 'findB':
        return { label1: 'Side a', label2: 'Side c (hypotenuse)' }
    }
  }, [mode])

  const missingLabel = useMemo(() => {
    switch (mode) {
      case 'findC':
        return 'Side c (hypotenuse)'
      case 'findA':
        return 'Side a'
      case 'findB':
        return 'Side b'
    }
  }, [mode])

  return (
    <CalculatorShell
      title="Pythagorean Theorem Calculator"
      description="Calculate the missing side of a right triangle using a² + b² = c². Also find the angles."
    >
      <GlassCard className="p-6">
        <div className="flex gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label={inputLabels.label1}
            value={input1}
            onChange={setInput1}
            min={0.01}
            step={0.1}
          />
          <NumberInput
            label={inputLabels.label2}
            value={input2}
            onChange={setInput2}
            min={0.01}
            step={0.1}
          />
        </div>
      </GlassCard>

      {results.error && (
        <GlassCard className="p-6">
          <p className="text-sm font-medium text-red-500">{results.error}</p>
        </GlassCard>
      )}

      <ResultGrid>
        <ResultCard
          label={missingLabel}
          value={results.missingSide}
          color="text-pink-500"
        />
        <ResultCard
          label="Side a"
          value={results.a}
          color="text-purple-500"
        />
        <ResultCard
          label="Side b"
          value={results.b}
          color="text-blue-500"
        />
        <ResultCard
          label="Side c (hypotenuse)"
          value={results.c}
          color="text-emerald-500"
        />
        <ResultCard
          label="Angle A (opposite side a)"
          value={results.angleA}
          color="text-amber-500"
          subtitle="arctan(a/b)"
        />
        <ResultCard
          label="Angle B (opposite side b)"
          value={results.angleB}
          color="text-pink-500"
          subtitle="90° - Angle A"
        />
      </ResultGrid>
    </CalculatorShell>
  )
}
