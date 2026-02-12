import { Capacitor } from '@capacitor/core'
import { useCallback } from 'react'
import { openExternalUrl } from '../capacitor-init'

export function useCapacitor() {
  const isNative = Capacitor.isNativePlatform()

  const openExternal = useCallback((url: string) => {
    openExternalUrl(url)
  }, [])

  return { isNative, openExternal }
}
