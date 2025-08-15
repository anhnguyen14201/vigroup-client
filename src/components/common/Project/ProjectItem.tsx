// ProjectItem.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { ArrowUpRight, Building, MapPin } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useGetContentTranslation } from '@/hooks'
import { Locale } from '@/interface'
import Link from 'next/link'

interface ProjectItemProps {
  templates: any[]
  url: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const ProjectItem: React.FC<ProjectItemProps> = ({ templates, url }) => {
  const locale = useLocale() as Locale

  return (
    <AnimatePresence>
      <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {templates.map(template => {
          // useGetContentTranslation returns an object; extract the name string
          const trans = useGetContentTranslation(template, locale)
          const title: string =
            typeof trans === 'object' ? trans.projectName || '' : String(trans)
          const preview = Array.isArray(template.thumbnailUrls)
            ? template.thumbnailUrls[0]
            : ''

          console.log(template)

          return (
            <motion.div
              key={template._id}
              className='relative group overflow-hidden mt-10'
              variants={itemVariants}
              initial='hidden'
              animate='enter'
              exit='exit'
              transition={{ duration: 0.5 }}
              layout
            >
              <Link href={`/${url}/${trans?.slug}` || '/'} passHref>
                <div
                  className={`relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden cursor-pointer group 
                              rounded-l-3xl rounded-t-3xl`}
                >
                  {preview ? (
                    <>
                      <div
                        className='relative w-full h-full overflow-hidden group-hover:scale-105 transition-transform 
                                    duration-500 ease-in-out'
                      >
                        {' '}
                        <Image
                          src={preview}
                          alt={title}
                          fill
                          priority
                          sizes='100%'
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
                            absolute inset-4 rounded-full bg-[#C74242]
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
                        <p className='text-sm flex items-center gap-1 max-w-[calc(100%-116px)]'>
                          <Building className='w-4 h-4 flex-shrink-0' />
                          <span className='truncate min-w-0'>
                            {trans?.buildingType}
                          </span>
                        </p>

                        <p className='text-sm flex items-center gap-1 max-w-[calc(100%-116px)]'>
                          <Building className='w-4 h-4 flex-shrink-0' />
                          <span className='truncate min-w-0'>
                            {template?.location}
                          </span>
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
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}

export default ProjectItem
