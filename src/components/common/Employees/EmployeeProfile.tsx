'use client'

import Image from 'next/image'
import React, { ChangeEvent, useMemo, useState } from 'react'

import { useAttendanceByMonth, useLogos } from '@/hooks'
import { CalendarIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import { formatCurrency, formatDateCZ, formatPhone } from '@/utils'

const EmployeeProfile = () => {
  const { items: logos } = useLogos()
  const logo = logos?.find((l: any) => l.logoType === 'logoWhite')
  const formatDate = (date: Date): string => date.toISOString().split('T')[0]
  const { current } = useSelector((state: RootState) => state?.currentUser)

  const today = useMemo(() => formatDate(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string>(today)

  const { data: monthlyRecords = [] } = useAttendanceByMonth({
    employeeId: current?._id,
    month: selectedDate,
  })

  const openModalForDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
  }
  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) =>
    openModalForDate(e.target.value)

  const hourlyRate = current?.hourlyRate || 0

  // Tính tổng số ngày công (những ngày có tổng giờ > 0)
  const totalDays = monthlyRecords?.filter(
    (entry: any) => entry.totalHours > 0,
  ).length

  // Tính tổng số giờ làm
  const totalHours = monthlyRecords?.reduce(
    (sum: any, entry: any) => sum + entry.totalHours,
    0,
  )

  // Tính tổng lương
  const totalSalary = monthlyRecords?.reduce(
    (sum: any, entry: any) => sum + entry.salary,
    0,
  )

  const stats = [
    { label: 'Lương theo giờ', value: formatCurrency(hourlyRate, 203) },
    { label: 'Số ngày công', value: totalDays },
    { label: 'Số giờ làm', value: totalHours.toFixed(2) },
    { label: 'Lương', value: formatCurrency(totalSalary.toFixed(2), 203) },
  ]

  return (
    <div>
      <div className='flex justify-center mb-6 bg-gray-900 p-5'>
        {logo?.imageUrls?.[0] ? (
          <Image src={logo.imageUrls[0]} alt='Logo' width={200} height={50} />
        ) : (
          <div className='h-12 w-48 bg-gray-700 animate-pulse' />
        )}
      </div>

      <div className='flex justify-center mb-4'>
        <div className='relative'>
          <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
          <input
            type='month'
            value={selectedDate.slice(0, 7)}
            onChange={handleMonthChange}
            className='pl-10 pr-4 py-2 border rounded-lg focus:ring-0'
          />
        </div>
      </div>

      <div className='w-full max-w-md mx-auto px-4 py-6'>
        <div className='space-y-4'>
          <div
            className='bg-white rounded-2xl p-5 flex flex-col justify-between  
                          transform transition-transform border'
          >
            <span className='text-2xl font-semibold text-gray-900 dark:text-gray-400 capitalize'>
              {current?.fullName}
            </span>
            <span className='mt-2 text-gray-500  text-base dark:text-white'>
              {current?.email}
            </span>
            <span className='mt-2 text-gray-500  text-base dark:text-white'>
              {formatPhone(current?.phone)}
            </span>
            <span className='mt-2 text-gray-500  text-base dark:text-white capitalize'>
              {current?.street}, {current?.postalCode}, {current?.province}
            </span>
            <span className='mt-2 text-gray-500  text-base dark:text-white capitalize'>
              {current?.position}
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className='bg-white rounded-2xl p-5 flex flex-col justify-between  
                          transform transition-transform border'
              >
                <span className='text-gray-500 dark:text-gray-400 text-base'>
                  {label}
                </span>
                <span className='mt-2 text-2xl font-semibold text-gray-900 dark:text-white'>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <section className='bg-white dark:bg-gray-800 rounded-2xl p-4 border mb-20'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
              Chi tiết chấm công
            </h2>
            {monthlyRecords?.length === 0 ? (
              <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                Chưa có dữ liệu trong tháng này
              </p>
            ) : (
              <div className='overflow-y-auto'>
                {monthlyRecords?.map((rec: any) => (
                  <div
                    key={rec.date}
                    className='flex justify-between py-2 border-b last:border-none border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300'
                  >
                    <span>{formatDateCZ(rec.date)}</span>
                    <span>{formatCurrency(rec.hourlyRate, 203)}/Giờ</span>
                    <span>{rec.totalHours.toFixed(2)} Giờ</span>
                    <span>{formatCurrency(rec.salary, 203)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
