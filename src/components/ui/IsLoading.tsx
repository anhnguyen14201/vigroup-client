import React from 'react'

export default function IsLoading() {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-white/10'>
      <div className='p-6 rounded-full flex flex-col items-center justify-center'>
        <div className='w-20 h-20 border-t-4 border-b-4 border-red-400 rounded-full animate-spin'></div>
      </div>
    </div>
  )
}
