import type { ApexOptions } from 'apexcharts'

export function getChartTheme(theme: 'light' | 'dark'): ApexOptions {
  const isDark = theme === 'dark'

  return {
    chart: {
      background: 'transparent',
      foreColor: isDark ? '#e2e8f0' : '#334155',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 600,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      borderColor: isDark ? '#334155' : '#e2e8f0',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
  }
}
