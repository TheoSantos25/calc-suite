import { ChartWrapper } from './ChartWrapper'
import type { ApexOptions } from 'apexcharts'

interface DonutChartProps {
  series: number[]
  labels: string[]
  height?: number
  title?: string
}

export function DonutChart({ series, labels, height = 350, title }: DonutChartProps) {
  const options: ApexOptions = {
    labels,
    legend: {
      position: 'bottom',
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
      type="donut"
      height={height}
    />
  )
}
