import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'
import {
  AppSidebar,
  AuthGuard,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components'
import { AppInitializer, ProgressProvider, ReduxProvider } from '@/providers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='vi' suppressHydrationWarning>
      <body
        className='bg-gray-50 text-gray-900 font-sans'
        suppressHydrationWarning
      >
        <Toaster />
        <ReduxProvider>
          <AppInitializer />
          {/* <AuthGuard> */}
          <SidebarProvider>
            <div className='flex-col lg:flex-row'>
              <AppSidebar />
            </div>
            <SidebarInset>
              <header className='flex h-16 shrink-0 border-b-1 border-gray-200 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
                <div className='flex items-center gap-2 px-4'>
                  <SidebarTrigger className='-ml-1' />
                  <Separator orientation='vertical' className='mr-2 h-4' />
                </div>
              </header>
              <main className='flex flex-1'>
                {/* <ProgressBar /> */}
                <ProgressProvider>{children}</ProgressProvider>
              </main>
            </SidebarInset>
          </SidebarProvider>
          {/* </AuthGuard> */}
        </ReduxProvider>
      </body>
    </html>
  )
}
