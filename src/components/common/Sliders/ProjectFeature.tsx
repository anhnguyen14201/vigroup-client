'use client'

import clsx from 'clsx'
import { motion, useMotionValue, useAnimation } from 'framer-motion'
import { ArrowUpRight, Building } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react'

import { useGetContentTranslation } from '@/hooks'
import { Locale } from '@/interface'
const GAP = 24
const ProjectFeature = React.memo(
  ({ datas, url }: { datas: any[]; url: string }) => {
    const locale = useLocale() as Locale
    const t = useTranslations('service')
    const carouselRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const controls = useAnimation()

    // Layout state
    const [itemWidth, setItemWidth] = useState(0)
    const [dragWidth, setDragWidth] = useState(0)
    const [visibleCount, setVisibleCount] = useState(1)
    const [pages, setPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)

    // Precompute translated items
    const items = useMemo(
      () =>
        datas.map(template => {
          const trans = useGetContentTranslation(template, locale)
          return {
            id: template._id,
            title:
              typeof trans === 'object'
                ? trans.projectName || ''
                : String(trans),
            slug: trans?.slug || '',
            buildingType: trans?.buildingType || '',
            thumbnail: Array.isArray(template.thumbnailUrls)
              ? template.thumbnailUrls[0]
              : '',
          }
        }),
      [datas, locale],
    )

    // Calculate dimensions on mount and resize
    const calculateLayout = useCallback(() => {
      const ref = carouselRef.current
      if (!ref || items.length === 0) return
      const { scrollWidth, offsetWidth } = ref
      setDragWidth(scrollWidth - offsetWidth)

      const firstItem = ref.querySelector<HTMLElement>('.carousel-item')
      if (firstItem) {
        const w = firstItem.offsetWidth
        setItemWidth(w + GAP)
        const count = Math.max(Math.floor(offsetWidth / w), 1)
        setVisibleCount(count)
        setPages(Math.ceil(items.length / count))
        setCurrentPage(0)
        controls.set({ x: 0 })
      }
    }, [items.length, controls])

    useLayoutEffect(() => {
      calculateLayout()
      window.addEventListener('resize', calculateLayout)
      return () => window.removeEventListener('resize', calculateLayout)
    }, [calculateLayout])

    // Track drag position to update current page
    useEffect(() => {
      const maxStart = Math.max(items.length - visibleCount, 0)
      return x.onChange(latest => {
        const idx = Math.round(-latest / itemWidth)
        let page = idx >= maxStart ? pages - 1 : Math.floor(idx / visibleCount)
        page = Math.max(0, Math.min(page, pages - 1))
        setCurrentPage(page)
      })
    }, [x, itemWidth, visibleCount, pages, items.length])

    const handleDotClick = useCallback(
      (pageIdx: number) => {
        const target = Math.min(
          pageIdx * visibleCount,
          items.length - visibleCount,
        )
        controls.start({
          x: -target * itemWidth,
          transition: { type: 'tween', ease: 'easeOut', duration: 0.5 },
        })
        setCurrentPage(pageIdx)
      },
      [controls, visibleCount, itemWidth, items.length],
    )

    return (
      <div>
        <div
          className='w-full overflow-hidden cursor-grab'
          style={{ columnGap: `${GAP}px` }}
          ref={carouselRef}
        >
          <motion.div
            className='flex gap-6 p-4'
            style={{ x }}
            drag='x'
            dragConstraints={{ right: 0, left: -dragWidth }}
            animate={controls}
            whileTap={{ cursor: 'grabbing' }}
          >
            {datas.map((template: any) => {
              const trans = useGetContentTranslation(template, locale)
              const title: string =
                typeof trans === 'object'
                  ? trans.projectName || ''
                  : String(trans)
              const preview = Array.isArray(template.thumbnailUrls)
                ? template.thumbnailUrls[0]
                : ''

              return (
                <div
                  key={template._id}
                  className='carousel-item md:min-w-[350px] md:max-w-[350px] min-w-[300px] max-w-[300px] relative 
                          bg-white transition duration-300 flex flex-col justify-between flex-shrink-0'
                >
                  <Link href={`/${url}/${trans?.slug}` || '/'} passHref>
                    <div
                      className={`relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden cursor-pointer group rounded-l-3xl 
                                rounded-t-3xl`}
                    >
                      {preview ? (
                        <>
                          <div
                            className='relative w-full h-full overflow-hidden group-hover:scale-105 transition-transform 
                                        duration-500 ease-in-out'
                          >
                            <Image
                              src={preview}
                              alt=''
                              fill
                              priority
                              sizes='(max-width: 768px) 100vw, 50vw'
                              className='object-cover'
                            />
                            <div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent' />
                          </div>

                          <button
                            type='button'
                            aria-label='Open details'
                            className="
                          absolute -bottom-1.5 -right-1.5
                          bg-white w-25 h-25 rounded-tl-[50%]
                          before:content-[''] before:absolute
                            before:bottom-1.5 before:-left-5
                            before:w-5 before:h-5 before:bg-transparent
                            before:rounded-br-3xl
                            before:shadow-[0.313rem_0.313rem_0_0.313rem_#fff]
                          after:content-[''] after:absolute
                            after:-top-5 after:right-1.5
                            after:w-5 after:h-5 after:bg-transparent
                            after:rounded-br-3xl
                            after:shadow-[0.313rem_0.313rem_0_0.313rem_#fff]
                        "
                          >
                            <div
                              className='
                            absolute inset-4 rounded-full bg-[#9d3f3f]
                            flex items-center justify-center cursor-pointer
                            transition-transform duration-500 ease-in-out
                            group-hover:scale-105
                          '
                            >
                              <ArrowUpRight
                                className='w-5 h-5 text-white'
                                aria-hidden='true'
                                focusable='false'
                              />
                            </div>
                          </button>

                          <div className='absolute bottom-4 left-4 text-white w-full'>
                            <h1 className='text-lg font-semibold truncate max-w-[calc(100%-116px)] mb-2'>
                              {title}
                            </h1>
                            <p className='text-sm flex items-center gap-1'>
                              <Building className='w-4 h-4' />
                              {trans?.buildingType}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* Dots navigation per page */}
        <div className='flex justify-center items-center mt-4 mb-4'>
          {Array.from({ length: pages }).map((_, idx) => (
            <button
              type='button'
              key={idx}
              className={clsx(
                'w-2 h-2 mx-3 rounded-full transition-all cursor-pointer',
                currentPage === idx ? 'bg-[#9d3f3f] scale-125' : 'bg-gray-300',
              )}
              onClick={() => handleDotClick(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    )
  },
)

ProjectFeature.displayName = 'ProjectFeature'

export default ProjectFeature
