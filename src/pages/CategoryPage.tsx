import { Link, useParams } from 'react-router'
import { getCategoryById } from '@/routes/categoryConfig'

const colorMap: Record<string, { gradient: string; border: string; badge: string; iconBg: string }> = {
  emerald: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-l-emerald-500', badge: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400', iconBg: 'bg-emerald-500' },
  blue: { gradient: 'from-blue-500 to-blue-600', border: 'border-l-blue-500', badge: 'bg-blue-500/15 text-blue-500 dark:text-blue-400', iconBg: 'bg-blue-500' },
  orange: { gradient: 'from-orange-500 to-orange-600', border: 'border-l-orange-500', badge: 'bg-orange-500/15 text-orange-500 dark:text-orange-400', iconBg: 'bg-orange-500' },
  purple: { gradient: 'from-purple-500 to-purple-600', border: 'border-l-purple-500', badge: 'bg-purple-500/15 text-purple-500 dark:text-purple-400', iconBg: 'bg-purple-500' },
  cyan: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-l-cyan-500', badge: 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400', iconBg: 'bg-cyan-500' },
  green: { gradient: 'from-green-500 to-green-600', border: 'border-l-green-500', badge: 'bg-green-500/15 text-green-500 dark:text-green-400', iconBg: 'bg-green-500' },
  rose: { gradient: 'from-rose-500 to-rose-600', border: 'border-l-rose-500', badge: 'bg-rose-500/15 text-rose-500 dark:text-rose-400', iconBg: 'bg-rose-500' },
  indigo: { gradient: 'from-indigo-500 to-indigo-600', border: 'border-l-indigo-500', badge: 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400', iconBg: 'bg-indigo-500' },
  amber: { gradient: 'from-amber-500 to-amber-600', border: 'border-l-amber-500', badge: 'bg-amber-500/15 text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-500' },
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = getCategoryById(categoryId || '')

  if (!category) {
    return (
      <div className="animate-fade-in text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Category Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-4">The category you're looking for doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    )
  }

  const colors = colorMap[category.color] || colorMap.indigo

  return (
    <div className="animate-fade-in">
      {/* Category header with gradient */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.gradient} p-6 mb-6 shadow-lg`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-1">
            {category.name}
          </h1>
          <p className="text-white/80 text-sm">
            {category.description}
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
            {category.calculators.length} tools
          </span>
        </div>
      </div>

      {/* Calculator cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.calculators.map((calc, index) => (
          <Link
            key={calc.id}
            to={`${category.basePath}/${calc.path}`}
            className="group animate-slide-up"
            style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'both' }}
          >
            <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border-l-4 ${colors.border} shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 h-full p-5`}>
              {/* Background decoration */}
              <div className={`absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br ${colors.gradient} opacity-[0.07] rounded-full group-hover:scale-[2] transition-transform duration-700`} />
              <div className={`absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br ${colors.gradient} opacity-[0.05] rounded-full group-hover:scale-[2.5] transition-transform duration-700 delay-100`} />

              <div className="relative flex items-start gap-3">
                {/* Number badge */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {calc.description}
                  </p>
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
        ))}
      </div>
    </div>
  )
}
