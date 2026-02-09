import { Link } from 'react-router'
import { categories } from '@/routes/categoryConfig'

const colorClasses: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

interface PillItem {
  name: string
  path: string
  color: string
}

function buildItems(): PillItem[] {
  const items: PillItem[] = []
  for (const cat of categories) {
    for (const calc of cat.calculators) {
      items.push({
        name: calc.name,
        path: `${cat.basePath}/${calc.path}`,
        color: cat.color,
      })
    }
  }
  return items
}

function PillRow({ items, direction }: { items: PillItem[]; direction: 'left' | 'right' }) {
  const doubled = [...items, ...items]
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="overflow-hidden relative group">
      {/* Gradient edge masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-light dark:from-surface-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-light dark:from-surface-dark to-transparent z-10 pointer-events-none" />

      <div
        className={`flex gap-3 ${animClass} will-change-transform`}
        style={{ width: 'max-content' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running' }}
      >
        {doubled.map((item, i) => (
          <Link
            key={`${item.path}-${i}`}
            to={item.path}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-md ${colorClasses[item.color] || colorClasses.emerald}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MarqueeBanner() {
  const allItems = buildItems()
  const mid = Math.ceil(allItems.length / 2)
  const row1 = allItems.slice(0, mid)
  const row2 = allItems.slice(mid)

  return (
    <div className="space-y-3 my-6">
      <PillRow items={row1} direction="left" />
      <PillRow items={row2} direction="right" />
    </div>
  )
}
