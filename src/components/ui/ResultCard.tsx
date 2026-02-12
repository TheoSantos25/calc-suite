import { useState, useRef, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'

interface ResultCardProps {
  label: string
  value: string
  subtitle?: string
  color?: string
  editable?: boolean
  onEdit?: (rawValue: number) => void
  editPrefix?: string
}

const colorToAccent: Record<string, string> = {
  'text-blue-500': 'bg-blue-500',
  'text-emerald-500': 'bg-emerald-500',
  'text-orange-500': 'bg-orange-500',
  'text-rose-500': 'bg-rose-500',
  'text-purple-500': 'bg-purple-500',
  'text-cyan-500': 'bg-cyan-500',
  'text-green-500': 'bg-green-500',
  'text-amber-500': 'bg-amber-500',
  'text-indigo-500': 'bg-indigo-500',
}

export function ResultCard({
  label,
  value,
  subtitle,
  color = 'text-slate-900 dark:text-slate-100',
  editable = false,
  onEdit,
  editPrefix: _editPrefix,
}: ResultCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const accentColor = colorToAccent[color] || 'bg-primary'

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  function commitEdit() {
    const stripped = editText.replace(/[$,%]/g, '').replace(/,/g, '')
    const parsed = parseFloat(stripped)
    if (!isNaN(parsed)) {
      onEdit?.(parsed)
    }
    setIsEditing(false)
  }

  function stripToRaw(display: string): string {
    return display.replace(/[$,]/g, '')
  }

  function handleValueClick() {
    setEditText(stripToRaw(value))
    setIsEditing(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      commitEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <GlassCard className={`relative overflow-hidden p-5${editable ? '' : ''}`} hover>
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </p>

      {editable && !isEditing && (
        <span className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 text-xs">
          ✎
        </span>
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className={`text-2xl font-bold ${color} bg-transparent border-b border-primary outline-none w-full`}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : editable ? (
        <p
          className={`text-2xl font-bold ${color} cursor-pointer`}
          onClick={handleValueClick}
        >
          {value}
        </p>
      ) : (
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      )}

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </GlassCard>
  )
}
