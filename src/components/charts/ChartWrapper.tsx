import Chart from 'react-apexcharts'
import { useTheme } from '@/hooks/useTheme'
import { getChartTheme } from './chartTheme'
import type { ApexOptions } from 'apexcharts'

interface ChartWrapperProps {
  options: ApexOptions
  series: ApexAxisChartSeries | number[]
  type: 'line' | 'area' | 'bar' | 'donut' | 'pie' | 'radialBar'
  height?: number | string
}

export function ChartWrapper({ options, series, type, height = 350 }: ChartWrapperProps) {
  const { theme } = useTheme()
  const themeOptions = getChartTheme(theme)

  const mergedOptions: ApexOptions = {
    ...themeOptions,
    ...options,
    chart: Object.assign({}, themeOptions.chart, options.chart),
    grid: Object.assign({}, themeOptions.grid, options.grid),
    tooltip: Object.assign({}, themeOptions.tooltip, options.tooltip),
  }

  return (
    <div>
      <Chart
        key={theme}
        options={mergedOptions}
        series={series}
        type={type}
        height={height}
      />
    </div>
  )
}
