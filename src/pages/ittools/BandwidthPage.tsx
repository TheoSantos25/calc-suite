import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { NumberInput } from '@/components/ui/NumberInput'
import { SelectInput } from '@/components/ui/SelectInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { BarChart } from '@/components/charts/BarChart'

const fileSizeUnits = [
  { value: 'KB', label: 'KB' },
  { value: 'MB', label: 'MB' },
  { value: 'GB', label: 'GB' },
  { value: 'TB', label: 'TB' },
]

const speedUnits = [
  { value: 'Kbps', label: 'Kbps' },
  { value: 'Mbps', label: 'Mbps' },
  { value: 'Gbps', label: 'Gbps' },
]

const fileSizeMultiplier: Record<string, number> = {
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
}

const speedMultiplier: Record<string, number> = {
  Kbps: 1_000,
  Mbps: 1_000_000,
  Gbps: 1_000_000_000,
}

interface CommonFile {
  name: string
  icon: string
  sizeBytes: number
  displaySize: string
  sizeValue: number
  sizeUnit: string
}

const commonFiles: CommonFile[] = [
  { name: 'Email (text)', icon: '\u2709\uFE0F', sizeBytes: 75 * 1024, displaySize: '75 KB', sizeValue: 75, sizeUnit: 'KB' },
  { name: 'MP3 Song', icon: '\uD83C\uDFB5', sizeBytes: 5 * 1024 ** 2, displaySize: '5 MB', sizeValue: 5, sizeUnit: 'MB' },
  { name: 'Photo (high-res)', icon: '\uD83D\uDCF7', sizeBytes: 5 * 1024 ** 2, displaySize: '5 MB', sizeValue: 5, sizeUnit: 'MB' },
  { name: 'PowerPoint', icon: '\uD83D\uDCCA', sizeBytes: 10 * 1024 ** 2, displaySize: '10 MB', sizeValue: 10, sizeUnit: 'MB' },
  { name: 'HD Movie (720p)', icon: '\uD83C\uDFAC', sizeBytes: 1.5 * 1024 ** 3, displaySize: '1.5 GB', sizeValue: 1.5, sizeUnit: 'GB' },
  { name: 'Full HD Movie', icon: '\uD83C\uDF9E\uFE0F', sizeBytes: 4.7 * 1024 ** 3, displaySize: '4.7 GB', sizeValue: 4.7, sizeUnit: 'GB' },
  { name: '4K Movie', icon: '\uD83D\uDCFD\uFE0F', sizeBytes: 20 * 1024 ** 3, displaySize: '20 GB', sizeValue: 20, sizeUnit: 'GB' },
  { name: 'OS Image (Windows)', icon: '\uD83D\uDCBF', sizeBytes: 5 * 1024 ** 3, displaySize: '5 GB', sizeValue: 5, sizeUnit: 'GB' },
  { name: 'OS Image (Linux)', icon: '\uD83D\uDC27', sizeBytes: 2.5 * 1024 ** 3, displaySize: '2.5 GB', sizeValue: 2.5, sizeUnit: 'GB' },
  { name: 'Full Backup', icon: '\uD83D\uDCE6', sizeBytes: 500 * 1024 ** 3, displaySize: '500 GB', sizeValue: 500, sizeUnit: 'GB' },
]

function formatTime(seconds: number): string {
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export default function BandwidthPage() {
  const [fileSize, setFileSize] = useState(4.7)
  const [fileSizeUnit, setFileSizeUnit] = useState('GB')
  const [speed, setSpeed] = useState(100)
  const [speedUnit, setSpeedUnit] = useState('Mbps')

  const results = useMemo(() => {
    const bytes = fileSize * fileSizeMultiplier[fileSizeUnit]
    const bits = bytes * 8
    const bps = speed * speedMultiplier[speedUnit]
    if (bps === 0) return null

    const seconds = bits / bps
    const mbps = bps / 1_000_000
    const mbytes = bps / 8 / 1024 / 1024

    return { seconds, mbps, mbytes }
  }, [fileSize, fileSizeUnit, speed, speedUnit])

  const chartData = useMemo(() => {
    const bps = speed * speedMultiplier[speedUnit]
    if (bps === 0) return { categories: [], data: [] }

    const items = commonFiles.slice(0, 8) // skip the huge backup for chart
    return {
      categories: items.map((f) => f.name),
      data: items.map((f) => {
        const bits = f.sizeBytes * 8
        return parseFloat((bits / bps).toFixed(1))
      }),
    }
  }, [speed, speedUnit])

  function handleFileClick(file: CommonFile) {
    setFileSize(file.sizeValue)
    setFileSizeUnit(file.sizeUnit)
  }

  return (
    <CalculatorShell
      title="Bandwidth & Transfer Calculator"
      description="Calculate file transfer times based on connection speed and explore common file size references."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="File Size" value={fileSize} onChange={setFileSize} min={0} step={0.1} />
            <SelectInput label="Unit" value={fileSizeUnit} onChange={setFileSizeUnit} options={fileSizeUnits} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Connection Speed" value={speed} onChange={setSpeed} min={0} step={1} />
            <SelectInput label="Unit" value={speedUnit} onChange={setSpeedUnit} options={speedUnits} />
          </div>
        </div>
      </GlassCard>

      {results && (
        <ResultGrid>
          <ResultCard
            label="Transfer Time"
            value={formatTime(results.seconds)}
            color="text-emerald-500"
          />
          <ResultCard
            label="Speed"
            value={`${results.mbps.toFixed(1)} Mbps`}
            color="text-blue-500"
          />
          <ResultCard
            label="Throughput"
            value={`${results.mbytes.toFixed(1)} MB/s`}
            color="text-amber-500"
          />
        </ResultGrid>
      )}

      {/* Common file references */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Common File Sizes
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Click to calculate transfer time
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {commonFiles.map((file, i) => (
            <button
              key={file.name}
              onClick={() => handleFileClick(file)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 text-left cursor-pointer animate-slide-up hover:scale-[1.02] active:scale-[0.98]"
              style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
            >
              <span className="text-2xl block mb-1">{file.icon}</span>
              <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{file.displaySize}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Chart */}
      {chartData.data.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Transfer Times at {speed} {speedUnit}
          </h3>
          <BarChart
            series={[{ name: 'Time (seconds)', data: chartData.data }]}
            categories={chartData.categories}
            height={320}
          />
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
