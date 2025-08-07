'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url?: string
    icon?: LucideIcon
    items?: { title: string; url: string }[]
  }[]
}) {
  // 1. Lấy đường dẫn hiện tại
  const pathname = usePathname()

  // 2. Class chung và class active/inactive
  const baseBtn =
    'flex items-center gap-2 w-full px-3 py-2 rounded transition font-semibold text-md cursor-pointer'
  const activeBtn = 'bg-blue-100 text-blue-600 font-semibold text-md'
  const inactiveBtn = 'text-gray-700 hover:bg-gray-100'

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => {
          const hasSubmenu = Array.isArray(item.items) && item.items.length > 0
          // Xác định active: chính xác hoặc cùng nhánh
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + '/')

          // 3. Menu đa cấp
          if (hasSubmenu) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className='group/collapsible'
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={clsx(
                        baseBtn,
                        isActive ? activeBtn : inactiveBtn,
                      )}
                    >
                      {item.icon && <item.icon className='w-5 h-5' />}
                      <span>{item.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map(sub => {
                        const subActive = pathname === sub.url
                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={sub.url}
                                className={clsx(
                                  'flex items-center gap-2 w-full px-2 py-2 text-md font-semibold rounded duration-300 transition',
                                  subActive ? activeBtn : inactiveBtn,
                                )}
                              >
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // 4. Menu 1 cấp
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={clsx(baseBtn, isActive ? activeBtn : inactiveBtn)}
              >
                <Link href={item.url!} className='flex-1'>
                  {item.icon && <item.icon className='w-5 h-5' />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
