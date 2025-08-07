'use client'

import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { SlideItem } from './SlideItem'
import { ISlide } from '@/interface'
import nProgress from 'nprogress'

interface SliderProps {
  dataSlide: ISlide[]
}

export const Slider: FC<SliderProps> = React.memo(({ dataSlide }) => {
  // Complete progress bar when slides ready
  useEffect(() => {
    if (dataSlide?.length) nProgress.done()
  }, [dataSlide])

  // Filter and sort once
  const sortedSlides = useMemo(() => {
    return dataSlide
      .filter(slide => slide.activity)
      .sort((a, b) => a.order - b.order)
  }, [dataSlide])

  // Current index state
  const [currentIdx, setCurrentIdx] = useState(0)
  const handleSlideChange = useCallback((swiper: any) => {
    setCurrentIdx(swiper.realIndex)
  }, [])

  return (
    <div className='relative w-full h-screen overflow-hidden will-change-transform'>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect='fade'
        speed={2000}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        onSlideChange={handleSlideChange}
        className='w-full h-screen'
        fadeEffect={{ crossFade: true }}
      >
        {sortedSlides.map((slide, idx) => (
          <SwiperSlide key={slide._id} className='relative w-full h-screen'>
            <SlideItem slide={slide} isActive={currentIdx === idx} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})

Slider.displayName = 'Slider'
export default Slider
