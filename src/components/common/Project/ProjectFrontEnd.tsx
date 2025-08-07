'use client'

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import nProgress from 'nprogress'
import { useRouter } from 'next/navigation'

import { usePaginatedDatas } from '@/hooks'
import { fetchByUserProjects } from '@/hooks/fetchers'
import { RootState } from '@/redux/redux'
import { paymentStatusClasses, statusProjectClasses } from '@/constants'

const ProjectFrontEnd = () => {
  const { current } = useSelector((state: RootState) => state?.currentUser)
  const t = useTranslations()
  const router = useRouter()

  const kind = 'project'
  const {
    items: projects,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'projects',
    { kind, userId: current._id },
    fetchByUserProjects,
    {
      revalidateOnFocus: false,
    },
  )

  const handleNav = async (href: string) => {
    nProgress.start()
    try {
      await router.push(href)
    } finally {
      nProgress.done()
    }
  }

  const remainingCount = totalItems - projects.length
  const onLoading = () => nProgress.start()
  const onLoaded = () => nProgress.done()
  useEffect(() => {
    if (isLoading) {
      onLoading()
    } else {
      onLoaded()
    }
  }, [isLoading, onLoading, onLoaded])
  return (
    <div className='space-y-6 mb-20'>
      {projects.map(project => {
        // Chuyển status thành màu badge
        const status = project.status?.toLowerCase() || ''
        const classesStatus =
          statusProjectClasses[status] || 'bg-gray-100 text-gray-800 '
        const classesPaymentStatus =
          paymentStatusClasses[status] || 'bg-gray-100 text-gray-800 '

        const labelProject =
          project.status === 'processing'
            ? t('order.processing')
            : project.status === 'started'
            ? t('projects.started')
            : project.status === 'finished'
            ? t('projects.finished')
            : project.status === 'cancelled'
            ? t('order.canceled')
            : ''
        const labelPayment =
          project.paymentStatus === 'unpaid'
            ? t('projects.unpaid')
            : project.paymentStatus === 'deposited'
            ? t('projects.deposited')
            : project.paymentStatus === 'partial'
            ? t('projects.partial')
            : project.paymentStatus === 'paid'
            ? t('projects.paid')
            : project.paymentStatus === 'processing'
            ? t('order.processing')
            : ''

        const href = `/account/user/projects/${project._id}`

        return (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-3xl border transition px-6 py-4 cursor-pointer'
            onClick={() => handleNav(href)}
          >
            {/* Header đơn hàng */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
              <div className='flex justify-center space-x-2 items-center'>
                <p className='text-sm text-gray-500'>
                  {t('projects.projectCode')}:{' '}
                </p>
                <p className='font-medium text-lg text-gray-800'>
                  {project._id}
                </p>
              </div>
              <div className='mt-3 sm:mt-0 flex items-center space-x-4'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${classesPaymentStatus}`}
                >
                  {labelPayment}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${classesStatus}`}
                >
                  {labelProject}
                </span>
              </div>
            </div>

            {/* Ngày tạo & tổng sản phẩm */}
            <div
              className='flex flex-col sm:flex-row justify-between text-xs 
                            sm:text-sm text-gray-500 space-y-2 sm:space-y-0'
            >
              <span className='break-all'>
                {t('order.address')}: {project.location}
              </span>
              <span>
                {t('projects.dateStart')}: {project.startDate}
              </span>
              <span>
                {t('projects.dateEnd')}: {project.startDate}
              </span>
            </div>

            {/* Danh sách sản phẩm */}
          </motion.div>
        )
      })}

      {remainingCount > 0 && (
        <div className='container mx-auto flex justify-center mt-10 mb-10'>
          <button
            type='button'
            aria-label='seeMore'
            onClick={loadMore}
            disabled={isLoadingMore}
            className='px-[35px] py-[20px] bg-[#C74242] text-[17px] text-white border rounded-full disabled:opacity-50 cursor-pointer 
                            hover:bg-white hover:text-[#C74242] hover:border-[#C74242] transition duration-300 mt-4 flex items-center gap-2 font-[400]'
          >
            {`${t('shop.seeMore')} (${remainingCount})`}
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectFrontEnd
