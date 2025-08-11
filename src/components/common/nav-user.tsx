'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { persistor, RootState } from '@/redux/redux'
import { logout, setLoading } from '@/redux'
import { apiLogout } from '@/api'
import { useState } from 'react'
import nProgress from 'nprogress'

export function NavUser() {
  const { isMobile } = useSidebar()
  const dispatch = useDispatch()
  const router = useRouter()

  const { current } = useSelector((state: RootState) => state.currentUser)

  async function handleLogout() {
    dispatch(setLoading({ key: 'logout', value: true }))
    nProgress.start()
    try {
      await apiLogout()
      dispatch(logout())
      router.push('/')
      await persistor.flush()
    } catch (error: any) {
      // Optionally show a toast or error notification here
    } finally {
      dispatch(setLoading({ key: 'logout', value: false }))
      nProgress.done()
    }
  }
  const [menuOpen, setMenuOpen] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)

  if (!current) {
    return null
  }
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {current?.fullName}
                  </span>
                  <span className='truncate text-xs'>{current?.email}</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {current?.fullName}
                    </span>
                    <span className='truncate text-xs'>{current?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault()
                  setMenuOpen(false)

                  setShowConfirm(true)
                }}
                className='cursor-pointer'
              >
                <LogOut className='mr-2 size-4' />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {showConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black opacity-50' />
          <div className='relative bg-white rounded-lg p-6 shadow-lg max-w-sm w-full'>
            <p className='text-center mb-4'>Bạn có muốn đăng xuất không?</p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={() => {
                  setShowConfirm(false)
                  handleLogout()
                }}
                className='px-4 py-2 rounded-full w-full bg-[#C74242] text-white hover:bg-white hover:text-[#C74242] 
                        border border-[#C74242] transition cursor-pointer'
              >
                Đăng xuất
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className='px-4 py-2 rounded-full w-full border border-[#C74242] text-[#C74242] hover:bg-[#C74242] 
                        hover:text-white transition cursor-pointer'
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
