import { useState, useEffect, useRef } from 'react'

export interface HNStory {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  descendants: number
}

interface UseHackerNewsResult {
  stories: HNStory[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useHackerNews(count = 20): UseHackerNewsResult {
  const [stories, setStories] = useState<HNStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  function fetchStories() {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((ids: number[]) => {
        const topIds = ids.slice(0, count)
        return Promise.allSettled(
          topIds.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
              signal: controller.signal,
            }).then((r) => r.json()),
          ),
        )
      })
      .then((results) => {
        const items: HNStory[] = results
          .filter((r): r is PromiseFulfilledResult<HNStory> => r.status === 'fulfilled' && r.value)
          .map((r) => r.value)
        setStories(items)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch stories')
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    fetchStories()
    return () => { abortRef.current?.abort() }
  }, [count])

  return { stories, loading, error, refetch: fetchStories }
}

export function timeAgo(unixTime: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unixTime)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function getDomain(url?: string): string {
  if (!url) return 'news.ycombinator.com'
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'link'
  }
}
