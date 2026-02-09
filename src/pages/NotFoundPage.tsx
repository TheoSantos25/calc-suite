import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Page not found</p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
