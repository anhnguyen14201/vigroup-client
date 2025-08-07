'use client'

import React, { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const percent = (scrollY / documentHeight) * 100

      setScrollPercent(percent)
      setShowScrollTop(scrollY > 70)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div>
      {/* Nút lên đầu trang với hiệu ứng mượt mà */}
      <button
        type='button'
        aria-label='Scroll back to top'
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 w-15 h-15 flex items-center justify-center 
                    rounded-full transition-all duration-500 ease-in-out  cursor-pointer z-50
                    ${
                      showScrollTop
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90 pointer-events-none'
                    }`}
      >
        <svg
          className='absolute w-full h-full'
          viewBox='0 0 100 100'
          aria-hidden='true'
          focusable='false'
        >
          {/* Vòng ngoài mờ */}
          <circle
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke='rgba(153, 153, 153, 0.3)'
            strokeWidth='2'
          />
          {/* Vòng phần trăm lăn trang */}
          <circle
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke='#C74242'
            strokeWidth='3'
            strokeDasharray='283'
            strokeDashoffset={`${283 - (scrollPercent / 100) * 283}`}
            strokeLinecap='round'
            transform='rotate(-90 50 50)'
            style={{
              transition:
                'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-in-out',
            }}
          />
        </svg>
        <svg
          aria-hidden='true'
          focusable='false'
          className='relative w-6 h-10 text-[#C74242]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {/* Thân mũi tên */}
          <line x1='12' y1='20' x2='12' y2='6' />
          {/* Đầu mũi tên */}
          <polyline points='18 12 12 6 6 12' />
        </svg>
      </button>
    </div>
  )
}

export default ScrollToTopButton
