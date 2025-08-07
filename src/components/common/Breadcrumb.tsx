'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'
import { routing } from '@/i18n'

const BreadcrumbComponent = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment)

  // Kiểm tra xem segment đầu tiên có phải là locale không
  const isLocalePrefixed = routing.locales.includes(pathSegments[0] as typeof routing.locales[number])
  const breadcrumbSegments = isLocalePrefixed
    ? pathSegments.slice(1)
    : pathSegments

  return (
    <UIBreadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbSegments.map((segment, index) => {
          const href = `/${breadcrumbSegments.slice(0, index + 1).join('/')}`
          const isLast = index === breadcrumbSegments.length - 1
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <ChevronRight className='w-5 h-5 text-white' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </UIBreadcrumb>
  )
}

export default BreadcrumbComponent
