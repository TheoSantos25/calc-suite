import { useMemo, useState, useRef, useEffect } from 'react'

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
  formatValue?: (v: number) => string
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  formatValue,
}: SliderInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = formatValue
    ? formatValue(value)
    : `${prefix}${value.toLocaleString()}${suffix ? ` ${suffix}` : ''}`

  const progressPercent = useMemo(() => {
    return ((value - min) / (max - min)) * 100
  }, [value, min, max])

  const trackBackground = `linear-gradient(to right, #6366f1 0%, #6366f1 ${progressPercent}%, #cbd5e1 ${progressPercent}%, #cbd5e1 100%)`
  const darkTrackBackground = `linear-gradient(to right, #6366f1 0%, #6366f1 ${progressPercent}%, #475569 ${progressPercent}%, #475569 100%)`

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const commitEdit = () => {
    const parsed = parseFloat(editText)
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed))
      const snapped = Math.round(clamped / step) * step
      // Avoid floating-point drift
      const rounded = parseFloat(snapped.toFixed(10))
      onChange(rounded)
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
        </label>
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            min={min}
            max={max}
            step={step}
            className="w-28 text-right text-sm font-semibold text-primary bg-transparent border border-primary/30 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label={`Edit ${label}`}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditText(String(value))
              setIsEditing(true)
            }}
            className="text-sm font-semibold text-primary cursor-pointer hover:underline decoration-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
            title="Click to edit"
            aria-label={`${label}: ${displayValue}. Click to edit.`}
          >
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onInput={(e) => {
          onChange(parseFloat((e.target as HTMLInputElement).value))
        }}
        className="w-full h-1.5 rounded-full cursor-pointer appearance-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:hidden"
        style={{ background: trackBackground }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onInput={(e) => {
          onChange(parseFloat((e.target as HTMLInputElement).value))
        }}
        className="w-full h-1.5 rounded-full cursor-pointer appearance-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hidden dark:block"
        style={{ background: darkTrackBackground }}
      />
    </div>
  )
}
