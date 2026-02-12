import { useState, useCallback } from 'react'
import { Outlet } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DrawerNav } from '@/components/layout/DrawerNav'

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prev => !prev)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>
      <Header onMenuToggle={toggleDrawer} />
      <DrawerNav isOpen={drawerOpen} onClose={closeDrawer} />
      <div className="flex">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 ml-0 lg:ml-64 mt-16 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 pb-8 safe-top-offset overflow-x-hidden max-w-full"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
