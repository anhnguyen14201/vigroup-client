'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

// Dynamic imports
const Image = dynamic(() => import('next/image'), { ssr: false })
const ChevronLeft = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })),
  { ssr: false },
)
const ChevronRight = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.ChevronRight })),
  { ssr: false },
)

interface ProductDetailProps {
  data: {
    imageUrls: string[]
    // plus any other fields you need for details
  }
}

// Variants for slide animation
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
}

// Constants
const AUTOPLAY_INTERVAL = 3000 // 3 seconds
const SLIDE_DURATION = 0.6 // 0.6 seconds for transition

const ImageSlider: React.FC<ProductDetailProps> = React.memo(({ data }) => {
  const images = useMemo(() => data.imageUrls || [], [data.imageUrls])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // +1 or -1
  const [hovered, setHovered] = useState(false)
  const autoplayRef = useRef<number | null>(null)
  const thumbContainerRef = useRef<HTMLDivElement>(null)

  // Scroll thumbnail into view when index changes
  useEffect(() => {
    const container = thumbContainerRef.current
    if (!container) return

    const thumb = container.children[currentIndex] as HTMLElement
    if (!thumb) return

    const containerWidth = container.clientWidth
    const thumbOffset = thumb.offsetLeft
    const thumbWidth = thumb.clientWidth
    const scrollX = thumbOffset - (containerWidth - thumbWidth) / 2

    container.scrollTo({ left: scrollX, behavior: 'smooth' })
  }, [currentIndex])

  const changeSlide = useCallback((idx: number, dir: number) => {
    setDirection(dir)
    setCurrentIndex(idx)
  }, [])

  const prevMain = () => {
    setDirection(-1)
    setCurrentIndex(i => (i - 1 + images.length) % images.length)
  }

  const nextMain = () => {
    setDirection(1)
    setCurrentIndex(i => (i + 1) % images.length)
  }

  // Reset autoplay interval
  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }
    autoplayRef.current = window.setInterval(nextMain, AUTOPLAY_INTERVAL)
  }

  // Autoplay effect
  useEffect(() => {
    if (!hovered) {
      autoplayRef.current = window.setInterval(nextMain, AUTOPLAY_INTERVAL)
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [hovered, images.length])

  // Handle thumbnail click
  const onThumbClick = useCallback(
    (idx: number) => {
      setDirection(idx > currentIndex ? 1 : -1)
      setCurrentIndex(idx)
      resetAutoplay()
    },
    [currentIndex, resetAutoplay],
  )

  return (
    <div>
      <div
        className='relative bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden'
        style={{ height: 400 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode='wait'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: SLIDE_DURATION }}
            className='absolute inset-0'
          >
            <Image
              src={images[currentIndex]}
              alt={`Ảnh sản phẩm ${currentIndex + 1}`}
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-contain'
              priority
            />
          </motion.div>
        </AnimatePresence>

        {hovered && (
          <>
            <button
              type='button'
              aria-label='seeMore'
              onClick={prevMain}
              className='absolute z-10 cursor-pointer left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-opacity'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
            <button
              aria-label='seeMore'
              type='button'
              onClick={nextMain}
              className='absolute z-10 cursor-pointer right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-opacity'
            >
              <ChevronRight className='w-6 h-6' />
            </button>
          </>
        )}

        <div className='absolute bottom-2 right-4 bg-black/30 text-white text-xs px-2 py-1 rounded-xl'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails row */}
      <div className='mt-4'>
        <div
          ref={thumbContainerRef}
          className='flex space-x-2 overflow-x-auto py-2 px-1 scrollbar-none'
        >
          {images.map((src, idx) => (
            <button
              aria-label='seeMore'
              key={idx}
              type='button'
              onClick={() => onThumbClick(idx)}
              className={clsx(
                'relative flex-shrink-0 w-15 h-15 rounded-lg overflow-hidden transition-transform cursor-pointer',
                idx === currentIndex
                  ? 'ring-1 ring-[#C74242]'
                  : 'hover:scale-105',
              )}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                priority
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-contain'
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})
ImageSlider.displayName = 'ImageSlider'

export default ImageSlider
