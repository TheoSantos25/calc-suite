import { ChartWrapper } from './ChartWrapper'
import type { ApexOptions } from 'apexcharts'

interface BarChartProps {
  series: { name: string; data: number[] }[]
  categories: string[]
  height?: number
  title?: string
  horizontal?: boolean
}

export function BarChart({ series, categories, height = 350, title, horizontal = false }: BarChartProps) {
  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal,
      },
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
      type="bar"
      height={height}
    />
  )
}
