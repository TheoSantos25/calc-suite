import { useState, useEffect, useRef, useCallback } from 'react'

export interface CurrencyRates {
  base: string
  date: string
  rates: Record<string, number>
}

interface UseCurrencyRatesResult {
  rates: CurrencyRates | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const rateCache = new Map<string, { data: CurrencyRates; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function useCurrencyRates(base: string): UseCurrencyRatesResult {
  const [rates, setRates] = useState<CurrencyRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchRates = useCallback(() => {
    const cached = rateCache.get(base)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setRates(cached.data)
      setLoading(false)
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetch(`https://api.frankfurter.app/latest?from=${base}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((data: CurrencyRates) => {
        rateCache.set(base, { data, timestamp: Date.now() })
        setRates(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch rates')
          setLoading(false)
        }
      })
  }, [base])

  useEffect(() => {
    fetchRates()
    return () => { abortRef.current?.abort() }
  }, [fetchRates])

  return { rates, loading, error, refetch: fetchRates }
}

export interface HistoricalPoint {
  date: string
  rate: number
}

interface UseHistoricalRatesResult {
  history: HistoricalPoint[]
  loading: boolean
  error: string | null
}

export function useHistoricalRates(from: string, to: string): UseHistoricalRatesResult {
  const [history, setHistory] = useState<HistoricalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)

    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    fetch(
      `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=${from}&to=${to}`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((data: { rates: Record<string, Record<string, number>> }) => {
        const points: HistoricalPoint[] = Object.entries(data.rates)
          .map(([date, r]) => ({ date, rate: r[to] }))
          .sort((a, b) => a.date.localeCompare(b.date))
        setHistory(points)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch history')
          setLoading(false)
        }
      })

    return () => { controller.abort() }
  }, [from, to])

  return { history, loading, error }
}
