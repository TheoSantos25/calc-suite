import { GlassCard } from '@/components/ui/GlassCard'

interface ComparisonTableProps {
  headers: string[]
  rows: { label: string; values: (string | number)[]; highlight?: number }[]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <GlassCard className="p-5">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <th className="text-left py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                {/* empty corner cell */}
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="text-right py-2 px-3 font-medium text-slate-500 dark:text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-slate-100 dark:border-slate-700"
              >
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                  {row.label}
                </td>
                {row.values.map((val, colIndex) => {
                  const isHighlighted = row.highlight !== undefined && colIndex === row.highlight
                  return (
                    <td
                      key={colIndex}
                      className={`py-2.5 px-3 text-right ${
                        isHighlighted
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-semibold'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
