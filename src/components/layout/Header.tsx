import { Link } from 'react-router'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50 safe-top">
      <div className="h-16 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Hamburger button - mobile only */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CalcSuite
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
