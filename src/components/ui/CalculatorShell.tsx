interface CalculatorShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function CalculatorShell({ title, description, children }: CalculatorShellProps) {
  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}
