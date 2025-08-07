'use client'

import EmployeeInfor from '@/components/common/Employees/EmployeeInfor'
import EmployeeTimeKeepingInfor from '@/components/common/Employees/EmployeeTimeKeepingInfor'
import { useGetUserById } from '@/hooks'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { ChangeEvent, useMemo, useState } from 'react'

const EmployeeDetailPage = () => {
  const formatDate = (date: Date): string => date.toISOString().split('T')[0]
  const { id } = useParams()
  const userId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: userData } = useGetUserById(userId)
  const today = useMemo(() => formatDate(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string>(today)

  const openModalForDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
  }
  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) =>
    openModalForDate(e.target.value)

  return (
    <div className='w-full mx-auto mt-10'>
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

      {/* Calendar input */}
      <EmployeeInfor selectedDate={selectedDate} userData={userData} id={id} />
      <EmployeeTimeKeepingInfor
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        today={today}
      />
    </div>
  )
}

export default EmployeeDetailPage
