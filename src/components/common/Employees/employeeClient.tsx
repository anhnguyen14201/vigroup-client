'use client'

import { ChangeEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { IRegisterForm, IUser } from '@/interface'
import DataTable from '@/components/common/DataTable'
import {
  getEmployeeColumns,
  userFormEditFields,
  userFormFields,
} from '@/constants'
import { GenericForm } from '@/components/common/Forms'
import { ModalToggle } from '@/components/modal'
import { usePaginatedDatas, useUserActions } from '@/hooks'
import { mapEmployeeToRegisterForm } from '@/utils'
import { fetchEmployee } from '@/hooks/fetchers'
import { CalendarIcon } from 'lucide-react'

const EmployeeClient: React.FC = () => {
  const router = useRouter()

  // --- Local state ---
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const [searchUser, setSearchUser] = useState<string>('')

  /*   const {
    items: employees,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'employees',
    { searchTerm: searchUser },
    fetchEmployees,
    {
      revalidateOnFocus: false,
    },
  ) */

  const formatDate = (date: Date): string => date.toISOString().split('T')[0]

  const today = useMemo(() => formatDate(new Date()), [])

  const [selectedDate, setSelectedDate] = useState<string>(today)

  const [year, month] = useMemo(() => {
    const [y, m] = selectedDate.split('-').map(Number)
    return [y, m]
  }, [selectedDate])
  const {
    items: employees,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'attendance/monthly-summary',
    { searchTerm: searchUser, month, year },

    fetchEmployee,
    {
      revalidateOnFocus: false,
    },
  )

  console.log(employees)

  const openModalForDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
  }
  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) =>
    openModalForDate(e.target.value)

  const remainingCount = totalItems - employees.length

  // --- Handlers ---

  const {
    handleDelete,
    handleDeleteBulk,
    handleSubmit,
    handleEdit,
    handleInfor,
  } = useUserActions({
    isModalOpen,
    setModalOpen,
    setSelectedUser,
    employees,
    router,
    mutate,
  })

  // --- Table & actions config ---

  const columns = useMemo(() => {
    if (isLoading) {
      return [] // chờ loading xong mới tạo columns
    }
    return getEmployeeColumns(handleEdit, handleDelete, handleInfor)
  }, [handleEdit, handleDelete, handleInfor, isLoading])

  const actions = [
    {
      label: '+ Thêm',
      onClick: () => {
        setSelectedUser(null)
        setModalOpen(true)
      },
    },
  ]

  // Determine initial data for the form when in edit mode.
  const initialFormData = selectedUser
    ? mapEmployeeToRegisterForm(selectedUser)
    : undefined

  console.log(selectedUser)
  return (
    <div className='flex flex-1 p-5 flex-col'>
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

      <DataTable
        data={employees}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        inputChange={searchUser}
        setInputChange={setSearchUser}
        remainingCount={remainingCount}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        isLoading={isLoading}
      />
      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedUser ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm<IRegisterForm>
            initialData={initialFormData}
            fields={selectedUser ? userFormEditFields : userFormFields}
            onSubmitApi={values => handleSubmit(values, selectedUser)}
            onSuccess={async () => {
              setModalOpen(false)
              await mutate()
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default EmployeeClient
