'use client'

import Image from 'next/image'
import React, { useMemo, useRef, useState, FormEvent, ChangeEvent } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarIcon } from 'lucide-react'
import { useSelector } from 'react-redux'

import { RootState } from '@/redux/redux'
import { apiCreateAttendance, apiUpdateAttendanceByDate } from '@/api'
import {
  useAttendanceByDate,
  useAttendanceByMonth,
  useLogos,
  useProjectsByEmployee,
} from '@/hooks'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { EventClickArg, EventContentArg } from '@fullcalendar/core/index.js'
import { formatTimeCZ } from '@/utils'

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
const EmployeeTimeKeeping = () => {
  const calendarRef = useRef<FullCalendar>(null)
  const { current } = useSelector((state: RootState) => state?.currentUser)

  // Logo
  const { items: logos } = useLogos()
  const logo = logos?.find((l: any) => l.logoType === 'logoWhite')

  // Date & modal
  const today = useMemo(() => formatDate(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Fetch data
  const { data: monthlyRecords = [], mutate: refetchMonthly } =
    useAttendanceByMonth({ employeeId: current?._id, month: selectedDate })
  const { data: dailyRecord, mutate: refetchDaily } = useAttendanceByDate({
    employeeId: current?._id,
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

  // Helper: reset form
  const resetForm = () => {
    setProjectId('')
    setShift('')
    setNotes('')
  }

  // Form states
  const [projectId, setProjectId] = useState<string>('')
  const [shift, setShift] = useState<'shift1' | 'shift2' | ''>('')
  const [notes, setNotes] = useState<string>('')

  const shifts = dailyRecord?.shifts || []
  const activeShift = shifts.find((s: any) => !s.checkOut)
  const completedCount = shifts.filter((s: any) => s.checkOut).length
  const maxShiftsReached = completedCount >= 2

  const isFutureDate = (dateStr: string) => dateStr > today

  // Handlers
  const openModalForDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
    resetForm()
    await refetchDaily()
    calendarRef.current?.getApi().gotoDate(dateStr)
    setIsModalOpen(true)
  }

  /*   const handleDateClick = ({ dateStr }: { dateStr: string }) =>
    openModalForDate(dateStr)
  const handleEventClick = ({ event }: EventClickArg) =>
    openModalForDate(event.startStr) */
  /*   const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) =>
    openModalForDate(e.target.value) */

  const handleDateClick = ({ dateStr }: { dateStr: string }) => {
    if (isFutureDate(dateStr)) return
    openModalForDate(dateStr)
  }

  const handleEventClick = ({ event }: EventClickArg) => {
    const dateStr = event.startStr
    if (isFutureDate(dateStr)) return
    openModalForDate(dateStr)
  }

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value
    calendarRef.current?.getApi().gotoDate(newMonth)
    setSelectedDate(newMonth)
  }

  const handleCheckIn = async (e: FormEvent) => {
    e.preventDefault()
    if (!projectId || !shift) {
      toast.error('Chọn đầy đủ dự án và ca làm việc')
      return
    }
    const newShift = {
      projectId,
      shift,
      notes,
      checkIn: new Date().toISOString(),
      checkOut: null,
    }
    try {
      await (dailyRecord?._id
        ? apiUpdateAttendanceByDate(
            { ...dailyRecord, shifts: [...shifts, newShift] },
            dailyRecord._id,
          )
        : apiCreateAttendance({
            projectId,
            hourlyRate: current?.hourlyRate,
            employeeId: current?._id,
            date: selectedDate,
            shifts: [newShift],
          }))
      toast.success('Check-In thành công')
      await Promise.all([refetchDaily(), refetchMonthly()])
      setIsModalOpen(false)
    } catch {
      toast.error('Lỗi, thử lại')
    }
  }

  const handleCheckOut = async (e: FormEvent) => {
    e.preventDefault()
    if (!activeShift) {
      toast.error('Không có ca mở')
      return
    }
    try {
      const updatedShifts = shifts.map((s: any) =>
        s.shift === activeShift.shift && !s.checkOut
          ? { ...s, checkOut: new Date().toISOString() }
          : s,
      )
      await apiUpdateAttendanceByDate(
        { ...dailyRecord, shifts: updatedShifts },
        dailyRecord._id,
      )
      toast.success('Check-Out thành công')
      await Promise.all([refetchDaily(), refetchMonthly()])
      setIsModalOpen(false)
    } catch {
      toast.error('Lỗi, thử lại')
    }
  }

  return (
    <div className=''>
      {/* Header */}
      <div className='flex justify-center mb-6 bg-gray-900 p-5'>
        {logo?.imageUrls?.[0] ? (
          <Image src={logo.imageUrls[0]} alt='Logo' width={200} height={50} />
        ) : (
          <div className='h-12 w-48 bg-gray-700 animate-pulse' />
        )}
      </div>

      {/* Month selector */}
      <div className='p-5'>
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='month'
              value={selectedDate.slice(0, 7)}
              onChange={handleMonthChange}
              className='pl-10 pr-4 py-2 border rounded-lg'
            />
          </div>
        </div>

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
              return formatDate(nextDay)
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
                    <form
                      onSubmit={activeShift ? handleCheckOut : handleCheckIn}
                    >
                      {!activeShift && (
                        <>
                          <div className='mb-4'>
                            <label className='block mb-1'>Dự án</label>
                            <select
                              value={projectId}
                              onChange={e => setProjectId(e.target.value)}
                              className='w-full border p-2 rounded'
                              required
                            >
                              <option value='' disabled>
                                Chọn dự án
                              </option>
                              {projects.map((p: any) => (
                                <option key={p._id} value={p._id}>
                                  {p.translations[0]?.projectName ||
                                    'Không tên'}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className='mb-4'>
                            <label className='block mb-1'>Ca làm việc</label>
                            <select
                              value={shift}
                              onChange={e => setShift(e.target.value as any)}
                              className='w-full border p-2 rounded'
                              required
                            >
                              <option value='' disabled>
                                Chọn ca
                              </option>
                              <option
                                value='shift1'
                                disabled={shifts.some(
                                  (s: any) => s.shift === 'shift1',
                                )}
                              >
                                Ca 1
                              </option>
                              <option
                                value='shift2'
                                disabled={shifts.some(
                                  (s: any) => s.shift === 'shift2',
                                )}
                              >
                                Ca 2
                              </option>
                            </select>
                          </div>

                          <div className='mb-4'>
                            <label className='block mb-1'>
                              Nội dung công việc
                            </label>
                            <textarea
                              value={notes}
                              onChange={e => setNotes(e.target.value)}
                              className='w-full border p-2 rounded h-24'
                            />
                          </div>
                        </>
                      )}

                      {activeShift && (
                        <div className='mb-4 space-y-2 border p-2 rounded'>
                          <p>
                            <strong>Dự án:</strong>{' '}
                            {
                              projects.find(
                                (p: any) => p._id === activeShift.projectId,
                              )?.translations[0]?.projectName
                            }
                          </p>
                          <p>
                            <strong>Ca:</strong>{' '}
                            {activeShift.shift === 'shift1' ? 'Ca 1' : 'Ca 2'}
                          </p>
                          <p>
                            <strong>Check-in:</strong>{' '}
                            {formatTimeCZ(activeShift.checkIn)}
                          </p>
                        </div>
                      )}

                      <div className='flex justify-end space-x-2'>
                        <button
                          type='button'
                          onClick={() => setIsModalOpen(false)}
                          className='px-4 py-2 border rounded cursor-pointer'
                        >
                          Đóng
                        </button>
                        <button
                          type='submit'
                          className='px-4 py-2 text-white rounded bg-blue-600 cursor-pointer'
                        >
                          {activeShift ? 'Check-Out' : 'Check-In'}
                        </button>
                      </div>
                    </form>
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

export default EmployeeTimeKeeping
