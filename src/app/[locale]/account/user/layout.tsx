// app/account/user/layout.tsx
'use client'
import { AuthGuard, UserSlideBar } from '@/components'
import React from 'react'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Header cố định fullscreen hoặc cũng có thể giới hạn width */}
      <header className='h-[135px] bg-black w-full' />

      {/* Gói phần sidebar + main vào 1 container có max-width và mx-auto */}
      <AuthGuard requireAdmin={false}>
        <div className='flex flex-1 justify-center'>
          <div className='flex w-full max-w-screen-2xl min-h-screen'>
            <UserSlideBar />

            <main className='flex-1 p-5 bg-white'>{children}</main>
          </div>
        </div>
      </AuthGuard>
    </div>
  )
}
