// Calendar.tsx
'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarIcon } from 'lucide-react'
import { EventContentArg } from '@fullcalendar/core/index.js'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'
import nProgress from 'nprogress'
import { useDispatch } from 'react-redux'

import { GenericForm } from '@/components/common/Forms'
import { Input } from '@/components/ui'
import { apiCreateProgressProject, apiUpdateProgressProject } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import { KeyedMutator } from 'swr'

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

const Calendar: React.FC<CalendarProps> = ({
  initialDate,
  onDateClick,
  onEventClick,
  projectData,
  mutate,
}) => {
  const { id } = useParams()
  const today = formatLocalDate(new Date())
  const dispatch = useDispatch<AppDispatch>()

  const { dailyProgress } = projectData || {}

  const [selectedDate, setSelectedDate] = useState(initialDate || today)
  const [modalOpen, setModalOpen] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)

  // Đây là mảng string[] thực tế đang giữ tất cả URL (cũ + mới) cho field "image"
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Tìm existingProgress cho ngày đã chọn (nếu có)
  const existingProgress = useMemo(() => {
    if (!dailyProgress || !Array.isArray(dailyProgress)) return null
    return dailyProgress.find(
      dp => formatLocalDate(new Date(dp.date)) === selectedDate,
    )
  }, [dailyProgress, selectedDate])

  // Khi modalOpen bật lên, nếu existingProgress tồn tại => khởi previewUrls = imageUrls cũ
  // Ngược lại, modal mà không có dữ liệu cũ => previewUrls = []
  useEffect(() => {
    if (modalOpen && existingProgress) {
      setPreviewUrls(existingProgress.imageUrls || [])
    } else if (modalOpen && !existingProgress) {
      setPreviewUrls([])
    }
  }, [modalOpen, existingProgress])

  useEffect(() => {
    setPreviewUrls(existingProgress?.imageUrls ?? [])
  }, [existingProgress, selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    calendarRef?.current?.getApi().gotoDate(newDate)
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

  // Dữ liệu khởi tạo cho form: chỉ giữ text + để file = []
  const formInitialData = useMemo(() => {
    return {
      projectId: id?.toString() || '',
      date: selectedDate,
      description: existingProgress?.description || '',
      image: [] as File[],
    }
  }, [id, selectedDate, existingProgress])

  // previewInitial BẮT BUỘC phải là object: { image: [...] }
  const previewInitial = useMemo<Record<string, string[]>>(() => {
    return {
      image: existingProgress?.imageUrls || [],
    }
  }, [existingProgress])

  const formFields = useMemo(
    () => [
      {
        name: 'description',
        label: 'Ghi chú tiến độ',
        type: 'textarea',
        placeholder: 'Nhập mô tả...',
      },
      {
        name: 'image',
        label: 'Hình ảnh',
        type: 'file',
        multiple: true,
        accept: 'image/*',
      },
    ],
    [],
  )

  const handleFormSubmit = useCallback(
    async (values: any) => {
      const formData = new FormData()
      formData.append('date', values.date)
      formData.append('projectId', values.projectId)
      formData.append('description', values.description)

      // Đẩy previewUrls (cũ + mới) lên API
      formData.append('imageUrls', JSON.stringify(previewUrls))

      // Nếu có file mới, đẩy file lên
      values.image?.forEach((file: File) => formData.append('image', file))

      try {
        // Bật loading và bắt đầu nProgress
        dispatch(setLoading({ key: 'ProgressProject', value: true }))
        nProgress.start()

        // Gọi API dựa trên việc có existingProgress hay không
        const res = existingProgress
          ? await apiUpdateProgressProject(formData, existingProgress._id)
          : await apiCreateProgressProject(formData)

        if (res.data) {
          toast.success(
            existingProgress ? 'Sửa thành công!' : 'Thêm thành công!',
          )
        } else {
          toast.error('Có lỗi xảy ra!')
        }

        // Cập nhật lại project và đóng modal

        mutate && (await mutate())
        setModalOpen(false)
      } catch {
      } finally {
        dispatch(setLoading({ key: 'ProgressProject', value: false }))
        nProgress.done()
      }
    },
    [existingProgress, dispatch, previewUrls, mutate],
  )

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
          <div className='bg-white p-6 rounded-lg shadow-md z-10  w-[90vw]'>
            <h3 className='text-xl font-bold mb-4'>
              {existingProgress
                ? `Cập nhật tiến độ ngày ${selectedDate}`
                : `Thêm tiến độ ngày ${selectedDate}`}
            </h3>

            <GenericForm
              key={existingProgress?._id || selectedDate}
              initialData={formInitialData}
              fields={formFields as any}
              onSubmitApi={handleFormSubmit}
              onSuccess={() => setModalOpen(false)}
              preview={previewInitial}
              onPreviewChange={allPreviews => {
                const realUrls = (allPreviews || []).filter(
                  u => !u.startsWith('blob:'),
                )
                setPreviewUrls(realUrls)
              }}
            />
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

export default Calendar
