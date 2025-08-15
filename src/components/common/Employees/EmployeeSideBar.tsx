'use client'
import { apiLogout } from '@/api'
import { logout, setLoading } from '@/redux'
import { ClipboardList } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { persistor, RootState } from '@/redux/redux'
import nProgress from 'nprogress'
import toast from 'react-hot-toast'

type TabKey = 'info' | 'orders' | 'projects'

const EmployeeSideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/)/, '')

  const { current } = useSelector((state: RootState) => state?.currentUser)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const navItems: { label: string; key: TabKey; icon: any; href: string }[] = [
    {
      label: 'Chấm công',
      key: 'info',
      icon: <ClipboardList />,
      href: '/employee/account/timekeeping',
    },
    {
      label: 'Tài khoản',
      key: 'orders',
      icon: <FiUser />,
      href: `/employee/account/${current?._id}`,
    },
  ]

  async function confirmLogout() {
    dispatch(setLoading({ key: 'Logout', value: true }))
    try {
      // Gọi API logout, giả sử apiLogout trả về Promise
      await apiLogout()
      // Chuyển hướng về trang /account
      dispatch(logout())
      await persistor.flush()

      router.replace('/employee')
      // Đưa user về state chưa login
    } catch (error: any) {
      // Log ra console

      // Hiển thị thông báo lỗi
      toast.error(error?.message || 'Đăng xuất thất bại. Vui lòng thử lại.')
    } finally {
      // Bất kể thành công hay lỗi đều tắt loading
      dispatch(setLoading({ key: 'Logout', value: false }))
    }
  }

  const handleNav = async (href: string) => {
    nProgress.start()
    try {
      await router.push(href)
    } finally {
      nProgress.done()
    }
  }

  return (
    <>
      {showLogoutModal && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-20'
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className='bg-white p-6 rounded-lg space-y-4 w-80'
            onClick={e => e.stopPropagation()}
          >
            <p>Bạn có muốn đăng xuất chứ</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowLogoutModal(false)}
                className='px-4 py-2 rounded-full w-full border border-[#C74242] text-[#C74242] hover:bg-[#C74242] 
                        hover:text-white transition cursor-pointer'
              >
                Đóng
              </button>
              <button
                onClick={confirmLogout}
                className='px-4 py-2 rounded-full w-full bg-[#C74242] text-white hover:bg-white hover:text-[#C74242] 
                        border border-[#C74242] transition cursor-pointer'
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className='hidden xl:flex flex-col w-64 bg-white border-r border-l'>
        <nav className='mt-6 space-y-1'>
          {navItems.map(({ key, label, icon, href }) => {
            const isActive = cleanPath === href
            return (
              <div
                key={key}
                className={`flex items-center px-4 cursor-pointer py-3 space-x-3 hover:bg-gray-100 transition ${
                  isActive ? 'bg-gray-100 font-semibold' : ''
                }`}
                onClick={() => handleNav(href)}
              >
                <span className='text-xl text-[#C74242]'>{icon}</span>
                <span className='flex-1 text-[#C74242]'>{label}</span>
              </div>
            )
          })}
          <button
            onClick={() => setShowLogoutModal(true)}
            className='flex items-center px-4 py-3 w-full cursor-pointer space-x-3 hover:bg-gray-100 transition text-[#C74242]'
          >
            <FiLogOut className='text-xl' />
            <span> Đăng xuất</span>
          </button>
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className='fixed bottom-0 w-full xl:hidden bg-white border-t flex justify-around py-2 z-10'>
        {navItems.map(({ key, label, icon, href }) => {
          const isActive = cleanPath === href
          return (
            <div
              key={key}
              className={`flex flex-col items-center cursor-pointer text-sm ${
                isActive ? 'text-[#C74242]' : 'text-gray-500'
              }`}
              onClick={() => handleNav(href)}
            >
              <span className='text-xl'>{icon}</span>
              <span>{label}</span>
            </div>
          )
        })}
        <button
          onClick={() => setShowLogoutModal(true)}
          className='flex flex-col items-center text-gray-500 text-sm cursor-pointer'
        >
          <FiLogOut className='text-xl' />
          <span> Đăng xuất</span>
        </button>
      </nav>
    </>
  )
}

export default EmployeeSideBar
