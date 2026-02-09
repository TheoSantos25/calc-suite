import { ChartWrapper } from './ChartWrapper'
import type { ApexOptions } from 'apexcharts'

interface AreaChartProps {
  series: { name: string; data: number[] }[]
  categories: string[]
  height?: number
  title?: string
}

export function AreaChart({ series, categories, height = 350, title }: AreaChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'area',
    },
    fill: {
      opacity: 0.3,
    },
    xaxis: {
      categories,
    },
    ...(title && {
      title: {
        text: title,
      },
    }),
  }

  return (
    <ChartWrapper
      options={options}
      series={series}
      type="area"
      height={height}
    />
  )
}
