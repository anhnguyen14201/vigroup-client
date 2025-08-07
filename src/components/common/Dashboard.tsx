'use client'
import {
  AiOutlineDollarCircle,
  AiOutlineShoppingCart,
  AiOutlineBoxPlot,
} from 'react-icons/ai'
import { apiDeleteOrder, apiGetOrderStatisticsByDay } from '@/api'
import DataTable from '@/components/common/DataTable'
import { getOrderColumns } from '@/constants'
import { usePaginatedDatas } from '@/hooks'
import { fetchPrivateOrdersPage } from '@/hooks/fetchers'
import { setLoading } from '@/redux'
import { AppDispatch } from '@/redux/redux'
import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const Dashboard = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [dataDay, setDataDay] = useState<any>([])

  useEffect(() => {
    const fetchStatistics = async () => {
      const resDay = await apiGetOrderStatisticsByDay()
      setDataDay(resDay.data.orderDatas)
    }
    fetchStatistics()
  }, [])

  const sortedDay = Array.isArray(dataDay)
    ? [...dataDay].sort((a, b) => {
        const aMs = new Date(a._id.year, a._id.month - 1, a._id.day).getTime()
        const bMs = new Date(b._id.year, b._id.month - 1, b._id.day).getTime()
        return bMs - aMs
      })
    : []

  const latest = sortedDay[sortedDay.length - 1] || {}
  const prev = sortedDay[sortedDay.length - 2] || {}

  const metrics = useMemo(() => {
    return {
      totalSales: latest.totalSales || 0,
      prevSales: prev.totalSales || 0,
      totalOrders: latest.totalOrders || 0,
      prevOrders: prev.totalOrders || 0,
      products: latest.totalProducts || 0,
      prevProducts: prev.totalProducts || 0,
    }
  }, [latest, prev])

  const {
    items: orders,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas('order', {}, fetchPrivateOrdersPage, {
    revalidateOnFocus: false,
  })

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

  const handleInfor = (i: any) => {
    nProgress.start()
    router.push(`/admin/orders/${i._id}`)
    nProgress.done()
  }

  const columns = useMemo(() => {
    if (isLoading) {
      return [] // chờ loading xong mới tạo columns
    }
    return getOrderColumns(handleDelete, handleInfor)
  }, [handleDelete, handleInfor, isLoading])

  return (
    <div className='flex flex-1 mt-10'>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        {/* Overview Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              title: 'Doanh thu hôm nay',
              value: metrics.prevSales,
              diff: metrics.prevSales - metrics.totalSales,
              icon: <AiOutlineDollarCircle size={32} />,
            },
            {
              title: 'Đơn hàng',
              value: metrics.prevOrders,
              diff: metrics.prevOrders - metrics.totalOrders,
              icon: <AiOutlineShoppingCart size={32} />,
            },
            {
              title: 'Sản phẩm bán',
              value: metrics.prevProducts,
              diff: metrics.prevProducts - metrics.products,
              icon: <AiOutlineBoxPlot size={32} />,
            },
          ].map((card, idx) => (
            <Card key={idx} className='rounded-2xl'>
              <CardHeader className='flex items-center justify-between'>
                <CardTitle className='text-lg font-medium'>
                  {card.title}
                </CardTitle>
                <div className='text-blue-500'>{card.icon}</div>
              </CardHeader>
              <CardContent className='space-y-2'>
                <p className='text-3xl font-bold'>{card.value}</p>
                <p
                  className={`text-sm font-medium ${
                    card.diff >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {card.diff >= 0 ? '↑' : '↓'} {Math.abs(card.diff)} so với hôm
                  qua
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
          <DataTable
            data={orders}
            columns={columns}
            onDeleteSelected={handleDeleteBulk}
            remainingCount={remainingCount}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
