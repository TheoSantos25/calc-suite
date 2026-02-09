import { useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { formatCurrency } from '@/utils/formatters'

interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

interface AmortizationTableProps {
  schedule: AmortizationRow[]
  showYearly?: boolean
}

interface YearlySummary {
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export function AmortizationTable({ schedule, showYearly = false }: AmortizationTableProps) {
  const yearlySummaries = useMemo<YearlySummary[]>(() => {
    if (!showYearly) return []

    const summaries: YearlySummary[] = []
    let currentYear = 1
    let yearPayment = 0
    let yearPrincipal = 0
    let yearInterest = 0
    let yearBalance = 0

    for (const row of schedule) {
      yearPayment += row.payment
      yearPrincipal += row.principal
      yearInterest += row.interest
      yearBalance = row.balance

      if (row.period % 12 === 0) {
        summaries.push({
          year: currentYear,
          payment: yearPayment,
          principal: yearPrincipal,
          interest: yearInterest,
          balance: yearBalance,
        })
        currentYear++
        yearPayment = 0
        yearPrincipal = 0
        yearInterest = 0
      }
    }

    // Handle remaining months that don't complete a full year
    if (schedule.length % 12 !== 0) {
      summaries.push({
        year: currentYear,
        payment: yearPayment,
        principal: yearPrincipal,
        interest: yearInterest,
        balance: yearBalance,
      })
    }

    return summaries
  }, [schedule, showYearly])

  const displayData = showYearly ? yearlySummaries : schedule
  const periodLabel = showYearly ? 'Year' : 'Period'

  if (displayData.length === 0) return null

  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Amortization Schedule
      </h3>
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <th className="text-left py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                {periodLabel}
              </th>
              <th className="text-right py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                Payment
              </th>
              <th className="text-right py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                Principal
              </th>
              <th className="text-right py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                Interest
              </th>
              <th className="text-right py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => {
              const key = showYearly
                ? (row as YearlySummary).year
                : (row as AmortizationRow).period

              return (
                <tr
                  key={key}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-2 px-3 text-slate-900 dark:text-slate-100">
                    {key}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                    {formatCurrency(row.payment)}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(row.principal)}
                  </td>
                  <td className="py-2 px-3 text-right text-red-500 dark:text-red-400">
                    {formatCurrency(row.interest)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
