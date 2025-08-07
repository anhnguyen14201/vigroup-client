'use client'

import React, { useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import {
  useAttendanceByDate,
  useAttendanceByMonth,
  useProjectsByEmployee,
} from '@/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { EventClickArg, EventContentArg } from '@fullcalendar/core/index.js'
import { formatTimeCZ } from '@/utils'
import { useParams } from 'next/navigation'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  extendedProps?: Record<string, any>
}

const formatDate = (date: Date): string => {
  const Y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const D = String(date.getDate()).padStart(2, '0')
  return `${Y}-${M}-${D}`
}
const EmployeeTimeKeepingInfor = ({
  selectedDate,
  setSelectedDate,
  today,
}: any) => {
  const { id } = useParams()

  const calendarRef = useRef<FullCalendar>(null)

  // Date & modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Fetch data
  const { data: monthlyRecords = [] } = useAttendanceByMonth({
    employeeId: id,
    month: selectedDate,
  })
  const { data: dailyRecord, mutate: refetchDaily } = useAttendanceByDate({
    employeeId: id,
    date: selectedDate,
  })
  const { data: projects = [] } = useProjectsByEmployee()

  // Prepare calendar events
  const events = useMemo<CalendarEvent[]>(
    () =>
      monthlyRecords.map((rec: any) => ({
        id: rec._id,
        start: formatDate(new Date(rec.date)),
        extendedProps: {
          shifts: rec.shifts.map((s: any) => ({
            shift: s.shift,
            checkOut: !!s.checkOut,
          })),
        },
      })),
    [monthlyRecords],
  )

  const shifts = dailyRecord?.shifts || []
  const completedCount = shifts.filter((s: any) => s.checkOut).length
  const maxShiftsReached = completedCount >= 2

  const isFutureDate = (dateStr: string) => dateStr > today

  // Handlers
  const openModalForDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
    await refetchDaily()
    calendarRef.current?.getApi().gotoDate(dateStr)
    setIsModalOpen(true)
  }

  const handleDateClick = ({ dateStr }: { dateStr: string }) => {
    if (isFutureDate(dateStr)) return
    openModalForDate(dateStr)
  }

  const handleEventClick = ({ event }: EventClickArg) => {
    const dateStr = event.startStr
    if (isFutureDate(dateStr)) return
    openModalForDate(dateStr)
  }

  return (
    <div className=''>
      {/* Month selector */}
      <div className='p-5'>
        {/* Calendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          initialDate={selectedDate}
          headerToolbar={false}
          validRange={{
            end: (() => {
              const nextDay = new Date()
              nextDay.setDate(nextDay.getDate() + 1)
              return nextDay.toISOString().split('T')[0]
            })(),
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={(arg: EventContentArg) => (
            <div className='font-semibold text-center bg-transparent'>
              {arg.event.extendedProps.shifts.map((s: any, i: number) => (
                <div key={i} className='bg-transparent border-transparent'>
                  <span className='text-black'>
                    {s.shift === 'shift1' ? 'Ca 1' : 'Ca 2'}:{' '}
                  </span>
                  <span className='text-blue-700'>{s.checkOut ? '✓' : ''}</span>
                </div>
              ))}
            </div>
          )}
          eventBackgroundColor='transparent'
          eventBorderColor='transparent'
          dayCellClassNames={({ date }) => {
            const dateStr = formatDate(date)
            if (dateStr > today) return 'pointer-events-none opacity-50'
            if (dateStr === selectedDate)
              return 'bg-yellow-200 border-yellow-500'
            return ''
          }}
          ref={calendarRef}
          height='auto'
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 flex items-center justify-center z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className='absolute inset-0 bg-black opacity-50'
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              className='bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md'
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className='text-xl font-semibold mb-4 text-center'>
                Chấm công: {selectedDate}
              </h2>

              {shifts.length === 0 && today !== selectedDate ? (
                <div className='text-center py-6'>
                  <p className='mb-4'>Bạn chưa chấm công ngày này.</p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='px-4 py-2 border rounded'
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <div>
                  {completedCount > 0 && !maxShiftsReached && (
                    <div className='mb-4'>
                      {shifts
                        .filter((s: any) => s.checkOut)
                        .map((s: any, idx: number) => (
                          <div key={idx} className='border p-2 rounded mb-2'>
                            <p>
                              <strong>Dự án:</strong>{' '}
                              {
                                projects.find((p: any) => p._id === s.projectId)
                                  ?.translations[0]?.projectName
                              }
                            </p>
                            <p>
                              <strong>Ca:</strong>{' '}
                              {s.shift === 'shift1' ? 'Ca 1' : 'Ca 2'}
                            </p>

                            <p>
                              <strong>Check-in:</strong>{' '}
                              {formatTimeCZ(s.checkIn)}
                            </p>
                            <p>
                              <strong>Check-out:</strong>{' '}
                              {formatTimeCZ(s.checkOut!)}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                  {maxShiftsReached ? (
                    <div className='space-y-4'>
                      {shifts.map((s: any, idx: number) => (
                        <div key={idx} className='border p-4 rounded'>
                          <p>
                            <strong>Ca:</strong>{' '}
                            {s.shift === 'shift1' ? 'Ca 1' : 'Ca 2'}
                          </p>
                          <p>
                            <strong>Dự án:</strong>{' '}
                            {
                              projects.find((p: any) => p._id === s.projectId)
                                ?.translations[0]?.projectName
                            }
                          </p>
                          <p>
                            <strong>Check-in:</strong> {formatTimeCZ(s.checkIn)}
                          </p>
                          <p>
                            <strong>Check-out:</strong>{' '}
                            {s.checkOut ? formatTimeCZ(s.checkOut) : '-'}
                          </p>
                          <p>
                            <strong>Ghi chú:</strong> {s.notes}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className='block mx-auto px-4 py-2 border rounded cursor-pointer'
                      >
                        Đóng
                      </button>
                    </div>
                  ) : today !== selectedDate ? (
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className='block mx-auto px-4 py-2 border rounded cursor-pointer'
                    >
                      Đóng
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmployeeTimeKeepingInfor
