import { useState, useCallback, useEffect, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { DonutChart } from '@/components/charts/DonutChart'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function buildPool(upper: boolean, lower: boolean, digits: boolean, symbols: boolean): string {
  let pool = ''
  if (upper) pool += UPPER
  if (lower) pool += LOWER
  if (digits) pool += DIGITS
  if (symbols) pool += SYMBOLS
  return pool
}

function getStrength(entropy: number): { label: string; color: string; percent: number } {
  if (entropy < 28) return { label: 'Weak', color: 'bg-rose-500', percent: 15 }
  if (entropy < 36) return { label: 'Fair', color: 'bg-orange-500', percent: 30 }
  if (entropy < 60) return { label: 'Good', color: 'bg-yellow-500', percent: 50 }
  if (entropy < 80) return { label: 'Strong', color: 'bg-emerald-500', percent: 75 }
  return { label: 'Excellent', color: 'bg-emerald-400', percent: 100 }
}

function analyzeDistribution(pw: string) {
  let upper = 0, lower = 0, digits = 0, symbols = 0
  for (const ch of pw) {
    if (UPPER.includes(ch)) upper++
    else if (LOWER.includes(ch)) lower++
    else if (DIGITS.includes(ch)) digits++
    else symbols++
  }
  return { upper, lower, digits, symbols }
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16)
  const [quantity, setQuantity] = useState(1)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const pool = buildPool(useUpper, useLower, useDigits, useSymbols)

  const generatePasswords = useCallback(() => {
    if (pool.length === 0) return
    const newPasswords: string[] = []
    for (let i = 0; i < quantity; i++) {
      const arr = new Uint32Array(length)
      crypto.getRandomValues(arr)
      const pw = Array.from(arr)
        .map((n) => pool[n % pool.length])
        .join('')
      newPasswords.push(pw)
    }
    setPasswords(newPasswords)
  }, [length, quantity, pool])

  useEffect(() => {
    generatePasswords()
  }, [generatePasswords])

  const entropy = useMemo(() => {
    if (pool.length === 0) return 0
    return length * Math.log2(pool.length)
  }, [length, pool.length])

  const strength = getStrength(entropy)

  const distribution = useMemo(() => {
    if (passwords.length === 0) return null
    return analyzeDistribution(passwords[0])
  }, [passwords])

  function handleToggle(setter: (v: boolean) => void, current: boolean) {
    // Prevent disabling the last enabled option
    const enabledCount = [useUpper, useLower, useDigits, useSymbols].filter(Boolean).length
    if (current && enabledCount <= 1) return
    setter(!current)
  }

  function copyToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function copyAll() {
    navigator.clipboard.writeText(passwords.join('\n'))
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggles = [
    { label: 'ABC', desc: 'Uppercase', enabled: useUpper, setter: setUseUpper },
    { label: 'abc', desc: 'Lowercase', enabled: useLower, setter: setUseLower },
    { label: '123', desc: 'Numbers', enabled: useDigits, setter: setUseDigits },
    { label: '#$&', desc: 'Symbols', enabled: useSymbols, setter: setUseSymbols },
  ]

  return (
    <CalculatorShell
      title="Password Generator"
      description="Generate cryptographically secure passwords with customizable character sets and strength analysis."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Password Length"
            value={length}
            onChange={setLength}
            min={8}
            max={128}
            step={1}
          />
          <SliderInput
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
            step={1}
          />
        </div>

        {/* Toggle buttons */}
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
            Character Sets
          </p>
          <div className="flex gap-3 flex-wrap">
            {toggles.map((t) => (
              <button
                key={t.label}
                onClick={() => handleToggle(t.setter, t.enabled)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  t.enabled
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="font-mono font-bold">{t.label}</span>
                <span className="ml-2 text-xs opacity-80">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={generatePasswords}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            Generate
          </button>
        </div>
      </GlassCard>

      {/* Generated passwords */}
      {passwords.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Generated Password{quantity > 1 ? 's' : ''}
            </h3>
            {quantity > 1 && (
              <button
                onClick={copyAll}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {copiedIndex === -1 ? 'Copied All!' : 'Copy All'}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <code className="flex-1 text-sm font-mono text-slate-900 dark:text-white break-all select-all">
                  {pw}
                </code>
                <button
                  onClick={() => copyToClipboard(pw, i)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors flex-shrink-0"
                >
                  {copiedIndex === i ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Strength analysis */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Strength Analysis
        </h3>

        {/* Strength bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${entropy >= 60 ? 'text-emerald-500' : entropy >= 36 ? 'text-yellow-500' : 'text-rose-500'}`}>
              {strength.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {entropy.toFixed(0)} bits of entropy
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Character Pool</p>
            <p className="font-semibold text-slate-900 dark:text-white">{pool.length} characters</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Possible Combinations</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {pool.length > 0 ? `${pool.length}^${length}` : 'N/A'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Character distribution chart */}
      {distribution && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Character Distribution
          </h3>
          <DonutChart
            series={[distribution.upper, distribution.lower, distribution.digits, distribution.symbols].filter(
              (v) => v > 0,
            )}
            labels={['Uppercase', 'Lowercase', 'Numbers', 'Symbols'].filter(
              (_, i) => [distribution.upper, distribution.lower, distribution.digits, distribution.symbols][i] > 0,
            )}
            height={280}
          />
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
