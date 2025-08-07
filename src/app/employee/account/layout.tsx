// app/account/user/layout.tsx
'use client'
import { EmployeeAuthGuard, EmployeeSideBar } from '@/components'
import React from 'react'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Header cố định fullscreen hoặc cũng có thể giới hạn width */}

      {/* Gói phần sidebar + main vào 1 container có max-width và mx-auto */}
      <EmployeeAuthGuard requireAdmin={false}>
        <div className='flex flex-1 justify-center'>
          <div className='flex w-full max-w-screen-2xl min-h-screen'>
            <EmployeeSideBar />
            <main className='flex-1 bg-white'>{children}</main>
          </div>
        </div>
      </EmployeeAuthGuard>
    </div>
  )
}
