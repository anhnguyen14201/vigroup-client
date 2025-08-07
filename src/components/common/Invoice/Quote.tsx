'use client'
import React, { useMemo, useState } from 'react'

import DataTable from '@/components/common/DataTable'
import { GenericForm } from '@/components/common/Forms'
import { ModalToggle } from '@/components/modal'
import {
  getCustomerToAddProjectColumns,
  getInstallationToAddColumns,
  getInvoiceColumns,
  getProductToAddColumns,
} from '@/constants'
import {
  useInforCompany,
  useInstallations,
  useInvoiceActions,
  useLanguage,
  useLogos,
  usePaginatedDatas,
  usePrivateInfor,
} from '@/hooks'
import QuotePreview from '@/components/common/Invoice/QuotePreview'
import { fetchProductsPrivatePage } from '@/hooks/fetchers/useProductsPrivateFetcher'
import { fetchCustomers, fetchInvoices } from '@/hooks/fetchers'
import { UseLanguageResult } from '@/interface'

type ModalType = 'installation' | 'fuel' | 'customer' | 'product'

const Quote = () => {
  const { items: languages } = useLanguage() as UseLanguageResult
  const { items: installations } = useInstallations()

  const [searchTermProducts, setSearchTermProducts] = useState<string>('')
  const [searchUser, setSearchUser] = useState<string>('')
  const [searchInvoices, setSearchInvoices] = useState<string>('')

  const {
    items: products,
    isLoadingMore: isLoadingMoreProdcuts,
    loadMore: loadMoreProdcuts,
    isLoading: isLoadingProdcuts,
    totalItems: totalProducts,
  } = usePaginatedDatas(
    'productsPrivate',
    {
      searchTerm: searchTermProducts,
    },
    fetchProductsPrivatePage,
    { revalidateOnFocus: false },
  )

  const {
    items: userDatas,
    isLoading: isLoadingUser,
    isLoadingMore: isLoadingMoreUser,
    loadMore: loadMoreUser,
    totalItems: totalUsers,
  } = usePaginatedDatas('users', { searchTerm: searchUser }, fetchCustomers, {
    revalidateOnFocus: false,
  })

  const {
    items: invoiceDatas,
    isLoading: isLoadingInvoices,
    isLoadingMore: isLoadingMoreInvoices,
    loadMore: loadMoreInvoices,
    totalItems: totalInvoices,
    mutate,
  } = usePaginatedDatas(
    'invoices',
    { searchTerm: searchInvoices },
    fetchInvoices,
    {
      revalidateOnFocus: false,
    },
  )

  const remainingCountProd = totalProducts - products.length
  const remainingCountCus = totalUsers - userDatas.length
  const remainingCountInvs = totalInvoices - invoiceDatas.length

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('product')
  const [addedProducts, setAddedProducts] = useState<any[]>([])
  const [addedCustomers, setAddedCustomers] = useState<any[]>([])
  const [addedInstallations, setAddedInstallations] = useState<any[]>([])
  const [addedFuels, setAddedFuels] = useState<any[]>([])
  const [isEditMode, setEditMode] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingInvoiceCash, setLoadingInvoiceCash] = useState(false)
  const [loadingInvoiceBank, setLoadingInvoiceBank] = useState(false)
  const [isAnyLoading, setAnyLoading] = useState(false)

  const { items: logos } = useLogos()
  const { items: inforCompany } = useInforCompany()
  const { items: infor } = usePrivateInfor()

  const filterLogo = logos?.filter((slide: any) => slide?.activity)
  const filterInforPhone = infor?.filter(
    (slide: any) => slide?.inforType === 'phone',
  )
  const filterInforAddress = infor?.filter(
    (slide: any) => slide?.inforType === 'address',
  )

  type InforCompanyType = { _id: string; isActive: boolean; [key: string]: any }
  const filterInforCompany = (inforCompany as InforCompanyType[])?.filter(
    (info: InforCompanyType) => info.isActive,
  )
  const logoDark = filterLogo?.find((lg: any) => lg?.logoType === 'logoBlack')

  const totalPrice = useMemo(() => {
    // Tổng của sản phẩm
    const prodTotal = addedProducts.reduce((sum, prod) => {
      const price =
        prod.discount != null
          ? prod.discount
          : prod.unitPrice || prod.price || 0
      return sum + price * (prod.quantity || 1)
    }, 0)

    // Tổng của công lắp đặt
    const insTotal = addedInstallations.reduce((sum, ins) => {
      // đảm bảo ins.cost là number
      const cost = Number(ins.cost) || 0
      return sum + cost * (ins.quantity || 1)
    }, 0)

    const fuelTotal = addedFuels.reduce((sum, f) => {
      const cost = Number(f.cost) || 0
      return sum + cost * (f.stage || 1)
    }, 0)

    return prodTotal + insTotal + fuelTotal
  }, [addedProducts, addedInstallations, addedFuels])

  const pdfData = useMemo(
    () => ({
      infor: infor,
      logoUrl: logoDark?.imageUrls[0],
      supplier: filterInforCompany[0]?._id,
      customer: addedCustomers[0]?._id || null,
      installations: addedInstallations.map(ins => ({
        install: ins._id,
        quantity: ins.quantity,
      })),
      fuels: addedFuels.map(f => ({
        distance: f.stage,
        unitCost: Number(f.cost) || 0,
        total: (Number(f.cost) || 0) * (f.stage || 1),
        tax: Number(f.tax) || 0,
      })),
      products: addedProducts.map(prod => ({
        product: prod._id,
        quantity: prod.quantity,
      })),
    }),
    [
      infor,
      logoDark,
      filterInforCompany,
      addedCustomers,
      addedInstallations,
      addedFuels,
      addedProducts,
    ],
  )

  const openModal = (type: ModalType) => {
    setModalType(type)
    setModalOpen(true)
  }

  const fields = [
    {
      name: 'stage',
      type: 'number',
      label: 'Quãng đường',
      placeholder: 'Nhập quãng đường',
      required: true,
    },

    {
      name: 'cost',
      type: 'number',
      label: 'Đơn giá (Kč)',
      placeholder: 'Nhập đơn giá',
      required: true,
    },
    {
      name: 'tax',
      type: 'number',
      label: 'Thuế',
      placeholder: 'Nhập thuế',
      defaultValue: 21,
      required: true,
    },
  ] as const

  const resetAll = () => {
    setAddedProducts([])
    setAddedInstallations([])
    setAddedFuels([])
    setAddedCustomers([])
  }

  const {
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
  } = useInvoiceActions({
    isModalOpen,
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
  })

  const columns = getInvoiceColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onShow: handleShow,
  })

  const installationColumns = getInstallationToAddColumns(handleAddInstallation)

  const productColumns = useMemo(() => {
    if (isLoadingProdcuts) {
      return [] // chờ loading xong mới tạo columns
    }
    return getProductToAddColumns({ currentLang, onAdd: handleAddProducts })
  }, [
    currentLang,
    handleEdit,
    handleDelete,
    isLoadingProdcuts,
    handleAddProducts,
  ])

  const customerColumns = useMemo(() => {
    if (isLoadingUser) {
      return [] // chờ loading xong mới tạo columns
    }
    return getCustomerToAddProjectColumns(handleAddCustomers)
  }, [currentLang, handleEdit, handleDelete, isLoadingUser, handleAddCustomers])

  return (
    <div className='w-full mx-auto flex flex-col gap-6 bg-white'>
      <div className='flex items-center space-x-2'>
        <h2 className='text-xl font-semibold'>Báo giá</h2>
        <div className='flex items-center space-x-2'>
          {/* Thêm mục */}
          {['installation', 'fuel', 'customer', 'product'].map(type => (
            <button
              key={type}
              onClick={() => openModal(type as ModalType)}
              disabled={isAnyLoading}
              className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${
                isAnyLoading
                  ? 'bg-gray-200 cursor-not-allowed text-gray-500 pointer-events-none'
                  : (
                      {
                        installation:
                          'bg-blue-100 hover:bg-blue-200 border border-blue-600 text-blue-600',
                        fuel: 'bg-orange-100 hover:bg-orange-200 border border-orange-600 text-orange-600',
                        customer:
                          'bg-indigo-100 hover:bg-indigo-200 border border-indigo-600 text-indigo-600',
                        product:
                          'bg-teal-100 hover:bg-teal-200 border border-teal-600 text-teal-600',
                      } as Record<string, string>
                    )[type]
              }`}
            >
              {type === 'installation'
                ? '+ Công lắp đặt'
                : type === 'fuel'
                ? '+ Xăng xe'
                : type === 'customer'
                ? '+ Khách hàng'
                : '+ Sản phẩm'}
            </button>
          ))}

          {/* Lưu PDF chỉ nếu không phải đang edit (3 nút khác hiện) */}
          <button
            onClick={handleSavePdf}
            disabled={isEditMode || isAnyLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              isEditMode || isAnyLoading
                ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                : 'bg-green-100 hover:bg-green-200 border border-green-600 text-green-600 cursor-pointer transition duration-300'
            }`}
          >
            {loadingPdf ? 'Đang lưu PDF...' : 'Lưu PDF'}
          </button>

          {/* Các nút hành động (save quote / invoices) */}
          {isEditMode && (
            <>
              <button
                onClick={handleSaveQuote}
                disabled={isAnyLoading}
                /*                 className='px-4 py-2 text-sm font-medium rounded-lg text-green-600 bg-green-100 
                        hover:bg-green-200 cursor-pointer border border-green-600 transition duration-300' */
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isAnyLoading
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'hover:bg-green-200 bg-green-100 text-green-600 cursor-pointer border border-green-600 transition duration-300'
                }`}
              >
                {loadingQuote ? 'Đang lưu báo giá...' : 'Lưu báo giá'}
              </button>
              <button
                onClick={handleSaveInvoiceCash}
                disabled={isAnyLoading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isAnyLoading
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'hover:bg-blue-200 cursor-pointer text-blue-600 bg-blue-100  border border-blue-600 transition duration-300'
                }`}
                /*          className='px-4 py-2 text-sm font-medium rounded-lg text-blue-600 bg-blue-100 
                        hover:bg-blue-200 cursor-pointer border border-blue-600 transition duration-300' */
              >
                {loadingInvoiceCash
                  ? 'Đang lưu hóa đơn tiền mặt...'
                  : 'Hóa đơn tiền mặt'}
              </button>
              <button
                onClick={handleSaveInvoiceBank}
                disabled={isAnyLoading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isAnyLoading
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                    : 'hover:bg-purple-200 cursor-pointer border text-purple-600  bg-purple-100 border-purple-600 transition duration-300'
                }`}
                /*                 className='px-4 py-2 text-sm font-medium rounded-lg text-purple-600  bg-purple-100 
                        hover:bg-purple-200 cursor-pointer border border-purple-600 transition duration-300' */
              >
                {loadingInvoiceBank
                  ? 'Đang lưu hóa đơn chuyển khoản...'
                  : 'Hóa đơn chuyển khoản'}
              </button>

              {/* Nút Hủy để bỏ edit */}
              {isEditMode && (
                <button
                  onClick={() => {
                    setEditMode(false)
                    resetAll()
                  }}
                  disabled={isAnyLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isAnyLoading
                      ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                      : 'hover:bg-red-200 cursor-pointer border text-red-600 bg-red-100 border-red-600 transition duration-300'
                  }`}
                  /*                   className='px-4 py-2 text-sm font-medium rounded-lg text-red-600 bg-red-100 
                          hover:bg-red-200 cursor-pointer border border-red-600 transition duration-300' */
                >
                  Hủy
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className='grid gap-5'>
        <QuotePreview
          logoDark={logoDark ?? { imageUrls: [] }}
          filterInforCompany={filterInforCompany}
          filterInforAddress={filterInforAddress}
          filterInforPhone={filterInforPhone}
          addedCustomers={addedCustomers}
          addedInstallations={addedInstallations}
          addedProducts={addedProducts}
          addedFuels={addedFuels}
          currentLang={currentLang}
          totalPrice={totalPrice}
          setAddedProducts={setAddedProducts}
          setAddedInstallations={setAddedInstallations}
          setAddedFuels={setAddedFuels}
        />

        <div className='flex flex-1 px-5 border rounded-lg'>
          <DataTable
            isLoading={isLoadingInvoices}
            data={invoiceDatas}
            columns={columns}
            onDeleteSelected={handleDeleteBulk}
            inputChange={searchInvoices}
            setInputChange={setSearchInvoices}
            showTitle=''
            remainingCount={remainingCountInvs}
            loadMore={loadMoreInvoices}
            isLoadingMore={isLoadingMoreInvoices}
          />
        </div>
      </div>

      {/* Modal for adding products */}
      <ModalToggle
        heightStyle={
          modalType === 'fuel' || modalType === 'installation'
            ? 'max-h-[90vh]'
            : 'h-[90vh]'
        }
        isOpen={isModalOpen}
        onClose={() => {
          // 1. Đóng modal
          setModalOpen(false)
        }}
        title={
          modalType === 'installation'
            ? 'Công lắp dặt'
            : modalType === 'fuel'
            ? 'Xăng xe'
            : modalType === 'customer'
            ? 'Thêm khách hàng'
            : 'Thêm sản phẩm'
        }
      >
        <div onClick={e => e.stopPropagation()}>
          {modalType === 'product' && (
            <>
              <DataTable
                isLoading={isLoadingProdcuts}
                columns={productColumns}
                data={products}
                onDeleteSelected={handleDeleteBulk}
                inputChange={searchTermProducts}
                setInputChange={setSearchTermProducts}
                showTitle=''
                languages={languages}
                setCurrentLang={setCurrentLang}
                currentLang={currentLang}
                remainingCount={remainingCountProd}
                loadMore={loadMoreProdcuts}
                isLoadingMore={isLoadingMoreProdcuts}
              />
            </>
          )}
          {modalType === 'installation' && (
            <DataTable
              data={installations}
              columns={installationColumns}
              showPagination={false}
              showSearch={false}
            />
          )}
          {modalType === 'fuel' && (
            <GenericForm<any>
              fields={fields as any}
              onSubmitApi={handleAddFuel}
            />
          )}
          {modalType === 'customer' && (
            <DataTable
              data={userDatas}
              columns={customerColumns}
              onDeleteSelected={handleDeleteBulk}
              inputChange={searchUser}
              setInputChange={setSearchUser}
              remainingCount={remainingCountCus}
              loadMore={loadMoreUser}
              isLoadingMore={isLoadingMoreUser}
              isLoading={isLoadingUser}
            />
          )}
        </div>
      </ModalToggle>
    </div>
  )
}

export default Quote
