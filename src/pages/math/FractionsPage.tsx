import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

type Operation = '+' | '-' | '*' | '/'

export default function FractionsPage() {
  const [num1, setNum1] = useState(1)
  const [den1, setDen1] = useState(2)
  const [num2, setNum2] = useState(3)
  const [den2, setDen2] = useState(4)
  const [operation, setOperation] = useState<Operation>('+')

  const results = useMemo(() => {
    const gcd = (a: number, b: number): number => {
      a = Math.abs(Math.round(a))
      b = Math.abs(Math.round(b))
      if (b === 0) return a
      return gcd(b, a % b)
    }

    let resultNum: number
    let resultDen: number

    switch (operation) {
      case '+':
        resultNum = num1 * den2 + num2 * den1
        resultDen = den1 * den2
        break
      case '-':
        resultNum = num1 * den2 - num2 * den1
        resultDen = den1 * den2
        break
      case '*':
        resultNum = num1 * num2
        resultDen = den1 * den2
        break
      case '/':
        resultNum = num1 * den2
        resultDen = den1 * num2
        break
    }

    if (resultDen === 0) {
      return {
        fraction: 'Undefined',
        decimal: 'Undefined',
        mixed: 'Undefined',
        simplifiedNum: 0,
        simplifiedDen: 0,
        error: true,
      }
    }

    // Handle negative denominator
    if (resultDen < 0) {
      resultNum = -resultNum
      resultDen = -resultDen
    }

    const divisor = gcd(Math.abs(resultNum), resultDen)
    const simplifiedNum = resultNum / divisor
    const simplifiedDen = resultDen / divisor

    const decimal = (simplifiedNum / simplifiedDen).toFixed(6)

    let mixed: string
    if (simplifiedDen === 1) {
      mixed = `${simplifiedNum}`
    } else if (Math.abs(simplifiedNum) > simplifiedDen) {
      const whole = Math.trunc(simplifiedNum / simplifiedDen)
      const remainder = Math.abs(simplifiedNum % simplifiedDen)
      mixed = `${whole} ${remainder}/${simplifiedDen}`
    } else {
      mixed = `${simplifiedNum}/${simplifiedDen}`
    }

    const fraction =
      simplifiedDen === 1
        ? `${simplifiedNum}`
        : `${simplifiedNum}/${simplifiedDen}`

    return {
      fraction,
      decimal,
      mixed,
      simplifiedNum,
      simplifiedDen,
      error: false,
    }
  }, [num1, den1, num2, den2, operation])

  const operations: { value: Operation; label: string }[] = [
    { value: '+', label: '+' },
    { value: '-', label: '\u2212' },
    { value: '*', label: '\u00d7' },
    { value: '/', label: '\u00f7' },
  ]

  return (
    <CalculatorShell
      title="Fraction Calculator"
      description="Add, subtract, multiply, or divide fractions. Results are automatically simplified."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <NumberInput
            label="Numerator 1"
            value={num1}
            onChange={setNum1}
            step={1}
          />
          <NumberInput
            label="Denominator 1"
            value={den1}
            onChange={setDen1}
            step={1}
            min={1}
          />
        </div>

        <div className="flex gap-2 mb-6">
          {operations.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-lg font-bold transition-colors ${
                operation === op.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Numerator 2"
            value={num2}
            onChange={setNum2}
            step={1}
          />
          <NumberInput
            label="Denominator 2"
            value={den2}
            onChange={setDen2}
            step={1}
            min={1}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-2">
          {num1}/{den1} {operations.find((o) => o.value === operation)?.label}{' '}
          {num2}/{den2} =
        </p>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Result (Fraction)"
          value={results.fraction}
          color="text-pink-500"
        />
        <ResultCard
          label="Result (Decimal)"
          value={results.error ? 'Undefined' : results.decimal}
          color="text-purple-500"
        />
        <ResultCard
          label="Mixed Number"
          value={results.mixed}
          color="text-emerald-500"
        />
      </ResultGrid>
    </CalculatorShell>
  )
}
