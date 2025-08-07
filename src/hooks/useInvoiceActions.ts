'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { apiCreateInvoice, apiCreateQuote, apiDeleteQuote } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'

export default function useInvoiceActions({
  setModalOpen,
  invoiceDatas,
  setAddedCustomers,
  setAddedProducts,
  setAddedInstallations,
  setAddedFuels,
  setEditMode,
  pdfData,
  resetAll,
  setLoadingPdf,
  setLoadingQuote,
  setLoadingInvoiceCash,
  setLoadingInvoiceBank,
  setAnyLoading,
  mutate,
}: any) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAddFuel = async (values: {
    stage: number
    cost: number
    tax: number
  }): Promise<void> => {
    // ví dụ: desc = quãng đường, url = đơn giá
    const cost = Number(values.cost) || 0
    setAddedFuels((prev: any) => [
      ...prev,
      {
        _id: Date.now().toString(),
        stage: values.stage,
        cost,
        tax: values.tax,
      },
    ])
    toast.success('Đã thêm xăng xe')
    setModalOpen(false)
  }

  const handleAddProducts = (product: any) => {
    setAddedProducts((prev: any) => {
      const existing = prev.find((p: any) => p._id === product._id)
      if (existing) {
        return prev.map((p: any) =>
          p._id === product._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success('Đã thêm sản phẩm')
  }
  const handleAddInstallation = (ins: any) => {
    setAddedInstallations((prev: any) => {
      const existing = prev.find((p: any) => p._id === ins._id)
      if (existing) {
        return prev.map((p: any) =>
          p._id === ins._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
        )
      }
      return [...prev, { ...ins, quantity: 1 }]
    })
    toast.success('Đã thêm sản phẩm')
  }

  const handleAddCustomers = (user: any) => {
    setAddedCustomers([{ ...user }])
    setModalOpen(false)
    toast.success('Đã thêm khách hàng thành công')
  }

  const handleEdit = (inv: any) => {
    setAddedCustomers([inv.customer])
    // populate form states
    setAddedProducts(
      inv.products.map((item: { product: any; quantity: number }) => ({
        ...item.product,
        quantity: item.quantity,
      })),
    )

    setAddedInstallations(
      inv.installations.map((item: { install: any; quantity: number }) => ({
        ...item.install,
        quantity: item.quantity,
      })),
    )

    setAddedFuels(
      inv.fuels.map((f: any) => ({
        _id: Math.random().toString(),
        stage: f.distance,
        cost: f.unitCost,
        tax: f.tax,
      })),
    )

    setEditMode(true)
    setModalOpen(false)
  }

  const handleShow = (inv: any) => {
    if (inv.pdfUrl) {
      // Mở PDF trong tab mới
      window.open(inv.pdfUrl, '_blank')
    } else {
      toast.error('Không tìm thấy đường dẫn PDF')
    }
  }

  // Lưu PDF (không ghi đè status)
  const handleSavePdf = async () => {
    setLoadingPdf(true)
    setAnyLoading(true)
    nProgress.start()

    try {
      const payload = { ...pdfData }
      await apiCreateQuote(payload)
      setEditMode(false)
      resetAll()
      mutate()
      toast.success('PDF đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingPdf(false)
      setAnyLoading(false)
      nProgress.done()
    }
  }

  // Lưu Quote (ghi đè status thành "quote")
  const handleSaveQuote = async () => {
    setLoadingQuote(true)
    setAnyLoading(true)
    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'quote',
      }
      await apiCreateQuote(payload)
      mutate()
      setEditMode(false)
      resetAll()
      toast.success('PDF đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingQuote(false)
      setAnyLoading(false)
      nProgress.done()
    }
  }

  // Lưu Invoice theo phương thức chuyển khoản (bank)
  const handleSaveInvoiceBank = async () => {
    setLoadingInvoiceBank(true)
    setAnyLoading(true)
    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'invoice',
        statusPayment: 'Převodem',
      }
      await apiCreateInvoice(payload)
      mutate()
      setEditMode(false)
      resetAll()
      toast.success('PDF đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingInvoiceBank(false)
      setAnyLoading(false)
      nProgress.done()
    }
  }

  // Lưu Invoice theo phương thức tiền mặt (cash)
  const handleSaveInvoiceCash = async () => {
    setLoadingInvoiceCash(true)
    setAnyLoading(true)
    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'invoice',
        statusPayment: 'Hotově',
      }
      await apiCreateInvoice(payload)
      mutate()
      setEditMode(false)
      resetAll()
      toast.success('PDF đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingInvoiceCash(false)
      setAnyLoading(false)
      nProgress.done()
    }
  }

  // Xóa một hóa đơn (quote) dựa trên inv._id
  const handleDelete = useCallback(
    async (inv: any) => {
      dispatch(setLoading({ key: 'handleDelete', value: true }))
      nProgress.start()

      try {
        await apiDeleteQuote(inv._id)
        toast.success('Xóa thành công!')

        // Nếu danh sách hóa đơn chỉ còn 1 mục và còn trang trước, giảm số trang xuống 1
        mutate()
      } catch {
        // Nếu cần, có thể mở comment thông báo lỗi bên dưới:
        // toast.error(err.response?.data?.message || err.message);
      } finally {
        dispatch(setLoading({ key: 'handleDelete', value: false }))
        nProgress.done()
      }
    },
    [dispatch, invoiceDatas],
  )

  // Xóa hàng loạt hóa đơn
  const handleDeleteBulk = useCallback(
    async (inv: any[]) => {
      if (!inv.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${inv.length} hóa đơn?`)) return

      dispatch(setLoading({ key: 'DeleteUserBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(inv.map((i: any) => apiDeleteQuote(i._id)))
        toast.success('Xóa nhóm thành công!')

        mutate()
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteUserBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch, invoiceDatas],
  )

  return {
    handleDelete,
    handleDeleteBulk,
    handleEdit,
    handleShow,
    handleAddFuel,
    handleAddProducts,
    handleAddInstallation,
    handleAddCustomers,
    handleSavePdf,
    handleSaveQuote,
    handleSaveInvoiceBank,
    handleSaveInvoiceCash,
  }
}
