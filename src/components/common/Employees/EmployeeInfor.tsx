import { useAttendanceByMonth } from '@/hooks'
import { formatCurrency } from '@/utils'
import React from 'react'

const EmployeeInfor = ({ selectedDate, userData, id }: any) => {
  const { data: monthlyRecords = [] } = useAttendanceByMonth({
    employeeId: id,
    month: selectedDate,
  })

  const hourlyRate = userData?.hourlyRate || 0

  // Tổng ngày công và giờ
  const totalDays = monthlyRecords.filter(
    (entry: any) => entry.totalHours > 0,
  ).length
  const totalHours = monthlyRecords.reduce(
    (sum: any, entry: any) => sum + entry.totalHours,
    0,
  )
  const totalSalary = monthlyRecords.reduce(
    (sum: any, entry: any) => sum + entry.salary,
    0,
  )

  const dataCards = [
    { label: 'Lương theo giờ', value: formatCurrency(hourlyRate, 203) },
    { label: 'Tổng số ngày công', value: totalDays },
    { label: 'Tổng số giờ làm', value: totalHours.toFixed(2) },
    { label: 'Lương tháng', value: formatCurrency(totalSalary, 203) },
  ]

  return (
    <div className='w-full mx-auto px-4'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl'>
        {/* Sử dụng 6 cột ở xl để userInfo span 2 và 4 cards span 1 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {/* User Info Card span 2 cột tại xl */}
          <div className='col-span-1 xl:col-span-2 p-6 rounded-2xl border bg-white dark:bg-gray-800'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {userData?.fullName}
              </h2>
              <div className='flex text-sm flex-wrap xl:gap-5 text-gray-600 dark:text-gray-400'>
                <div>Mail: {userData?.email}</div>
                <div>Tell: {userData?.phone}</div>
              </div>
              <div className='capitalize text-sm text-gray-600 dark:text-gray-400'>
                Địa chỉ: {userData?.street}, {userData?.postalCode},{' '}
                {userData?.province}
              </div>
            </div>
          </div>

          {/* Data Cards mỗi thẻ 1 cột tại xl */}
          {dataCards.map(({ label, value }) => (
            <div
              key={label}
              className='col-span-1 p-5 rounded-2xl border bg-white dark:bg-gray-800 flex flex-col justify-between'
            >
              <div className='flex items-center space-x-2'>
                <span className='text-base text-gray-500 dark:text-gray-400'>
                  {label}
                </span>
              </div>
              <span className='mt-3 text-3xl font-extrabold text-gray-900 dark:text-white'>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeInfor
