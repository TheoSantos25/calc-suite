import { useState, useEffect, useRef } from 'react'

export interface HFModel {
  id: string
  modelId: string
  pipeline_tag: string
  downloads: number
  likes: number
  tags: string[]
}

interface UseHuggingFaceModelsResult {
  models: HFModel[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const PIPELINE_TYPES = [
  'All',
  'text-generation',
  'text-to-image',
  'text-classification',
  'token-classification',
  'question-answering',
  'translation',
  'summarization',
  'fill-mask',
  'image-classification',
  'automatic-speech-recognition',
]

export function useHuggingFaceModels(): UseHuggingFaceModelsResult {
  const [models, setModels] = useState<HFModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  function fetchModels() {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetch('https://huggingface.co/api/models?sort=downloads&direction=-1&limit=30', {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((data: HFModel[]) => {
        setModels(
          data.map((m) => ({
            id: m.id,
            modelId: m.modelId ?? m.id,
            pipeline_tag: m.pipeline_tag ?? 'unknown',
            downloads: m.downloads ?? 0,
            likes: m.likes ?? 0,
            tags: m.tags ?? [],
          })),
        )
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch models')
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    fetchModels()
    return () => { abortRef.current?.abort() }
  }, [])

  return { models, loading, error, refetch: fetchModels }
}
