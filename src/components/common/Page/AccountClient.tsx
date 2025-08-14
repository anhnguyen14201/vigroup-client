'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Banner, LoginForm, RegisterForm } from '@/components'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'

export default function AccountClient() {
  const t = useTranslations('account')

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  useEffect(() => {
    const saved = localStorage.getItem('accountActiveTab')
    if (saved === 'login' || saved === 'register') {
      setActiveTab(saved)
    }
  }, [])

  const handleTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    localStorage.setItem('accountActiveTab', tab)
  }

  const router = useRouter()

  // Lấy thông tin người dùng từ Redux
  const { token, isInitialized, current } = useSelector(
    (state: RootState) => state.currentUser,
  )

  const role = current?.role
  const userId = current?.user?._id

  // Danh sách role được phép truy cập trang admin
  const allowedRoles = [3515, 1413914, 1311417518]

  useEffect(() => {
    // chặn chạy redirect khi store chưa sẵn sàng
    if (!isInitialized) return

    if (!token) {
      router.replace('/account')
      return
    }

    if (!allowedRoles.includes(role)) {
      router.replace(`/account/user/${userId}`)
      return
    }
  }, [isInitialized, token, role, router, userId])

  return (
    <>
      <Banner title='Account' />

      <section
        className='
          max-w-screen-2xl
          mx-auto
          flex flex-col
          items-center
          px-4 sm:px-6 lg:px-8
          py-8
        '
      >
        <div
          className='
            w-full
            md:w-3/5
            lg:w-2/3
            xl:w-1/2
            bg-white
          '
        >
          {/* Tab Triggers */}
          <div className='relative border-b grid grid-cols-2'>
            {(['login', 'register'] as const).map(tab => (
              <button
                type='button'
                aria-label='tab'
                key={tab}
                className={clsx(
                  'py-3 text-center text-lg font-semibold cursor-pointer transition-colors',
                  activeTab === tab
                    ? 'text-[#9d3f3f]'
                    : 'text-gray-600 hover:text-gray-800',
                )}
                onClick={() => handleTab(tab)}
              >
                {t(tab)}
              </button>
            ))}

            {/* Underline */}
            <div
              className={clsx(
                'absolute bottom-0 h-0.5 bg-[#9d3f3f]  transition-transform duration-300',
                activeTab === 'login' ? 'translate-x-0' : 'translate-x-full',
              )}
              style={{ width: '50%' }}
            />
          </div>

          {/* Tab Content */}
          <div className='p-4'>
            <AnimatePresence mode='wait'>
              {activeTab === 'login' ? (
                <motion.div
                  key='login'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key='register'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm onSuccess={() => handleTab('login')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}
