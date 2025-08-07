'use client'

import { CircleUserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useLocale } from 'next-intl'
import nProgress from 'nprogress'
import { useRouter } from 'next/navigation'

import { RootState } from '@/redux/redux'

const UserButton = () => {
  const locale = useLocale()
  const currentUser = useSelector(
    (state: RootState) => state.currentUser.current,
  )

  const href = currentUser
    ? `/${locale}/account/user/${currentUser._id}`
    : '/account'
  const router = useRouter()

  const handleNav = async (href: string) => {
    nProgress.start()
    try {
      await router.push(href)
    } finally {
      nProgress.done()
    }
  }

  return (
    <button
      onClick={() => handleNav(href)}
      className='relative group'
      aria-label='User Account'
    >
      <CircleUserRound className='w-6 h-6 text-current cursor-pointer group-hover:text-[#C74242]' />
    </button>
  )
}

export default UserButton
