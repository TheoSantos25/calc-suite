import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateAge } from '@/utils/financial'
import { formatNumber } from '@/utils/formatters'

export default function AgePage() {
  const [birthDateStr, setBirthDateStr] = useState('1990-01-01')

  const results = useMemo(() => {
    const date = new Date(birthDateStr + 'T00:00:00')
    if (isNaN(date.getTime())) return null
    return calculateAge(date)
  }, [birthDateStr])

  const lifeStats = useMemo(() => {
    if (!results) return null
    const ageInYears = results.years + results.months / 12 + results.days / 365.25
    const minutesLived = ageInYears * 365.25 * 24 * 60
    const heartbeats = Math.floor(minutesLived * 72)
    const breaths = Math.floor(minutesLived * 16)
    return { heartbeats, breaths }
  }, [results])

  return (
    <CalculatorShell
      title="Age Calculator"
      description="Find out your exact age in years, months, days, and discover fun life statistics."
    >
      <GlassCard className="p-6">
        <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          value={birthDateStr}
          onChange={(e) => setBirthDateStr(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </GlassCard>

      {results && (
        <>
          <ResultGrid>
            <ResultCard
              label="Years"
              value={String(results.years)}
              color="text-emerald-500"
              subtitle={`${results.months} months, ${results.days} days`}
            />
            <ResultCard
              label="Months"
              value={formatNumber(results.totalMonths)}
              color="text-blue-500"
              subtitle="Total months lived"
            />
            <ResultCard
              label="Days"
              value={String(results.days)}
              color="text-purple-500"
              subtitle="Days in current month"
            />
            <ResultCard
              label="Total Days"
              value={formatNumber(results.totalDays)}
              color="text-slate-500"
              subtitle="Since birth"
            />
            <ResultCard
              label="Total Weeks"
              value={formatNumber(results.totalWeeks)}
              color="text-slate-500"
              subtitle="Since birth"
            />
            <ResultCard
              label="Days Until Birthday"
              value={formatNumber(results.daysUntilBirthday)}
              color="text-orange-500"
              subtitle="Next birthday countdown"
            />
          </ResultGrid>

          {lifeStats && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Life Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                    Approximate Heartbeats
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {formatNumber(lifeStats.heartbeats)}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    Based on ~72 beats per minute
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30">
                  <p className="text-sm text-sky-600 dark:text-sky-400 font-medium mb-1">
                    Approximate Breaths
                  </p>
                  <p className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                    {formatNumber(lifeStats.breaths)}
                  </p>
                  <p className="text-xs text-sky-500 dark:text-sky-400 mt-1">
                    Based on ~16 breaths per minute
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </CalculatorShell>
  )
}
