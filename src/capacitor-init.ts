import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Browser } from '@capacitor/browser'

export function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back()
    } else {
      App.exitApp()
    }
  })

  const isDark = document.documentElement.classList.contains('dark')
  updateStatusBarTheme(isDark ? 'dark' : 'light')
}

export function updateStatusBarTheme(theme: 'light' | 'dark') {
  if (!Capacitor.isNativePlatform()) return

  if (theme === 'dark') {
    StatusBar.setStyle({ style: Style.Dark })
    StatusBar.setBackgroundColor({ color: '#0f172a' })
  } else {
    StatusBar.setStyle({ style: Style.Light })
    StatusBar.setBackgroundColor({ color: '#ffffff' })
  }
}

export function openExternalUrl(url: string) {
  if (Capacitor.isNativePlatform()) {
    Browser.open({ url })
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
