import { Outlet } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 ml-0 lg:ml-64 mt-16 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8"
        >
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
