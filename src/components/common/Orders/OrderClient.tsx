'use client'

import { apiDeleteOrder } from '@/api'
import DataTable from '@/components/common/DataTable'
import { getOrderColumns } from '@/constants'
import { usePaginatedDatas } from '@/hooks'
import { fetchPrivateOrdersPage } from '@/hooks/fetchers'
import { setLoading } from '@/redux'
import { AppDispatch } from '@/redux/redux'
import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'
import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const OrderClient = () => {
  const router = useRouter()
  const [searchOrders, setSearchOrders] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  const {
    items: orders,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'order',
    {
      searchTerm: searchOrders,
    },
    fetchPrivateOrdersPage,
    { revalidateOnFocus: false },
  )

  const remainingCount = totalItems - orders.length

  const handleDelete = useCallback(
    async (order: any) => {
      dispatch(setLoading({ key: 'DeleteOrder', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteOrder(order._id)
        if (!data.success) throw new Error(data.message)

        toast.success('Xóa thành công!')
        mutate()
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteOrder', value: false }))
        nProgress.done()
      }
    },
    [dispatch, mutate],
  )

  const handleDeleteBulk = useCallback(
    async (projs: any[]) => {
      if (!projs.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${projs.length} dự án?`)) return

      dispatch(setLoading({ key: 'DeleteOrdersBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(projs.map(u => apiDeleteOrder(u._id)))
        toast.success('Xóa nhóm thành công!')
        mutate()
      } catch {
        toast.error('Có lỗi xảy ra')
      } finally {
        dispatch(setLoading({ key: 'DeleteOrdersBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch, mutate],
  )

  const handleInfor = useCallback(
    (i: any) => {
      nProgress.start()
      router.push(`/admin/orders/${i._id}`)
      nProgress.done()
    },
    [router],
  )

  const columns = useMemo(() => {
    if (isLoading) {
      return [] // chờ loading xong mới tạo columns
    }
    return getOrderColumns(handleDelete, handleInfor)
  }, [handleDelete, handleInfor, isLoading])

  return (
    <div className='flex flex-1 p-5'>
      <DataTable
        data={orders}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        inputChange={searchOrders}
        setInputChange={setSearchOrders}
        remainingCount={remainingCount}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        isLoading={isLoading}
      />
    </div>
  )
}

export default OrderClient
