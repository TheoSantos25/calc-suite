import { NavLink } from 'react-router'

const tabs = [
  { id: 'finance', label: 'Finance', icon: '$' },
  { id: 'mortgage', label: 'Mortgage', icon: '\u{1F3E0}' },
  { id: 'car', label: 'Car', icon: '\u{1F697}' },
  { id: 'lending', label: 'Lending', icon: '\u{1F4B3}' },
  { id: 'loan', label: 'Loans', icon: '\u{1F4C4}' },
  { id: 'salary', label: 'Salary', icon: '\u{1F4B0}' },
  { id: 'common', label: 'Tools', icon: '\u{1F527}' },
  { id: 'aitech', label: 'AI', icon: '\u{2728}' },
  { id: 'ittools', label: 'IT', icon: '\u{1F4BB}' },
]

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700/50 safe-bottom" aria-label="Category navigation">
      <div className="flex overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            to={`/${tab.id}`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 text-xs transition-colors duration-150 min-w-[3.5rem] flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <span className="text-lg leading-none mb-0.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
