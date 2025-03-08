import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@/components/ThemeProvider'
import { MainSidebar } from '@/components/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})
function RootComponent() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <MainSidebar />
          <SidebarInset>
            <header className="flex h-16 items-center border-b px-6">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">Recipe Manager</h1>
            </header>
            <main>
              <div className="container py-6 px-6">
                <Outlet />
              </div>
            </main>
            <TanStackRouterDevtools position="bottom-right" />
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  )
}
