import { Link } from 'react-router'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <Link to="/" className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          CalcSuite
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
