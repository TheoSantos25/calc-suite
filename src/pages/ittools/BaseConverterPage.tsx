import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SelectInput } from '@/components/ui/SelectInput'
import { GlassCard } from '@/components/ui/GlassCard'

const baseOptions = [
  { value: 'dec', label: 'Decimal (Base 10)' },
  { value: 'bin', label: 'Binary (Base 2)' },
  { value: 'oct', label: 'Octal (Base 8)' },
  { value: 'hex', label: 'Hexadecimal (Base 16)' },
]

const radixMap: Record<string, number> = { dec: 10, bin: 2, oct: 8, hex: 16 }

function padBinary(bin: string, minBits = 8): string {
  const padded = bin.padStart(Math.ceil(bin.length / minBits) * minBits, '0')
  return padded.replace(/(.{4})/g, '$1 ').trim()
}

export default function BaseConverterPage() {
  const [inputValue, setInputValue] = useState('255')
  const [inputBase, setInputBase] = useState('dec')
  const [bitValues, setBitValues] = useState<boolean[]>([false, false, false, false, false, false, false, false])
  const [bitSyncSource, setBitSyncSource] = useState<'text' | 'bits'>('text')

  const parsed = useMemo(() => {
    const radix = radixMap[inputBase]
    const cleaned = inputValue.replace(/\s/g, '')
    if (cleaned === '') return null
    const n = parseInt(cleaned, radix)
    if (isNaN(n) || n < 0 || n > 4294967295) return null
    return n
  }, [inputValue, inputBase])

  const conversions = useMemo(() => {
    if (parsed === null) return null
    return {
      dec: parsed.toString(10),
      bin: padBinary(parsed.toString(2)),
      oct: parsed.toString(8),
      hex: parsed.toString(16).toUpperCase(),
    }
  }, [parsed])

  // Sync bits from text input
  const displayBits = useMemo(() => {
    if (bitSyncSource === 'bits') return bitValues
    if (parsed === null) return [false, false, false, false, false, false, false, false]
    const byte = parsed & 0xff
    return Array.from({ length: 8 }, (_, i) => ((byte >> (7 - i)) & 1) === 1)
  }, [parsed, bitValues, bitSyncSource])

  const byteValue = useMemo(() => {
    let v = 0
    for (let i = 0; i < 8; i++) {
      if (displayBits[i]) v |= 1 << (7 - i)
    }
    return v
  }, [displayBits])

  function handleTextChange(val: string) {
    setInputValue(val)
    setBitSyncSource('text')
  }

  function handleBaseChange(base: string) {
    // Convert current value to the new base display
    if (parsed !== null) {
      const radix = radixMap[base]
      setInputValue(parsed.toString(radix).toUpperCase())
    }
    setInputBase(base)
    setBitSyncSource('text')
  }

  function toggleBit(index: number) {
    const newBits = [...displayBits]
    newBits[index] = !newBits[index]
    setBitValues(newBits)
    setBitSyncSource('bits')

    let v = 0
    for (let i = 0; i < 8; i++) {
      if (newBits[i]) v |= 1 << (7 - i)
    }
    setInputValue(v.toString(radixMap[inputBase]).toUpperCase())
  }

  // Counting table pagination
  const [page, setPage] = useState(0)
  const pageSize = 16
  const totalPages = 16 // 256 / 16
  const tableRows = useMemo(() => {
    const start = page * pageSize
    return Array.from({ length: pageSize }, (_, i) => {
      const n = start + i
      return {
        dec: n,
        bin: n.toString(2).padStart(8, '0'),
        oct: n.toString(8),
        hex: n.toString(16).toUpperCase(),
      }
    })
  }, [page])

  const positionValues = [128, 64, 32, 16, 8, 4, 2, 1]

  return (
    <CalculatorShell
      title="Number Base Converter"
      description="Convert between binary, octal, decimal, and hexadecimal with interactive bit visualization."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Input Base"
            value={inputBase}
            onChange={handleBaseChange}
            options={baseOptions}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
              Value
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter a number"
              className={`w-full rounded-xl border ${parsed !== null || inputValue === '' ? 'border-slate-200 dark:border-slate-600' : 'border-rose-400 dark:border-rose-500'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-colors`}
            />
            {parsed === null && inputValue !== '' && (
              <p className="text-xs text-rose-500">Invalid value for {baseOptions.find(o => o.value === inputBase)?.label}</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* All 4 base representations */}
      {conversions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Decimal', value: conversions.dec, prefix: '', color: 'text-blue-500' },
            { label: 'Binary', value: conversions.bin, prefix: '0b', color: 'text-emerald-500' },
            { label: 'Octal', value: conversions.oct, prefix: '0o', color: 'text-purple-500' },
            { label: 'Hexadecimal', value: `0x${conversions.hex}`, prefix: '', color: 'text-amber-500' },
          ].map(({ label, value, color }) => (
            <GlassCard key={label} className="p-5" hover>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {label}
              </p>
              <p className={`text-xl font-bold font-mono ${color} break-all`}>{value}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Interactive 8-bit breakdown */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          8-Bit Interactive Breakdown
        </h3>
        <div className="flex flex-col items-center gap-2">
          {/* Position value headers */}
          <div className="flex gap-1">
            {positionValues.map((v, i) => (
              <div
                key={i}
                className={`w-12 text-center text-xs font-medium ${i < 4 ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}`}
              >
                {v}
              </div>
            ))}
          </div>
          {/* Toggleable bit cells */}
          <div className="flex gap-1">
            {displayBits.map((bit, i) => (
              <button
                key={i}
                onClick={() => toggleBit(i)}
                className={`w-12 h-12 rounded-lg text-lg font-bold font-mono border-2 transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95 ${
                  bit
                    ? i < 4
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                      : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-400 dark:border-cyan-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-600'
                }`}
              >
                {bit ? 1 : 0}
              </button>
            ))}
          </div>
          {/* Nibble labels */}
          <div className="flex gap-1">
            <div className="w-[204px] text-center text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              High Nibble (0x{((byteValue >> 4) & 0xf).toString(16).toUpperCase()})
            </div>
            <div className="w-[204px] text-center text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
              Low Nibble (0x{(byteValue & 0xf).toString(16).toUpperCase()})
            </div>
          </div>
          {/* Result */}
          <div className="mt-2 text-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">= </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">{byteValue}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400"> decimal</span>
            <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xl font-bold text-amber-500 font-mono">0x{byteValue.toString(16).toUpperCase().padStart(2, '0')}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400"> hex</span>
          </div>
        </div>
      </GlassCard>

      {/* Counting table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Decimal / Binary / Octal / Hex Table
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Prev
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {page * pageSize}-{page * pageSize + pageSize - 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 dark:bg-slate-900">
                <th className="text-left p-3 font-semibold text-white">Decimal</th>
                <th className="text-left p-3 font-semibold text-white">Binary</th>
                <th className="text-left p-3 font-semibold text-white">Octal</th>
                <th className="text-left p-3 font-semibold text-white">Hex</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr
                  key={row.dec}
                  className={`border-b border-slate-200 dark:border-slate-700/50 ${
                    parsed === row.dec
                      ? 'bg-amber-50 dark:bg-amber-900/20'
                      : i % 2 === 0
                        ? 'bg-slate-50 dark:bg-slate-800/50'
                        : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  <td className="p-3 font-mono text-slate-900 dark:text-slate-200">{row.dec}</td>
                  <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{row.bin}</td>
                  <td className="p-3 font-mono text-purple-600 dark:text-purple-400">{row.oct}</td>
                  <td className="p-3 font-mono text-amber-600 dark:text-amber-400">{row.hex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
