'use client'

import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import image from '@/assets/images/images.8bdca03fd947f1d464da.webp'
import Image from 'next/image'
import { useLogos } from '@/hooks'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { items: logos, isLoading, error } = useLogos()

  // 2. Tìm object có logoType === 'logoSmall'
  const smallLogo = logos?.find((item: any) => item.logoType === 'logoSmall')
  const smallLogoUrl = smallLogo?.imageUrls?.[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='w-full text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                {smallLogoUrl && (
                  <Image
                    src={smallLogoUrl}
                    alt='logo'
                    width={32} // 8 * 4px = 32px
                    height={32}
                    sizes='32px'
                    className='w-8 h-8 object-contain'
                    priority // nếu muốn load ngay
                  />
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
