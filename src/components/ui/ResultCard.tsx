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
    <GlassCard className={`p-5${editable ? ' relative' : ''}`} hover>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>

      {editable && !isEditing && (
        <span className="absolute top-2 right-2 text-slate-400 dark:text-slate-500 text-xs">
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
