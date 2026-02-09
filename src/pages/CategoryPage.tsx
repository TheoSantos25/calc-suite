import { Link, useParams } from 'react-router'
import { getCategoryById } from '@/routes/categoryConfig'

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

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary mb-2 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {category.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.calculators.map((calc, index) => (
          <Link
            key={calc.id}
            to={`${category.basePath}/${calc.path}`}
            className="group animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[category.color] || 'from-primary to-accent'} opacity-5 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500`} />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                {calc.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {calc.description}
              </p>
              <div className="mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open calculator →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
