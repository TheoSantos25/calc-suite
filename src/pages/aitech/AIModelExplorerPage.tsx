import { useState, useMemo } from 'react'
import { CalculatorShell } from '@/components/ui/CalculatorShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { BarChart } from '@/components/charts/BarChart'
import { useHuggingFaceModels, PIPELINE_TYPES } from '@/hooks/aitech/useHuggingFaceModels'
import { formatCompactNumber } from '@/utils/formatters'

const pipelineColors: Record<string, string> = {
  'text-generation': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'text-to-image': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'text-classification': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'token-classification': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'question-answering': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'translation': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'summarization': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'fill-mask': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'image-classification': 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'automatic-speech-recognition': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

export default function AIModelExplorerPage() {
  const { models, loading, error, refetch } = useHuggingFaceModels()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return models
    return models.filter((m) => m.pipeline_tag === activeFilter)
  }, [models, activeFilter])

  const stats = useMemo(() => {
    const totalDownloads = models.reduce((s, m) => s + m.downloads, 0)
    const totalLikes = models.reduce((s, m) => s + m.likes, 0)
    return { totalDownloads, totalLikes, count: models.length }
  }, [models])

  const chartData = useMemo(() => {
    const top10 = [...filtered].sort((a, b) => b.downloads - a.downloads).slice(0, 10)
    return {
      categories: top10.map((m) => m.id.split('/').pop() ?? m.id),
      data: top10.map((m) => m.downloads),
    }
  }, [filtered])

  if (loading) {
    return (
      <CalculatorShell
        title="AI Model Explorer"
        description="Explore trending AI models from Hugging Face"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        title="AI Model Explorer"
        description="Explore trending AI models from Hugging Face"
      >
        <GlassCard className="p-6 border-l-4 border-rose-500">
          <p className="text-rose-500 font-semibold mb-2">Failed to load models</p>
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
      title="AI Model Explorer"
      description="Explore the most popular AI models on Hugging Face by downloads, likes, and pipeline type."
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-5 text-center" hover>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Total Downloads
          </p>
          <p className="text-2xl font-bold text-blue-500">
            <AnimatedNumber value={stats.totalDownloads} formatter={(n) => formatCompactNumber(n)} />
          </p>
        </GlassCard>
        <GlassCard className="p-5 text-center" hover>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Total Likes
          </p>
          <p className="text-2xl font-bold text-rose-500">
            <AnimatedNumber value={stats.totalLikes} formatter={(n) => formatCompactNumber(n)} />
          </p>
        </GlassCard>
        <GlassCard className="p-5 text-center" hover>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Models Loaded
          </p>
          <p className="text-2xl font-bold text-emerald-500">
            <AnimatedNumber value={stats.count} />
          </p>
        </GlassCard>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {PIPELINE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeFilter === type
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      {chartData.data.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Top 10 by Downloads
          </h3>
          <BarChart
            series={[{ name: 'Downloads', data: chartData.data }]}
            categories={chartData.categories}
            height={320}
          />
        </GlassCard>
      )}

      {/* Model cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((model, i) => (
          <a
            key={model.id}
            href={`https://huggingface.co/${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-slide-up block"
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
          >
            <GlassCard className="p-5 h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" hover>
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pipelineColors[model.pipeline_tag] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                >
                  {model.pipeline_tag}
                </span>
              </div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white mb-3 line-clamp-1 hover:text-primary transition-colors">
                {model.id}
              </p>
              <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span>Downloads</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    <AnimatedNumber value={model.downloads} formatter={(n) => formatCompactNumber(n)} duration={600} />
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Likes</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    <AnimatedNumber value={model.likes} formatter={(n) => formatCompactNumber(n)} duration={600} />
                  </span>
                </span>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>
    </CalculatorShell>
  )
}
