import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { useHackerNews, timeAgo, getDomain } from '@/hooks/aitech/useHackerNews'

export default function TechNewsFeedPage() {
  const { stories, loading, error, refetch } = useHackerNews(20)

  if (loading) {
    return (
      <CalculatorShell
        title="Tech News Feed"
        description="Latest technology news from Hacker News"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} lines={3} />
          ))}
        </div>
      </CalculatorShell>
    )
  }

  if (error) {
    return (
      <CalculatorShell
        title="Tech News Feed"
        description="Latest technology news from Hacker News"
      >
        <GlassCard className="p-6 border-l-4 border-rose-500">
          <p className="text-rose-500 font-semibold mb-2">Failed to load stories</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </GlassCard>
      </CalculatorShell>
    )
  }

  return (
    <CalculatorShell
      title="Tech News Feed"
      description="Top stories from Hacker News — latest in technology, startups, and AI."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stories.map((story, i) => (
          <a
            key={story.id}
            href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-slide-up block"
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
          >
            <GlassCard className="p-5 h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" hover>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  {/* Source domain badge */}
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 mb-2">
                    {getDomain(story.url)}
                  </span>

                  {/* Title */}
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-amber-500">
                        <AnimatedNumber value={story.score} duration={500} />
                      </span>
                      <span>points</span>
                    </span>
                    <span>{story.descendants ?? 0} comments</span>
                    <span className="ml-auto">{timeAgo(story.time)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>
    </CalculatorShell>
  )
}
