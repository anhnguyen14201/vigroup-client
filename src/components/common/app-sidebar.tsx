'use client'

import * as React from 'react'
import {
  AudioWaveform,
  Command,
  ContactRound,
  FileText,
  Folder,
  GalleryVerticalEnd,
  Globe,
  Grid2x2Plus,
  HomeIcon,
  Layers,
  LayoutDashboard,
  List,
  ClipboardList,
  Settings,
  UsersRound,
  LayoutTemplate,
} from 'lucide-react'

import { NavMain } from '@/components/common/nav-main'
const NavUser = dynamic(
  () => import('@/components/common/nav-user').then(mod => mod.NavUser),
  { ssr: false },
)
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { TeamSwitcher } from '@/components/common/team-switcher'
import dynamic from 'next/dynamic'

// This is sample data.
const data = {
  user: {
    name: 'shadcn sdfsdfsdf',
    email: 'm@example.com',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Quản lý người dùng',
      url: '/admin/customers',
      icon: UsersRound,
    },
    {
      title: 'Quản lý nhân viên',
      url: '/admin/employees',
      icon: ContactRound,
    },
    {
      title: 'Phân loại dự án',
      url: '/admin/project-categories',
      icon: List,
    },
    {
      title: 'Quản lý dự án',
      url: '/admin/projects',
      icon: Folder,
    },
    {
      title: 'Mẫu thiết kế',
      url: '/admin/templates',
      icon: LayoutTemplate,
    },
    {
      title: 'Danh mục sản phẩm',
      icon: Grid2x2Plus,
      url: '/admin/product-categories',
    },
    {
      title: 'Quản lý sản phẩm',
      icon: Layers,
      url: '/admin/management-products',
    },
    {
      title: 'Trang',
      icon: Globe,
      url: '/admin/pages',
    },
    {
      title: 'Đơn hàng',
      icon: ClipboardList,
      url: '/admin/orders',
    },
    {
      title: 'Hóa đơn',
      icon: FileText,
      url: '/admin/invoice',
    },
    {
      title: 'Cài đặt chung',
      icon: Settings,
      url: '/admin/general-settings',
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
    },
  ],
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />{' '}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
