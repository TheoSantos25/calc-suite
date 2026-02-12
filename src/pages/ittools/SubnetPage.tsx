import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { SliderInput } from '@/components/ui/SliderInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'

function parseIP(ip: string): number[] | null {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) return null
  const octets = parts.map(Number)
  if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) return null
  return octets
}

function octetsToNum(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
}

function numToOctets(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]
}

function numToIP(n: number): string {
  return numToOctets(n).join('.')
}

function cidrToMask(cidr: number): number {
  if (cidr === 0) return 0
  return (~0 << (32 - cidr)) >>> 0
}

function getIPClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D (Multicast)'
  return 'E (Reserved)'
}

const SUBNET_REF = Array.from({ length: 25 }, (_, i) => {
  const cidr = i + 8
  const mask = cidrToMask(cidr)
  const wildcard = (~mask) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usable = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2
  return {
    cidr,
    mask: numToIP(mask),
    wildcard: numToIP(wildcard),
    totalHosts,
    usable,
  }
})

function BitRow({
  label,
  octets,
  cidr,
  type,
}: {
  label: string
  octets: number[]
  cidr: number
  type: 'ip' | 'mask'
}) {
  let bitIndex = 0
  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[80px]">
        {label}
      </span>
      <div className="flex items-center gap-1">
        {octets.map((octet, oi) => (
          <div key={oi} className="flex items-center">
            {Array.from({ length: 8 }).map((_, bi) => {
              const bit = (octet >> (7 - bi)) & 1
              const currentBitIndex = bitIndex++
              const isNetwork = currentBitIndex < cidr
              const colorClass =
                type === 'mask'
                  ? bit
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600'
                  : isNetwork
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                    : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
              return (
                <span
                  key={bi}
                  className={`inline-flex items-center justify-center w-7 h-7 text-xs font-mono rounded border ${colorClass}`}
                >
                  {bit}
                </span>
              )
            })}
            {oi < 3 && (
              <span className="mx-0.5 text-slate-400 dark:text-slate-500 font-bold">.</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SubnetPage() {
  const [ipInput, setIpInput] = useState('192.168.1.0')
  const [cidr, setCidr] = useState(24)

  const results = useMemo(() => {
    const octets = parseIP(ipInput)
    if (!octets) return null

    const ipNum = octetsToNum(octets)
    const mask = cidrToMask(cidr)
    const wildcard = (~mask) >>> 0
    const network = (ipNum & mask) >>> 0
    const broadcast = (network | wildcard) >>> 0

    let firstUsable: number, lastUsable: number, usableHosts: number
    if (cidr === 32) {
      firstUsable = network
      lastUsable = network
      usableHosts = 1
    } else if (cidr === 31) {
      firstUsable = network
      lastUsable = broadcast
      usableHosts = 2
    } else {
      firstUsable = (network + 1) >>> 0
      lastUsable = (broadcast - 1) >>> 0
      usableHosts = Math.pow(2, 32 - cidr) - 2
    }

    return {
      network: numToIP(network),
      broadcast: numToIP(broadcast),
      firstUsable: numToIP(firstUsable),
      lastUsable: numToIP(lastUsable),
      usableHosts,
      mask: numToIP(mask),
      wildcard: numToIP(wildcard),
      ipClass: getIPClass(octets[0]),
      ipOctets: numToOctets(ipNum),
      maskOctets: numToOctets(mask),
    }
  }, [ipInput, cidr])

  const isValid = results !== null

  return (
    <CalculatorShell
      title="Subnet Calculator"
      description="Calculate network addresses, host ranges, and visualize subnet masks in binary."
    >
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
              IP Address
            </label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="192.168.1.0"
              className={`w-full rounded-xl border ${isValid ? 'border-slate-200 dark:border-slate-600' : 'border-rose-400 dark:border-rose-500'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-colors`}
            />
            {!isValid && ipInput.length > 0 && (
              <p className="text-xs text-rose-500">Enter a valid IPv4 address (e.g. 192.168.1.0)</p>
            )}
          </div>
          <SliderInput
            label="CIDR Prefix Length"
            value={cidr}
            onChange={setCidr}
            min={1}
            max={32}
            step={1}
            prefix="/"
          />
        </div>
      </GlassCard>

      {isValid && results && (
        <>
          <ResultGrid>
            <ResultCard label="Network Address" value={results.network} color="text-blue-500" />
            <ResultCard label="Broadcast Address" value={results.broadcast} color="text-orange-500" />
            <ResultCard label="Usable Hosts" value={results.usableHosts.toLocaleString()} color="text-emerald-500" />
          </ResultGrid>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard label="First Usable" value={results.firstUsable} color="text-cyan-500" />
            <ResultCard label="Last Usable" value={results.lastUsable} color="text-purple-500" />
            <ResultCard label="IP Class" value={`Class ${results.ipClass}`} color="text-amber-500" />
            <ResultCard label="Subnet Mask" value={results.mask} color="text-blue-500" />
            <ResultCard label="Wildcard Mask" value={results.wildcard} color="text-rose-500" />
            <ResultCard label="CIDR Notation" value={`${results.network}/${cidr}`} color="text-indigo-500" />
          </div>

          {/* Binary visualization */}
          <GlassCard className="p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Binary Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span className="inline-block w-3 h-3 rounded bg-blue-200 dark:bg-blue-800 mr-1 align-middle" /> Network bits
              <span className="inline-block w-3 h-3 rounded bg-green-200 dark:bg-green-800 ml-3 mr-1 align-middle" /> Host bits
            </p>
            <div className="space-y-3">
              <BitRow label="IP Address" octets={results.ipOctets} cidr={cidr} type="ip" />
              <BitRow label="Subnet Mask" octets={results.maskOctets} cidr={cidr} type="mask" />
            </div>
          </GlassCard>
        </>
      )}

      {/* Reference table */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Common Subnet Reference
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600 first:rounded-tl-lg">CIDR</th>
                <th className="text-left p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600">Subnet Mask</th>
                <th className="text-left p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600">Wildcard</th>
                <th className="text-right p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600">Total</th>
                <th className="text-right p-3 font-semibold text-white bg-slate-700 dark:bg-slate-600 last:rounded-tr-lg">Usable</th>
              </tr>
            </thead>
            <tbody>
              {SUBNET_REF.map((row, i) => (
                <tr
                  key={row.cidr}
                  className={`cursor-pointer transition-colors ${
                    row.cidr === cidr
                      ? 'bg-primary/15 dark:bg-primary/25'
                      : i % 2 === 0
                        ? 'bg-white dark:bg-slate-800'
                        : 'bg-slate-50 dark:bg-slate-800/60'
                  } hover:bg-primary/10 dark:hover:bg-primary/20`}
                  onClick={() => setCidr(row.cidr)}
                >
                  <td className={`p-3 font-mono border-b border-slate-200 dark:border-slate-700 ${row.cidr === cidr ? 'text-primary font-bold' : 'text-slate-900 dark:text-slate-100'}`}>/{row.cidr}</td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{row.mask}</td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{row.wildcard}</td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{row.totalHosts.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">{row.usable.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </CalculatorShell>
  )
}
