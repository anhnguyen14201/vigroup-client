import { formatPhone } from '@/utils'
import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'
import countryList from 'react-select-country-list'

type QuotePreviewProps = {
  logoDark: { imageUrls: string[] }
  filterInforCompany: any[]
  filterInforAddress: any[]
  filterInforPhone: any[]
  addedCustomers: any[]
  addedInstallations: any[]
  addedProducts: any[]
  addedFuels: any[]
  currentLang: string
  totalPrice: number
  setAddedProducts: React.Dispatch<React.SetStateAction<any[]>>
  setAddedInstallations: React.Dispatch<React.SetStateAction<any[]>>
  setAddedFuels: React.Dispatch<React.SetStateAction<any[]>>
}

const QuotePreview = ({
  logoDark,
  filterInforCompany,
  filterInforAddress,
  filterInforPhone,
  addedCustomers,
  addedInstallations,
  addedProducts,
  addedFuels,
  currentLang,
  totalPrice,
  setAddedProducts,
  setAddedInstallations,
  setAddedFuels,
}: QuotePreviewProps) => {
  const handleRemove = (productId: string) => {
    setAddedProducts((prev: any) =>
      prev.filter((p: any) => p._id !== productId),
    )
    toast.success('Đã xoá sản phẩm')
  }
  const handleRemoveInstallation = (insId: string) => {
    setAddedInstallations((prev: any) =>
      prev.filter((p: any) => p._id !== insId),
    )
    toast.success('Đã xoá công lắp đặt')
  }
  const handleRemoveFuel = (id: string) => {
    setAddedFuels((prev: any) => prev.filter((f: any) => f._id !== id))
    toast.success('Đã xoá xăng xe')
  }

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setAddedProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, quantity: Math.max(0, quantity) } : p,
      ),
    )
  }

  const handleInstallationQuantityChange = (
    insId: string,
    quantity: number,
  ) => {
    setAddedInstallations(prev =>
      prev.map(i =>
        i._id === insId ? { ...i, quantity: Math.max(0, quantity) } : i,
      ),
    )
  }

  const handleFuelStageChange = (fuelId: string, stage: number) => {
    setAddedFuels(prev =>
      prev.map(f =>
        f._id === fuelId ? { ...f, stage: Math.max(0, stage) } : f,
      ),
    )
  }

  const countryOptions = countryList().getData()

  const code = addedCustomers[0]?.country as string
  const option = countryOptions.find(opt => opt.value === code)
  // nếu không tìm thấy thì fallback về code
  const name = option?.label || code
  return (
    <div className='w-full bg-white p-5 border rounded-lg'>
      <div className='flex justify-between items-start border-b pb-4 mb-4'>
        <Image
          src={logoDark?.imageUrls[0] ?? '/fallback-logo.png'}
          alt='Logo'
          width={150} // ví dụ: 40px tương đương className='h-10'
          height={40}
          className='object-contain'
          priority
        />{' '}
        <div className='text-right'>
          <h2 className='font-bold text-lg'>
            Bảng báo giá thi công và lắp đặt
          </h2>
          <p className='uppercase text-base text-gray-600'>
            {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Supplier Info */}
      <div className='gap-8 grid grid-cols-2 mb-6'>
        <div>
          <h3 className='font-bold text-gray-600 border-b border-red-600 w-fit mb-2'>
            Nhà cung cấp
          </h3>
          <div>
            <p className='font-semibold'>
              {filterInforCompany[0]?.companyName}
            </p>
            <p className=''>{filterInforAddress[0]?.desc}</p>
            <p>
              IČO: <strong>{filterInforCompany[0]?.ico}</strong>
            </p>
            <p>
              DIČ: <strong>{filterInforCompany[0]?.dic}</strong>
            </p>
            <p className=''>
              {formatPhone(filterInforPhone[1]?.desc)} <br />
              {formatPhone(filterInforPhone[2]?.desc)}
            </p>
            <p className='text-blue-500'>https://www.vigroup.cz</p>
          </div>
        </div>
        <div>
          <h3 className='font-bold text-gray-600 border-b border-red-600 w-fit mb-2'>
            Khách hàng
          </h3>
          <div>
            <p className='font-semibold'>
              {addedCustomers[0]?.companyName
                ? addedCustomers[0]?.companyName
                : addedCustomers[0]?.fullName}
            </p>
            <p className=''>{`${addedCustomers[0]?.street} 
            ${addedCustomers[0]?.postalCode} 
            ${addedCustomers[0]?.province} 
             ${name}`}</p>
            <p>
              IČO: <strong>{addedCustomers[0]?.ico || ''}</strong>
            </p>
            <p>
              DIČ: <strong>{addedCustomers[0]?.dic || ''}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <table className='w-full text-xs mb-6'>
        <thead className='border-t border-b bg-gray-100'>
          <tr>
            <th className='p-2 text-left'>Mã sản phẩm</th>
            <th className='p-2 text-center'>Ảnh</th>
            <th className='p-2 text-left'>Tên sản phẩm</th>
            <th className='p-2 text-center'>Số lượng</th>
            <th className='p-2 text-right'>Đơn giá</th>
            <th className='p-2 text-right'>Thành tiền</th>
            <th className='p-2 text-center'>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Nếu cả hai đều rỗng */}
          {addedInstallations.length +
            addedProducts.length +
            addedFuels.length ===
          0 ? (
            <tr>
              <td colSpan={7} className='p-4 text-center text-gray-500'>
                Chưa có mục nào
              </td>
            </tr>
          ) : (
            addedProducts
              .map(
                // 2. Sau đó map Sản phẩm
                (prod: any) => {
                  const name =
                    prod?.translations?.find(
                      (t: any) => t.language.code === currentLang,
                    )?.productName || prod.code
                  const imgUrl =
                    prod?.thumbnailUrls?.[0] || prod.imageUrls?.[0] || ''
                  const price = prod.discount
                    ? prod?.discount
                    : prod?.price || 0

                  return (
                    <tr
                      key={`prod-${prod._id}`}
                      className='border-b bg-green-50'
                    >
                      <td className='p-2'>{prod.code}</td>
                      <td className='p-2 flex justify-center'>
                        {imgUrl ? (
                          <Image
                            src={imgUrl || '/fallback.png'} // fallback cho trường hợp undefined
                            alt={name}
                            width='0'
                            height='0'
                            sizes='100vw'
                            className='w-auto h-10'
                            priority
                          />
                        ) : (
                          <div className='h-8 bg-gray-200 rounded' />
                        )}
                      </td>
                      <td className='p-2 text-left'>{name}</td>
                      <td className='p-2 text-center'>
                        <input
                          type='number'
                          min={0}
                          value={prod.quantity}
                          onChange={e =>
                            handleProductQuantityChange(
                              prod._id,
                              Number(e.target.value),
                            )
                          }
                          className='w-16 text-center border rounded'
                        />
                      </td>
                      <td className='p-2 text-right'>
                        {price.toLocaleString('cs-CZ', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        Kč
                      </td>
                      <td className='p-2 text-right'>
                        {(price * prod.quantity).toLocaleString('cs-CZ', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        Kč
                      </td>
                      <td className='p-2 text-center'>
                        <button
                          onClick={() => handleRemove(prod._id)}
                          className='px-2 py-1 text-xs text-red-600 rounded-full cursor-pointer hover:bg-red-100'
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  )
                },
              )
              .concat(
                // 1. Map Công lắp đặt trước
                addedInstallations.map(
                  // 2. Sau đó map Sản phẩm
                  (ins: any) => {
                    const name =
                      ins?.translations?.find(
                        (t: any) => t?.language?.code === currentLang,
                      )?.desc || ins?.code
                    const imgUrl =
                      ins.thumbnailUrls?.[0] || ins.imageUrls?.[0] || ''
                    const costNumber = Number(ins.cost)
                    const totalCost = costNumber * (ins.quantity || 1)
                    return (
                      <tr
                        key={`ins-${ins._id}`}
                        className='border-b bg-green-50'
                      >
                        <td className='p-2'>Công lắp đặt</td>
                        <td className='p-2 flex justify-center'>
                          {imgUrl ? (
                            <Image
                              src={imgUrl || '/fallback.png'} // fallback cho trường hợp undefined
                              alt={name}
                              width={32} // tương đương .h-8 (8 * 4px = 32px)
                              height={32}
                              className='object-contain rounded'
                              priority
                            />
                          ) : (
                            <div className='h-8 bg-gray-200 rounded' />
                          )}
                        </td>
                        <td className='p-2 text-left'>{name}</td>
                        <td className='p-2 text-center'>
                          <input
                            type='number'
                            min={0}
                            value={ins.quantity}
                            onChange={e =>
                              handleInstallationQuantityChange(
                                ins._id,
                                Number(e.target.value),
                              )
                            }
                            className='w-16 text-center border rounded'
                          />
                        </td>
                        <td className='p-2 text-right'>
                          {costNumber.toLocaleString('cs-CZ', {
                            minimumFractionDigits: 2,
                          })}{' '}
                          Kč
                        </td>
                        <td className='p-2 text-right'>
                          {totalCost.toLocaleString('cs-CZ', {
                            minimumFractionDigits: 2,
                          })}{' '}
                          Kč
                        </td>
                        <td className='p-2 text-center'>
                          <button
                            onClick={() => handleRemoveInstallation(ins._id)}
                            className='px-2 py-1 text-xs text-red-600 rounded-full cursor-pointer hover:bg-red-100'
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    )
                  },
                ),
              )

              .concat(
                // fuel rows
                addedFuels.map((f: any, idx: any) => {
                  const total = (Number(f.cost) || 0) * (f.stage || 1)
                  return (
                    <tr key={`fuel-${idx}`} className='border-b bg-yellow-50'>
                      <td className='p-2'>Xăng xe</td>
                      <td className='p-2 text-center'>—</td>
                      <td className='p-2 text-left'>Xăng xe</td>
                      <td className='p-2 text-center'>
                        <input
                          type='number'
                          min={0}
                          value={f.stage}
                          onChange={e =>
                            handleFuelStageChange(f._id, Number(e.target.value))
                          }
                          className='w-16 text-center border rounded'
                        />
                      </td>
                      <td className='p-2 text-right'>
                        {Number(f.cost).toLocaleString('cs-CZ', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        Kč
                      </td>
                      <td className='p-2 text-right'>
                        {total.toLocaleString('cs-CZ', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        Kč
                      </td>
                      <td className='p-2 text-center'>
                        <button
                          onClick={() => handleRemoveFuel(f._id)}
                          className='px-2 py-1 text-xs text-red-600 cursor-pointer rounded-full hover:bg-red-100'
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  )
                }),
              )
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className='flex justify-end pt-2'>
        <div className='text-lg font-bold text-red-600'>
          Celkem:{' '}
          {totalPrice.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč
        </div>
      </div>
    </div>
  )
}

export default QuotePreview
