interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
}

export function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
}: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm py-2.5 focus:ring-2 focus:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
            prefix ? 'pl-8' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
