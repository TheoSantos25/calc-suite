import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router'
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

const iconMap: Record<string, string> = {
  finance: '$',
  mortgage: '\u{1F3E0}',
  car: '\u{1F697}',
  lending: '\u{1F4B3}',
  loan: '\u{1F4C4}',
  salary: '\u{1F4B0}',
  common: '\u{1F527}',
  aitech: '\u{2728}',
  ittools: '\u{1F4BB}',
}

interface DrawerNavProps {
  isOpen: boolean
  onClose: () => void
}

export function DrawerNav({ isOpen, onClose }: DrawerNavProps) {
  const location = useLocation()

  // Close drawer on navigation
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <nav
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out safe-top ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Category navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700/50">
          <NavLink to="/" className="block">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CalcSuite</span>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">by CustomTeQ</span>
          </NavLink>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category list */}
        <div className="overflow-y-auto h-[calc(100%-4rem)] py-2 safe-bottom">
          {categories.map(category => (
            <NavLink
              key={category.id}
              to={`/${category.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 mx-2 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="text-xl leading-none w-8 text-center">{iconMap[category.id] || ''}</span>
              <span className="text-[15px]">{category.name}</span>
              <span className={`ml-auto w-2 h-2 rounded-full ${colorMap[category.color] ?? 'bg-slate-500'}`} />
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
