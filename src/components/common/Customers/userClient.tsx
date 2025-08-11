'use client'

import { useMemo, useState } from 'react'

import type { IRegisterForm, IUser } from '@/interface'

import DataTable from '@/components/common/DataTable'
import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import { usePaginatedDatas, useUserActions } from '@/hooks'
import {
  customerFormEditFields,
  customerFormFields,
  getUserColumns,
} from '@/constants'
import { mapUserToRegisterForm } from '@/utils'
import { fetchCustomers } from '@/hooks/fetchers'

const UserClient: React.FC = () => {
  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [searchUser, setSearchUser] = useState<string>('')

  const {
    items: userDatas,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas('users', { searchTerm: searchUser }, fetchCustomers, {
    revalidateOnFocus: false,
  })

  const remainingCount = totalItems - userDatas.length

  const { handleDelete, handleDeleteBulk, handleSubmit, handleEdit } =
    useUserActions({
      isModalOpen,
      setModalOpen,
      setSelectedUser,
      userDatas,
      mutate,
    })

  // Table & actions configuration

  const columns = useMemo(() => {
    if (isLoading) {
      return [] // chờ loading xong mới tạo columns
    }
    return getUserColumns(handleEdit, handleDelete)
  }, [handleEdit, handleDelete, isLoading])

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
    ? mapUserToRegisterForm(selectedUser)
    : undefined
  return (
    <div className='flex flex-1 p-5'>
      <DataTable
        data={userDatas}
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
        title={selectedUser ? 'Sửa người dùng' : 'Thêm người dùng'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm<IRegisterForm>
            initialData={initialFormData}
            fields={selectedUser ? customerFormEditFields : customerFormFields}
            onSubmitApi={values => handleSubmit(values, selectedUser)}
            onSuccess={async () => {
              await mutate()
              setModalOpen(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default UserClient
