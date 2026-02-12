import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

export default function GcfLcmPage() {
  const [numA, setNumA] = useState(24)
  const [numB, setNumB] = useState(36)

  const results = useMemo(() => {
    const gcd = (a: number, b: number): number => {
      a = Math.abs(Math.round(a))
      b = Math.abs(Math.round(b))
      if (b === 0) return a
      return gcd(b, a % b)
    }

    const primeFactorize = (n: number): Map<number, number> => {
      const factors = new Map<number, number>()
      n = Math.abs(Math.round(n))
      if (n <= 1) return factors

      let d = 2
      while (d * d <= n) {
        while (n % d === 0) {
          factors.set(d, (factors.get(d) || 0) + 1)
          n /= d
        }
        d++
      }
      if (n > 1) {
        factors.set(n, (factors.get(n) || 0) + 1)
      }
      return factors
    }

    const formatPrimeFactorization = (factors: Map<number, number>): string => {
      if (factors.size === 0) return 'N/A'
      const parts: string[] = []
      const sortedEntries = Array.from(factors.entries()).sort(
        (a, b) => a[0] - b[0]
      )
      for (const [prime, exp] of sortedEntries) {
        if (exp === 1) {
          parts.push(`${prime}`)
        } else {
          parts.push(`${prime}^${exp}`)
        }
      }
      return parts.join(' \u00d7 ')
    }

    const getFactors = (n: number): number[] => {
      n = Math.abs(Math.round(n))
      if (n <= 0) return []
      const factors: number[] = []
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          factors.push(i)
          if (i !== n / i) {
            factors.push(n / i)
          }
        }
      }
      return factors.sort((a, b) => a - b)
    }

    const a = Math.abs(Math.round(numA))
    const b = Math.abs(Math.round(numB))

    if (a === 0 && b === 0) {
      return {
        gcf: 0,
        lcm: 0,
        factorsA: [] as number[],
        factorsB: [] as number[],
        primeA: 'N/A',
        primeB: 'N/A',
        primeAHtml: 'N/A',
        primeBHtml: 'N/A',
      }
    }

    const gcf = gcd(a, b)
    const lcm = a === 0 || b === 0 ? 0 : (a * b) / gcf

    const factorsA = getFactors(a)
    const factorsB = getFactors(b)
    const primeFactorsA = primeFactorize(a)
    const primeFactorsB = primeFactorize(b)

    return {
      gcf,
      lcm,
      factorsA,
      factorsB,
      primeA: formatPrimeFactorization(primeFactorsA),
      primeB: formatPrimeFactorization(primeFactorsB),
      primeAHtml: primeFactorsA,
      primeBHtml: primeFactorsB,
    }
  }, [numA, numB])

  const renderPrimeFactorization = (factors: Map<number, number> | string) => {
    if (typeof factors === 'string') return <span>{factors}</span>
    if (factors.size === 0) return <span>N/A</span>

    const sortedEntries = Array.from(factors.entries()).sort(
      (a, b) => a[0] - b[0]
    )

    return (
      <span>
        {sortedEntries.map(([prime, exp], idx) => (
          <span key={prime}>
            {idx > 0 && ' \u00d7 '}
            {prime}
            {exp > 1 && <sup>{exp}</sup>}
          </span>
        ))}
      </span>
    )
  }

  return (
    <CalculatorShell
      title="GCF & LCM Calculator"
      description="Find the Greatest Common Factor and Least Common Multiple of two numbers, along with prime factorizations."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Number A"
            value={numA}
            onChange={setNumA}
            min={0}
            step={1}
          />
          <NumberInput
            label="Number B"
            value={numB}
            onChange={setNumB}
            min={0}
            step={1}
          />
        </div>
      </GlassCard>

      <ResultGrid>
        <ResultCard
          label="Greatest Common Factor (GCF)"
          value={results.gcf.toString()}
          color="text-pink-500"
        />
        <ResultCard
          label="Least Common Multiple (LCM)"
          value={results.lcm.toString()}
          color="text-purple-500"
        />
      </ResultGrid>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Prime Factorizations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              {Math.abs(Math.round(numA))}
            </p>
            <p className="text-lg font-semibold text-pink-500">
              {renderPrimeFactorization(results.primeAHtml)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              {Math.abs(Math.round(numB))}
            </p>
            <p className="text-lg font-semibold text-purple-500">
              {renderPrimeFactorization(results.primeBHtml)}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          All Factors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Factors of {Math.abs(Math.round(numA))}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
              {results.factorsA.length > 0
                ? results.factorsA.join(', ')
                : 'None'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Factors of {Math.abs(Math.round(numB))}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
              {results.factorsB.length > 0
                ? results.factorsB.join(', ')
                : 'None'}
            </p>
          </div>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
