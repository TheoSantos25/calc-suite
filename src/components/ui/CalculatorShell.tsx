import { Link, useLocation } from 'react-router'
import { getCategoryById } from '@/routes/categoryConfig'
import { CategoryColorProvider } from '@/context/CategoryColorContext'

const gradientMap: Record<string, string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  green: 'from-green-500 to-green-600',
  rose: 'from-rose-500 to-rose-600',
  indigo: 'from-indigo-500 to-indigo-600',
  amber: 'from-amber-500 to-amber-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  sky: 'from-sky-500 to-sky-600',
}

interface CalculatorShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function CalculatorShell({ title, description, children }: CalculatorShellProps) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const categoryId = segments[0] || ''
  const category = getCategoryById(categoryId)
  const gradient = category ? gradientMap[category.color] || 'from-primary to-accent' : 'from-primary to-accent'
  const categoryColor = category?.color || null

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      {/* Gradient header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 md:p-6 shadow-lg`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
        <div className="relative">
          {category && (
            <Link
              to={category.basePath}
              className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {category.name}
            </Link>
          )}
          <h1 className="text-xl md:text-2xl font-extrabold text-white">
            {title}
          </h1>
          <p className="mt-1 text-white/80 text-sm">
            {description}
          </p>
        </div>
      </div>
      <CategoryColorProvider color={categoryColor || 'indigo'}>
        {children}
      </CategoryColorProvider>
    </div>
  )
}
