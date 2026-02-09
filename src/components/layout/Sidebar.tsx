import { useState } from 'react'
import { NavLink } from 'react-router'
import { categories } from '@/routes/categoryConfig'

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  rose: 'bg-rose-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
}

export function Sidebar() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggleCategory = (id: string) => {
    setExpanded(prev => (prev === id ? null : id))
  }

  return (
    <aside className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700/50">
      <nav className="py-4" aria-label="Calculator categories">
        {categories.map(category => (
          <div key={category.id} className="mb-1">
            <button
              onClick={() => toggleCategory(category.id)}
              aria-expanded={expanded === category.id}
              className="w-full flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mx-2 text-left text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ width: 'calc(100% - 1rem)' }}
            >
              <span className={`w-2 h-2 rounded-full ${colorMap[category.color] ?? 'bg-slate-500'}`} />
              <span className="text-sm font-medium">{category.name}</span>
              <svg
                className={`ml-auto w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${expanded === category.id ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {expanded === category.id && (
              <div className="mt-1 mb-2">
                {category.calculators.map(calc => (
                  <NavLink
                    key={calc.id}
                    to={`${category.basePath}/${calc.path}`}
                    className={({ isActive }) =>
                      `block px-4 py-2 pl-10 text-sm rounded-lg mx-2 transition-colors duration-150 ${
                        isActive
                          ? 'text-primary font-medium bg-primary/10'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`
                    }
                  >
                    {calc.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
