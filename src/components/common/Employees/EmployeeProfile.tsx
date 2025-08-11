'use client'

import Image from 'next/image'
import React, { ChangeEvent, useMemo, useState } from 'react'

import { useAttendanceByMonth, useLogos } from '@/hooks'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import { motion, AnimatePresence } from 'framer-motion'

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

  const groupedByDate = useMemo(() => {
    const map: Record<
      string,
      {
        date: string
        dayShift: { hours: number; salary: number; rate: number | null }
        nightShift: { hours: number; salary: number; rate: number | null }
      }
    > = {}

    monthlyRecords?.forEach((rec: any) => {
      // nếu rec là ngày có mảng shifts, dùng mảng đó; nếu rec là ca đơn lẻ thì bọc vào mảng
      const shifts = Array.isArray(rec.shifts) ? rec.shifts : [rec]

      // lấy key ngày: ưu tiên rec.date (nếu có), else lấy checkIn của ca đầu
      const baseDate = rec.date ?? shifts[0]?.checkIn
      if (!baseDate) return // không đủ dữ liệu

      const dateKey = new Date(baseDate).toISOString().slice(0, 10)

      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          dayShift: { hours: 0, salary: 0, rate: null },
          nightShift: { hours: 0, salary: 0, rate: null },
        }
      }

      const item = map[dateKey]

      // xử lý từng ca trong ngày
      shifts.forEach((s: any) => {
        const hours = Number(s.totalShiftHours ?? 0)
        const salary = Number(s.salaryForShift ?? 0)

        if (s.dayShiftHourlyRate && s.dayShiftHourlyRate > 0) {
          item.dayShift.hours += hours
          item.dayShift.salary += salary
          // giữ rate đầu tiên tìm được (không ghi đè nếu đã có)
          if (!item.dayShift.rate) item.dayShift.rate = s.dayShiftHourlyRate
        } else if (s.nightShiftHourlyRate && s.nightShiftHourlyRate > 0) {
          item.nightShift.hours += hours
          item.nightShift.salary += salary
          if (!item.nightShift.rate)
            item.nightShift.rate = s.nightShiftHourlyRate
        } else {
          // fallback: dựa vào tên shift nếu có
          const shName = String(s.shift ?? '').toLowerCase()
          if (shName.includes('night') || shName.includes('shift2')) {
            item.nightShift.hours += hours
            item.nightShift.salary += salary
          } else {
            item.dayShift.hours += hours
            item.dayShift.salary += salary
          }
        }
      })
    })

    // sort ngày (mặc định giảm dần)
    return Object.values(map).sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [monthlyRecords])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
              <div className='space-y-3'>
                {groupedByDate.map((rec, idx) => {
                  const totalSalary =
                    rec.dayShift.salary + rec.nightShift.salary
                  const totalHours = rec.dayShift.hours + rec.nightShift.hours
                  const isOpen = openIndex === idx

                  return (
                    <article
                      key={rec.date}
                      className='bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800'
                    >
                      {/* header */}
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className='w-full flex items-center justify-between gap-2 px-4 py-3 md:py-4 md:px-5'
                        aria-expanded={isOpen}
                      >
                        <div className='flex items-start gap-3'>
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-sm font-semibold'>
                              {new Date(rec.date).getDate()}
                            </div>
                          </div>
                          <div className='text-left'>
                            <div className='text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100'>
                              {formatDateCZ(rec.date)}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                              Tổng giờ: {totalHours.toFixed(2)} giờ
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className='text-sm md:text-base font-semibold text-emerald-600 dark:text-emerald-400'>
                            {formatCurrency(totalSalary, 203)}
                          </div>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.18 }}
                            className='text-gray-400 dark:text-gray-500'
                          >
                            <ChevronDown size={18} />
                          </motion.span>
                        </div>
                      </button>

                      {/* content (collapsible) */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.section
                            key='content'
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className='px-4 pb-4 md:px-5 md:pb-5'
                          >
                            <div className='grid grid-cols-1 gap-2'>
                              {/* Day card */}
                              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800'>
                                <div className='flex items-center justify-between'>
                                  <div className='text-sm text-gray-500'>
                                    Ca ngày
                                  </div>
                                </div>

                                <div className='flex justify-between items-end gap-2'>
                                  <div>
                                    <div className='text-sm font-semibold text-gray-800'>
                                      {rec.dayShift.rate
                                        ? `${formatCurrency(
                                            rec.dayShift.rate,
                                            203,
                                          )}/Giờ`
                                        : '-'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                                      {rec.dayShift.hours.toFixed(2)} Giờ
                                    </div>
                                  </div>

                                  <div className='text-right'>
                                    <div className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                                      {formatCurrency(rec.dayShift.salary, 203)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Night card */}
                              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800'>
                                <div className='flex items-center justify-between'>
                                  <div className='text-sm text-gray-500'>
                                    Ca đêm
                                  </div>
                                </div>

                                <div className='flex justify-between items-end gap-2'>
                                  <div className='text-sm font-semibold text-gray-800'>
                                    {rec.nightShift.rate
                                      ? `${formatCurrency(
                                          rec.nightShift.rate,
                                          203,
                                        )}/Giờ`
                                      : '-'}
                                  </div>
                                  <div>
                                    <div className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                                      {rec.nightShift.hours.toFixed(2)} Giờ
                                    </div>
                                  </div>

                                  <div className='text-right'>
                                    <div className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                                      {formatCurrency(
                                        rec.nightShift.salary,
                                        203,
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.section>
                        )}
                      </AnimatePresence>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
