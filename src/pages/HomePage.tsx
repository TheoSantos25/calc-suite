import { Link } from 'react-router'
import { categories } from '@/routes/categoryConfig'
import { MarqueeBanner } from '@/components/ui/MarqueeBanner'

const colorMap: Record<string, { gradient: string; border: string; badge: string; glow: string }> = {
  emerald: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-l-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', glow: 'shadow-emerald-500/20' },
  blue: { gradient: 'from-blue-500 to-blue-600', border: 'border-l-blue-500', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', glow: 'shadow-blue-500/20' },
  orange: { gradient: 'from-orange-500 to-orange-600', border: 'border-l-orange-500', badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', glow: 'shadow-orange-500/20' },
  purple: { gradient: 'from-purple-500 to-purple-600', border: 'border-l-purple-500', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', glow: 'shadow-purple-500/20' },
  cyan: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-l-cyan-500', badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', glow: 'shadow-cyan-500/20' },
  green: { gradient: 'from-green-500 to-green-600', border: 'border-l-green-500', badge: 'bg-green-500/10 text-green-600 dark:text-green-400', glow: 'shadow-green-500/20' },
  rose: { gradient: 'from-rose-500 to-rose-600', border: 'border-l-rose-500', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', glow: 'shadow-rose-500/20' },
  indigo: { gradient: 'from-indigo-500 to-indigo-600', border: 'border-l-indigo-500', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', glow: 'shadow-indigo-500/20' },
  amber: { gradient: 'from-amber-500 to-amber-600', border: 'border-l-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', glow: 'shadow-amber-500/20' },
}

const iconMap: Record<string, string> = {
  TrendingUp: '\u{1F4C8}',
  Home: '\u{1F3E0}',
  Car: '\u{1F697}',
  CreditCard: '\u{1F4B3}',
  FileText: '\u{1F4C4}',
  DollarSign: '\u{1F4B0}',
  Calculator: '\u{1F9EE}',
  Sparkles: '\u{2728}',
  Terminal: '\u{1F4BB}',
}

export default function HomePage() {
  const totalCalcs = categories.reduce((sum, c) => sum + c.calculators.length, 0)

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero section with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 p-6 md:p-8 mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-0.5 tracking-tight">
            CalcSuite
          </h1>
          <p className="text-sm text-indigo-200/80 font-medium mb-2">by CustomTeQ</p>
          <p className="text-indigo-100 text-base md:text-lg max-w-xl">
            Your comprehensive toolkit for financial, IT, and everyday calculations
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              {totalCalcs} Tools
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              {categories.length} Categories
            </span>
          </div>
        </div>
      </div>

      <MarqueeBanner />

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((category, index) => {
          const colors = colorMap[category.color] || colorMap.indigo
          return (
            <Link
              key={category.id}
              to={category.basePath}
              className="group block animate-slide-up"
              style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'both' }}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border-l-4 ${colors.border} shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 p-5`}>
                {/* Background decoration */}
                <div className={`absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br ${colors.gradient} opacity-[0.07] rounded-full group-hover:scale-[2] transition-transform duration-700`} />
                <div className={`absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br ${colors.gradient} opacity-[0.05] rounded-full group-hover:scale-[2.5] transition-transform duration-700 delay-100`} />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {iconMap[category.icon] || '\u{1F4CA}'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-[17px] font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.calculators.slice(0, 3).map(calc => (
                        <span
                          key={calc.id}
                          className={`inline-block text-xs px-2.5 py-1 rounded-lg font-medium ${colors.badge}`}
                        >
                          {calc.name}
                        </span>
                      ))}
                      {category.calculators.length > 3 && (
                        <span className="inline-block text-xs px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          +{category.calculators.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-5 right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 text-center text-sm text-slate-400 dark:text-slate-500">
        {totalCalcs} calculators across {categories.length} categories
        <span className="block mt-1 text-xs text-slate-300 dark:text-slate-600">CalcSuite by CustomTeQ</span>
      </div>
    </div>
  )
}
