import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { cliCommands, cliCategories } from '@/utils/cliCommandData'

const categoryColors: Record<string, string> = {
  networking: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'file-ops': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'user-mgmt': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  services: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'system-info': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
}

const platformColors: Record<string, string> = {
  PowerShell: 'bg-blue-500 text-white',
  CMD: 'bg-slate-700 text-white dark:bg-slate-500',
  Linux: 'bg-orange-500 text-white',
}

export default function CLIReferencePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return cliCommands.filter((cmd) => {
      const matchesCategory = activeCategory === 'all' || cmd.category === activeCategory
      const matchesSearch =
        !q ||
        cmd.name.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.powershell.toLowerCase().includes(q) ||
        cmd.cmd.toLowerCase().includes(q) ||
        cmd.linux.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <CalculatorShell
      title="CLI Quick Reference"
      description="Search and look up common commands across PowerShell, CMD, and Linux."
    >
      <GlassCard className="p-6">
        {/* Search input */}
        <div className="space-y-1.5 mb-4">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
            Search Commands
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, or command..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 px-3 focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {cliCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {cliCommands.length} commands
      </p>

      {/* Command cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cmd, i) => (
          <div
            key={cmd.id}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both' }}
          >
          <GlassCard className="p-5 h-full">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                {cmd.name}
              </h4>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[cmd.category] || 'bg-slate-100 text-slate-600'}`}
              >
                {cliCategories.find((c) => c.id === cmd.category)?.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {cmd.description}
            </p>

            <div className="space-y-2">
              {[
                { platform: 'PowerShell', code: cmd.powershell },
                { platform: 'CMD', code: cmd.cmd },
                { platform: 'Linux', code: cmd.linux },
              ].map(({ platform, code }) => {
                const copyId = `${cmd.id}-${platform}`
                return (
                  <div key={platform} className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${platformColors[platform]} min-w-[70px] text-center`}
                    >
                      {platform}
                    </span>
                    <code className="flex-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 overflow-x-auto">
                      {code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(code, copyId)}
                      className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors flex-shrink-0"
                      title={`Copy ${platform} command`}
                    >
                      {copiedId === copyId ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )
              })}
            </div>
          </GlassCard>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No commands match your search. Try different keywords.
          </p>
        </GlassCard>
      )}
    </CalculatorShell>
  )
}
