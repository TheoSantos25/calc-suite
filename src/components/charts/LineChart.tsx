import { ChartWrapper } from './ChartWrapper'
import type { ApexOptions } from 'apexcharts'

interface LineChartProps {
  series: { name: string; data: number[] }[]
  categories: string[]
  height?: number
  title?: string
}

export function LineChart({ series, categories, height = 350, title }: LineChartProps) {
  const options: ApexOptions = {
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
      type="line"
      height={height}
    />
  )
}
