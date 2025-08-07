import { Page } from '@/components'
import React from 'react'

export const metadata = {
  title: 'Quản lý trang',
}

const pages = [
  { key: 'home', label: 'Trang chủ', showArticles: false },
  { key: 'e-shop', label: 'E-shop', showArticles: false },
  { key: 'aboutUs', label: 'Trang giới thiệu', showArticles: true },
  {
    key: 'construction-design-consultancy',
    label: 'Tư vấn thiết kế xây dựng',
    showArticles: true,
  },
  { key: 'smarthome', label: 'Trang Smarthome', showArticles: true },
  {
    key: 'air-conditioning-heat-pumps',
    label: 'Hệ thống điều hòa & bơm nhiệt',
    showArticles: true,
  },
  { key: 'templates', label: 'Mẫu thiết kế', showArticles: false },
  { key: 'projects', label: 'Dự án', showArticles: false },
  { key: 'services', label: 'Dịch vụ', showArticles: false },
  { key: 'contactUs', label: 'Liên hệ', showArticles: false },
]

const Pages = () => {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-6'>Quản lý Trang</h1>
      <div className='flex flex-wrap'>
        {pages.map(page => (
          <div key={page.key} className='p-4 flex flex-col items-center *:'>
            <Page
              initialPage={page.key}
              titleButtonPage={page.label}
              showAticles={page.showArticles}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pages
