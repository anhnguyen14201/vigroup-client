'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {
  Menu as MenuIcon,
  X as XIcon,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
} from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useNavigationLinks } from '@/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from '@/components/common/Headers/LanguageSwitcher'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import { useTranslations } from 'next-intl'

export default function SidebarMenu() {
  const pathname = usePathname()
  const { locale } = useParams()
  const { navigationLinks } = useNavigationLinks()
  const t = useTranslations()
  const homePaths = ['/', '/home']

  // Normalize current path
  let currentPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1)
  }

  // Mobile-friendly link styling
  const baseLinkClasses = 'block w-full py-3 px-4 rounded-md transition-colors'
  const getClasses = (isActive: boolean) =>
    clsx(
      baseLinkClasses,
      isActive
        ? 'bg-[#C74242] text-white font-medium'
        : 'text-gray-800 active:bg-[#C74242] active:text-white',
    )

  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const currentUser = useSelector(
    (state: RootState) => state.currentUser.current,
  )

  const href = currentUser
    ? `/${locale}/account/user/${currentUser._id}`
    : '/account'

  return (
    <>
      {/* Toggle Button for mobile/tablet */}
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='xl:hidden p-2 m-2 rounded-md focus:outline-none focus:ring cursor-pointer'
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <XIcon size='24' /> : <MenuIcon size='24' />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key='overlay'
              className='fixed inset-0 bg-opacity-40 z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key='sidebar'
              className='fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 overflow-y-auto text-black 
                          rounded-l-lg flex justify-between flex-col'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div>
                <div className='flex items-center justify-between p-4 border-b'>
                  <h2 className='text-lg font-semibold'>Menu</h2>
                  <button
                    type='button'
                    onClick={() => setOpen(false)}
                    aria-label='Close menu'
                    className='cursor-pointer'
                  >
                    <XIcon size='20' />
                  </button>
                </div>
                <ul className='p-2 space-y-1'>
                  {navigationLinks.map(link => {
                    const { id, type, label, path, submenu } = link
                    const parentPath =
                      path === 'home'
                        ? '/'
                        : path?.startsWith('/')
                        ? path
                        : `/${path}`
                    const isActiveBase = homePaths.includes(parentPath)
                      ? homePaths.includes(currentPath)
                      : currentPath === parentPath

                    if (type === 'SINGLE') {
                      // Entire link area is clickable
                      return (
                        <li key={id}>
                          <Link
                            href={parentPath}
                            className={getClasses(isActiveBase)}
                            onClick={() => setOpen(false)}
                          >
                            {label}
                          </Link>
                        </li>
                      )
                    }

                    if (type === 'PARENT' && submenu) {
                      const childMatch = submenu.some(sub => {
                        const subPath = sub.path.startsWith('/')
                          ? sub.path
                          : `/${sub.path}`
                        return currentPath === subPath
                      })
                      const isActiveParent =
                        currentPath === parentPath ||
                        childMatch ||
                        currentPath.startsWith(parentPath + '/')
                      const isExpanded = !!expanded[id.toString()]

                      return (
                        <li key={id}>
                          <button
                            type='button'
                            aria-label='seeMore'
                            onClick={() => toggleExpand(id.toString())}
                            className={getClasses(isActiveParent)}
                          >
                            <div className='flex justify-between items-center cursor-pointer'>
                              <span>{label}</span>
                              {isExpanded ? (
                                <ChevronDown size='16' />
                              ) : (
                                <ChevronRight size='16' />
                              )}
                            </div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                key='sub'
                                className='pl-6 mt-1 space-y-1'
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {submenu.map(sub => {
                                  const subPath = sub.path.startsWith('/')
                                    ? sub.path
                                    : `/${sub.path}`
                                  const isActiveSub = currentPath === subPath
                                  return (
                                    <li key={subPath}>
                                      <Link
                                        href={subPath}
                                        className={getClasses(isActiveSub)}
                                        onClick={() => setOpen(false)}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>
                      )
                    }

                    return null
                  })}
                </ul>
                <div className='px-5 py-5'>
                  <LanguageSwitcher />
                </div>
              </div>
              <Link
                href={href}
                className='mt-auto w-full'
                onClick={() => setOpen(false)}
              >
                <div className='bg-[#C74242] text-white rounded-tl-md rounded-bl-md p-4 flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-red-100 rounded-full'>
                      <CircleUserRound size={24} className='text-[#C74242]' />
                    </div>
                    {currentUser ? (
                      <div>Hi! {currentUser?.fullName}</div>
                    ) : (
                      <div>
                        <h4 className='text-sm font-semibold'>
                          {t('accountPage')}
                        </h4>
                        <p className='text-xs'>{t('account.login')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
