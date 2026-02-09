import { Link } from 'react-router'
import { categories } from '@/routes/categoryConfig'
import { MarqueeBanner } from '@/components/ui/MarqueeBanner'

const colorMap: Record<string, string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  green: 'from-green-500 to-green-600',
  rose: 'from-rose-500 to-rose-600',
  indigo: 'from-indigo-500 to-indigo-600',
  amber: 'from-amber-500 to-amber-600',
}

const iconMap: Record<string, string> = {
  TrendingUp: '📈',
  Home: '🏠',
  Car: '🚗',
  CreditCard: '💳',
  FileText: '📄',
  DollarSign: '💰',
  Calculator: '🧮',
  Sparkles: '✨',
  Terminal: '💻',
}

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          CalcSuite
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Your comprehensive toolkit for financial and everyday calculations
        </p>
      </div>

      <MarqueeBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={category.basePath}
            className="group block animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[category.color] || 'from-primary to-accent'} opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`} />

              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[category.color] || 'from-primary to-accent'} flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {iconMap[category.icon] || '📊'}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.calculators.slice(0, 3).map(calc => (
                      <span
                        key={calc.id}
                        className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {calc.name}
                      </span>
                    ))}
                    {category.calculators.length > 3 && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        +{category.calculators.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-slate-400 dark:text-slate-500">
        {categories.reduce((sum, c) => sum + c.calculators.length, 0)} calculators across {categories.length} categories
      </div>
    </div>
  )
}
