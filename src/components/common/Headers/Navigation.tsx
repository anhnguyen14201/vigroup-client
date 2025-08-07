'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { useParams, usePathname } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigationLinks } from '@/hooks'

const Navigation = () => {
  const pathname = usePathname() // Ví dụ: "/en/services/smarthome"
  const { locale } = useParams() // Ví dụ: "en"

  // Xử lý đường dẫn hiện tại
  let currentPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1)
  }
  const { navigationLinks } = useNavigationLinks()
  const [isLoading, setIsLoading] = useState(true)
  const [expectedCount, setExpectedCount] = useState(5)

  // Lấy navigation links
  useEffect(() => {
    if (navigationLinks && navigationLinks.length > 0) {
      setExpectedCount(navigationLinks.length)

      setIsLoading(false)
    }
  }, [navigationLinks])
  const homePaths = ['/', '/home']

  const baseLinkClasses =
    'relative py-0.5 after:content-["""] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#BE212F] ' +
    'after:w-0 after:transition-[width] after:duration-500 hover:after:w-full'

  const getClasses = (isActive: boolean) =>
    clsx(
      baseLinkClasses,
      isActive
        ? 'text-[#BE212F] after:w-full font-[350]'
        : 'text-current hover:text-[#BE212F] font-[350]',
    )

  // Show skeleton while loading
  if (isLoading) {
    return (
      <nav className='flex items-center gap-8 text-[17px] uppercase tracking-[2px] font-oswald'>
        {Array(expectedCount)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} width={80} height={20} />
          ))}
      </nav>
    )
  }

  return (
    <nav className='flex items-center gap-8 text-[17px] uppercase min-h-[24px] tracking-[2px] font-oswald'>
      {navigationLinks.map(link => {
        const { id, type, label, path, submenu } = link
        const parentPath =
          path === 'home' ? '/' : path?.startsWith('/') ? path : `/${path}`

        // SINGLE LINK
        if (type === 'SINGLE') {
          const isActiveSingle = homePaths.includes(parentPath)
            ? homePaths.includes(currentPath)
            : currentPath === parentPath
          return (
            <Link key={id} href={parentPath}>
              <span className={getClasses(isActiveSingle)}>{label}</span>
            </Link>
          )
        }

        // PARENT LINK
        if (type === 'PARENT') {
          const childMatch = submenu?.some(sub => {
            const subPath = sub.path.startsWith('/') ? sub.path : `/${sub.path}`
            return currentPath === subPath
          })
          const isActiveParent =
            currentPath === parentPath ||
            childMatch ||
            currentPath.startsWith(parentPath + '/')

          return (
            <div key={id} className='relative group'>
              <div
                className={clsx(
                  getClasses(isActiveParent),
                  'cursor-pointer flex items-center',
                )}
              >
                {label}
                <svg
                  className='w-4 h-4 ml-1 transition-transform duration-500 group-hover:rotate-180'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>

              {submenu && (
                <ul
                  className='absolute left-1/2 top-full mt-2 transform -translate-x-1/2
                             min-w-max bg-secondary text-black rounded-md
                             py-4 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                             transition-all duration-500 scale-95 group-hover:scale-100 z-50'
                >
                  {submenu.map(sub => {
                    const subPath = sub.path.startsWith('/')
                      ? sub.path
                      : `/${sub.path}`
                    const isActiveSub = currentPath === subPath
                    return (
                      <li key={subPath} className='px-4 py-2'>
                        <Link href={subPath}>
                          <span className={getClasses(isActiveSub)}>
                            {sub.label}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        }

        return null
      })}
    </nav>
  )
}

export default Navigation
