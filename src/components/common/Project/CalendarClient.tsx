// Calendar.tsx
'use client'

import React, { useRef, useState, useMemo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarIcon } from 'lucide-react'
import { EventContentArg } from '@fullcalendar/core/index.js'
import { KeyedMutator } from 'swr'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Input } from '@/components/ui'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
}

interface CalendarProps {
  initialDate?: string
  projectData: any
  mutate?: KeyedMutator<any>
  onDateClick?: (arg: { dateStr: string }) => void
  onEventClick?: (arg: any) => void
}

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const CalendarClient: React.FC<CalendarProps> = ({
  initialDate,
  onDateClick,
  onEventClick,
  projectData,
}) => {
  const t = useTranslations()

  const today = formatLocalDate(new Date())
  const { dailyProgress } = projectData || {}

  const [selectedDate, setSelectedDate] = useState(initialDate || today)
  const [modalOpen, setModalOpen] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)

  // Tìm existingProgress cho ngày đã chọn (nếu có)
  const existingProgress = useMemo(() => {
    if (!dailyProgress || !Array.isArray(dailyProgress)) return null
    return dailyProgress.find(
      dp => formatLocalDate(new Date(dp.date)) === selectedDate,
    )
  }, [dailyProgress, selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    calendarRef.current?.getApi().gotoDate(newDate)
  }

  const handleCalendarDateClick = ({ dateStr }: { dateStr: string }) => {
    setSelectedDate(dateStr)
    setModalOpen(true)
    onDateClick?.({ dateStr })
  }

  const handleEventClick = (arg: any) => {
    const dateStr = arg.event.startStr
    setSelectedDate(dateStr)
    setModalOpen(true)
    onEventClick?.(arg)
  }

  const events = useMemo<CalendarEvent[]>(() => {
    if (!Array.isArray(dailyProgress)) return []
    return dailyProgress.map(dp => {
      const dateStr = formatLocalDate(new Date(dp.date))
      const desc = dp.description || ''
      return {
        id: dp._id,
        title: desc.slice(0, 20) + (desc.length > 20 ? '…' : ''),
        start: dateStr,
        extendedProps: { fullDescription: desc },
      }
    })
  }, [dailyProgress])

  const renderEventContent = useCallback(
    (arg: EventContentArg) => (
      <div className='p-1 text-md text-gray-600 truncate'>
        {arg.event.extendedProps.fullDescription}
      </div>
    ),
    [],
  )

  return (
    <div className='mx-auto p-4'>
      <div className='mb-6 flex justify-center'>
        <div className='relative'>
          <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
          <Input
            id='datePicker'
            type='date'
            value={selectedDate}
            onChange={handleDateChange}
            className='pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        initialDate={selectedDate}
        headerToolbar={false}
        events={events}
        dateClick={handleCalendarDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height='auto'
        ref={calendarRef}
        dayCellClassNames={args =>
          formatLocalDate(args.date) === selectedDate
            ? 'bg-yellow-200 border border-yellow-500 cursor-pointer'
            : ''
        }
      />

      {modalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => setModalOpen(false)}
          />
          <div className='relative bg-white p-6 rounded-lg shadow-md z-10 min-w-[80vw] min-h-[80vh] overflow-auto'>
            <h2 className='text-xl font-bold mb-4 text-center'>
              {t('projects.dailyProgress')}: {selectedDate}
            </h2>

            <h3 className='mb-10'>
              {t('projects.jobDescription')}: {existingProgress.description}
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {existingProgress.imageUrls.map((url: string, idx: number) => (
                <div key={idx} className='relative w-full h-64 sm:h-80 lg:h-96'>
                  <Image
                    src={url}
                    alt={`Progress image ${idx + 1}`}
                    fill
                    sizes='(min-width: 640px) 100vw,
                   (min-width: 768px) 50vw,
                   33vw'
                    className='object-cover rounded-md'
                    priority={idx < 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc-daygrid-day-frame {
          cursor: pointer;
        }
        .fc-h-event {
          background-color: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}

export default CalendarClient
