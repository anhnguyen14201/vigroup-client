'use client'

import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { usePaginatedDatas, useProjectById } from '@/hooks'
import { ModalToggle } from '@/components/modal'
import { getCustomerToAddProjectColumns } from '@/constants'
import useCustomerInfoCardActions from '@/hooks/useCustomerInfoCardActions'
import { formatPhone } from '@/utils'
import DataTable from '@/components/common/DataTable'
import { fetchCustomers } from '@/hooks/fetchers'

interface CustomerInfoCardProps {
  customerType: string
  handleAddCustomer: () => void
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
  modalType: string
  projectId: string
}

const CustomerInfoCard = ({
  customerType,
  handleAddCustomer,
  isModalOpen,
  setModalOpen,
  modalType,
  projectId,
}: CustomerInfoCardProps) => {
  const [searchUser, setSearchUser] = useState<string>('')
  const { data: projectData, mutate } = useProjectById(projectId)

  const { customerUser } = projectData || {}

  const {
    items: userDatas,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
  } = usePaginatedDatas('users', { searchTerm: searchUser }, fetchCustomers, {
    revalidateOnFocus: false,
  })

  const remainingCount = totalItems - userDatas.length

  const { handleAdd, onDeleteCustomer } = useCustomerInfoCardActions({
    setModalOpen,
    projectId,
    mutate,
  })

  const columns = getCustomerToAddProjectColumns(handleAdd)

  return (
    <div className='customer-info relative flex-1 p-6 border rounded-lg bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Thông tin Khách hàng</h2>
        <button
          type='button'
          aria-label='Play video'
          onClick={handleAddCustomer}
          className='px-2 py-1 cursor-pointer bg-blue-100 text-blue-700 border border-blue-600 
                    rounded-lg hover:bg-blue-300 transition duration-200'
        >
          + Thêm
        </button>
      </div>
      <div className='space-y-1'>
        {customerUser && customerUser.length > 0 ? (
          customerUser.map((customer: any) => (
            <div
              key={customer._id}
              className='px-4 py-2 border rounded-lg bg-gray-50 flex justify-between space-y-1'
            >
              <div className='flex justify-between w-full items-center'>
                <div>
                  <strong>Tên:</strong> {customer.fullName}
                </div>
                <div>
                  <strong>Tel:</strong> {formatPhone(customer.phone)}
                </div>
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                <button
                  type='button'
                  aria-label='Play video'
                  onClick={() => onDeleteCustomer?.(customer._id)}
                  className='px-2 py-2 rounded-full text-red-600 cursor-pointer hover:bg-red-200 transition duration-200'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có khách hàng nào.</p>
        )}
      </div>

      <ModalToggle
        isOpen={isModalOpen && modalType === customerType}
        onClose={() => setModalOpen(false)}
        title='Thêm người dùng'
      >
        <div onClick={e => e.stopPropagation()}>
          {modalType === customerType && (
            <DataTable
              data={userDatas}
              columns={columns}
              inputChange={searchUser}
              setInputChange={setSearchUser}
              remainingCount={remainingCount}
              loadMore={loadMore}
              isLoadingMore={isLoadingMore}
              isLoading={isLoading}
            />
          )}
        </div>
      </ModalToggle>
    </div>
  )
}

export default CustomerInfoCard
