'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, {
  ReactElement,
  useMemo,
  useState,
  FormEvent,
  useEffect,
} from 'react'

import 'react-phone-input-2/lib/style.css'

import { routing } from '@/i18n'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'
import 'react-phone-input-2/lib/style.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import { useGetContentTranslation, useProductsByIds } from '@/hooks'
import { formatCurrency } from '@/utils'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Locale } from '@/interface'
import { apiCreateOrder } from '@/api'
import toast from 'react-hot-toast'
import { clearCart } from '@/redux'
import nProgress from 'nprogress'
import { useDispatch } from 'react-redux'

// Types
interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  /* country: string */
  street: string
  province: string
  postalCode: string
}

interface CompanyInfo {
  companyName: string
  ico: string
  dic: string
}

interface ShippingOption {
  id: string
  label: string
  cost: number
}
interface Customer {
  _id: string
}

interface ErrorMap {
  [key: string]: string
}

// Data

export default function PaymentPageClient(): ReactElement {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const t = useTranslations('cart')

  const shippingOptions: ShippingOption[] = [
    { id: 'PICKUP', label: `PICKUP (${t('free')})`, cost: 0 },
    { id: 'PPL', label: 'PPL (500 Kč)', cost: 500 },
    { id: 'GLS', label: 'GLS (500 Kč)', cost: 500 },
    { id: 'DPD', label: 'DPD (500 Kč)', cost: 500 },
    { id: 'GEIS', label: 'GEIS (500 Kč)', cost: 500 },
  ]

  const user = useSelector((state: RootState) => state?.currentUser)

  // State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    /* country: '', */
    street: '',
    province: '',
    postalCode: '',
  })
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    ico: '',
    dic: '',
  })
  const [shippingMethod, setShippingMethod] = useState<string>('PICKUP')
  const [errors, setErrors] = useState<ErrorMap>({})
  const [customer, setCustomer] = useState<Customer>()

  const cartItems = useSelector((state: RootState) => state.cart.cartItems)

  const ids = cartItems.map(item => item.productId)
  const { items: datas } = useProductsByIds(ids)

  const productWithQty = useMemo(() => {
    return datas.map((prod: any) => {
      const matched = cartItems.find(item => item.productId === prod._id)
      return {
        ...prod,
        quantity: matched ? matched.quantity : 0,
      }
    })
  }, [datas, cartItems])

  useEffect(() => {
    if (user?.token) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: user?.current.fullName || '',
        email: user?.current.email || '',
        street: user?.current.street || '',
        phone: user?.current.phone || '',
        /*         country: user?.current.country || '',
         */ province: user?.current.province || '',
        postalCode: user?.current.postalCode || '',
      }))
      setCompanyInfo({
        companyName: user?.current.companyName || '',
        ico: user?.current.ico || '',
        dic: user?.current.dic || '',
      })

      setCustomer({
        _id: user?.current._id,
      })
    }
  }, [user])

  // Country options
  /*   const countryOptions = useMemo(() => countryList().getData(), [])
   */
  // Breadcrumb
  const pathSegments = pathname.split('/').filter(Boolean)
  const isLocalePrefixed = routing.locales.includes(
    pathSegments[0] as (typeof routing.locales)[number],
  )
  const breadcrumbSegments = isLocalePrefixed
    ? pathSegments.slice(1)
    : pathSegments

  // Handlers
  const handlePersonalChange =
    <K extends keyof PersonalInfo>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value
      setPersonalInfo(prev => ({ ...prev, [field]: value }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  const handleCompanyChange =
    <K extends keyof CompanyInfo>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCompanyInfo(prev => ({ ...prev, [field]: e.target.value }))
    }

  const validate = (): boolean => {
    const errs: ErrorMap = {}
    if (!personalInfo.fullName) errs.fullName = t('Enterfullname')
    if (!personalInfo.email) errs.email = t('Enteremail')
    if (!personalInfo.phone) errs.phone = t('Enterphonenumber')
    if (!personalInfo.street) errs.street = t('Enteraddress')
    /*     if (!personalInfo.country) errs.country = t('Selectcountry')
     */ if (!personalInfo.province) errs.province = t('Enterprovincecity')
    if (!personalInfo.postalCode) errs.postalCode = t('Enterpostalcode')
    if (!shippingMethod) errs.shippingMethod = t('Selectmethod')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      // nếu customer tồn tại dùng customer, không thì dùng personalInfo
      ...customer,
      personalInfo,
      companyInfo,
      shippingMethod,
      cartItems,
    }
    nProgress.start()

    try {
      const response = await apiCreateOrder(payload)

      if (response) {
        dispatch(clearCart())
        router.push(`/cart/check-out/thanks`)
        toast.success(t('Orderplacedsuccessfully'))
      }
    } catch {
      toast.error(t('Failedtoplaceorder'))
    } finally {
      nProgress.done()
    }
  }

  // Summary
  const orderTotal = productWithQty.reduce(
    (acc, item) =>
      acc + (item.discount ? item.discount : item.price) * item.quantity,
    0,
  )

  const shippingCost =
    shippingOptions.find(o => o.id === shippingMethod)?.cost || 0
  const total = orderTotal + shippingCost

  function calculateByTaxArray(items: any[]) {
    // 1) Gom nhóm ra object
    const groupsObj = items.reduce(
      (groups, { price, quantity, tax, discount }) => {
        const key = tax // e.g. 21, 10, 5
        const amount = (discount > 0 ? discount : price) * quantity

        if (!groups[key]) {
          groups[key] = { subtotal: 0, taxAmount: 0, total: 0 }
        }

        groups[key].subtotal += amount
        // Nếu bạn muốn taxAmount là phần thuế, thì:
        const taxAmt = amount / (1 + tax / 100)
        groups[key].taxAmount += taxAmt
        groups[key].total += amount + taxAmt

        return groups
      },
      {},
    )

    // 2) Chuyển object thành array
    return Object.entries(groupsObj).map(([tax, grp]: any) => ({
      taxRate: Number(tax),
      subtotal: grp.subtotal,
      taxAmount: grp.taxAmount,
      total: grp.total,
    }))
  }

  const result = calculateByTaxArray(productWithQty)

  // Styles
  const errCls = 'text-red-600 text-sm mt-1'

  const proTransList = useMemo(() => {
    return productWithQty?.map(item => useGetContentTranslation(item, locale))
  }, [productWithQty, locale])

  return (
    <div className='mb-30'>
      <div className='bg-black h-[135px] w-full' />
      <div className='max-w-screen-xl mx-auto px-4 sm:px-6'>
        <div className='py-4 flex justify-between items-center'>
          <UIBreadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/' className='text-gray-500'>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbSegments.map((seg, idx) => {
                const href =
                  '/' + breadcrumbSegments.slice(0, idx + 1).join('/')
                const last = idx === breadcrumbSegments.length - 1
                return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator>
                      <ChevronRight className='w-5 h-5' />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>{seg}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href} className='text-gray-500'>
                          {seg}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </UIBreadcrumb>
          <button
            type='button'
            aria-label='back'
            onClick={() => router.back()}
            className='text-[#C74242] hover:underline cursor-pointer'
          >
            {t('back')}
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col xl:flex-row gap-6'
        >
          {/* Left */}
          <div className='flex-1 bg-white rounded-2xl space-y-6'>
            <div className='bg-gray-50 rounded-xl p-6 space-y-4'>
              <h3 className='text-xl font-medium'>
                {t('personalInformation')}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10'>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('fullName')}
                  </label>
                  <input
                    type='text'
                    value={personalInfo.fullName}
                    onChange={handlePersonalChange('fullName')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5 focus:ring-[#C74242] 
                        focus:outline-none text-[17px]'
                  />
                  {errors.fullName && (
                    <p className={errCls}>{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={personalInfo.email}
                    onChange={handlePersonalChange('email')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('phoneNumber')}
                  </label>
                  <input
                    value={personalInfo.phone}
                    onChange={handlePersonalChange('phone')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                  {errors.phone && <p className={errCls}>{errors.phone}</p>}
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('address')}
                  </label>
                  <input
                    type='text'
                    value={personalInfo.street}
                    onChange={handlePersonalChange('street')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                  {errors.street && <p className={errCls}>{errors.street}</p>}
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('provinceCity')}
                  </label>
                  <input
                    type='text'
                    value={personalInfo.province}
                    onChange={handlePersonalChange('province')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                  {errors.province && (
                    <p className={errCls}>{errors.province}</p>
                  )}
                </div>
                {/* <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('country')}
                  </label>
                  <Select
                    options={countryOptions}
                    value={
                      countryOptions.find(
                        o => o.value.toLowerCase() === personalInfo.country,
                      ) || null
                    }
                    onChange={(opt: OptionType | null) =>
                      handlePersonalChange('country')(opt?.value || '')
                    }
                    className='w-full mb-[15px] text-[17px]'
                    classNamePrefix='custom-select'
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        background: '#f9f6f3',
                        borderRadius: '9999px',
                        paddingLeft: '1.75rem',
                        paddingRight: '1.75rem',
                        paddingTop: '0.8rem',
                        paddingBottom: '0.8rem',
                        boxShadow: 'none',
                        borderColor: 'transparent',
                        '&:hover': {
                          borderColor: 'none',
                        },
                      }),
                      placeholder: (base: any) => ({
                        ...base,
                        margin: 0,
                      }),
                      singleValue: (base: any) => ({
                        ...base,
                        margin: 0,
                      }),
                      valueContainer: (base: any) => ({
                        ...base,
                        padding: 0,
                      }),
                      input: (base: any) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                      }),
                      menu: (base: any) => ({
                        ...base,
                        borderRadius: '0.5rem',
                      }),
                      option: (base: any, state: any) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#f9f6f3' : 'white',
                        color: 'inherit',
                      }),
                    }}
                  />
                  {errors.country && <p className={errCls}>{errors.country}</p>}
                </div> */}
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('postalCode')}
                  </label>
                  <input
                    type='text'
                    value={personalInfo.postalCode}
                    onChange={handlePersonalChange('postalCode')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                  {errors.postalCode && (
                    <p className={errCls}>{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Company */}
            <div className='bg-gray-50 rounded-xl p-6 space-y-4'>
              <h3 className='text-xl font-medium'>{t('companyInformation')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10'>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    {t('companyName')}
                  </label>
                  <input
                    type='text'
                    value={companyInfo.companyName}
                    onChange={handleCompanyChange('companyName')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    IČO
                  </label>
                  <input
                    type='text'
                    value={companyInfo.ico}
                    onChange={handleCompanyChange('ico')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    DIČ
                  </label>
                  <input
                    type='text'
                    value={companyInfo.dic}
                    onChange={handleCompanyChange('dic')}
                    className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none text-[17px]'
                  />
                </div>
              </div>
            </div>
            {/* Shipping */}
            <div className='bg-gray-50 rounded-xl p-6 space-y-4'>
              <h3 className='text-xl font-medium'>{t('deliveryMethod')}</h3>
              <div className='space-y-2'>
                {shippingOptions.map(opt => (
                  <label key={opt.id} className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      name='shipping'
                      value={opt.id}
                      checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id)}
                      className='accent-red-600'
                    />
                    <span className='text-sm font-medium text-gray-600 mb-2'>
                      {opt.label}
                    </span>
                  </label>
                ))}
                {errors.shippingMethod && (
                  <p className={errCls}>{errors.shippingMethod}</p>
                )}
              </div>
            </div>
          </div>
          {/* Right */}
          <div className='w-full xl:w-1/3 flex flex-col space-y-6'>
            <div className='bg-gray-50 rounded-2xl px-6'>
              <ul className='divide-y divide-gray-200'>
                {productWithQty?.map((item: any, idx: any) => {
                  const proTrans = proTransList[idx]

                  const totalPrice =
                    (item.discount ? item.discount : item.price) * item.quantity
                  return (
                    <div
                      key={idx}
                      className='flex flex-col md:flex-row items-center py-2 gap-6 border-b border-gray-200 last:border-b-0'
                    >
                      <Image
                        src={item.thumbnailUrls?.[0] || '/placeholder.png'}
                        alt={proTrans?.productName || ''}
                        width={50}
                        height={20}
                        className='rounded-md object-contain w-auto h-auto'
                        priority
                      />
                      <div className='flex-1'>
                        <h2 className='text-md font-semibold text-gray-800'>
                          {proTrans?.productName}
                        </h2>
                        <div className='flex gap-2'>
                          <p className='text-sm text-gray-600'>
                            {item?.quantity}
                          </p>
                          <span className='text-sm text-gray-600'> x </span>
                          <p className='text-sm text-gray-600'>
                            {formatCurrency(
                              item?.discount ? item?.discount : item?.price,
                              203,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-6'>
                        <span className='text-md font-semibold'>
                          {formatCurrency(totalPrice, 203)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </ul>
            </div>
            <div className='p-6 bg-gray-50 rounded-2xl'>
              <div className='pt-4 border-t border-gray-200 space-y-3'>
                <div className='mx-auto space-y-2 border-b pb-4'>
                  {/* Header row */}
                  <div className='flex text-gray-700 font-semibold rounded-lg py-2'>
                    <div className='flex-1'>{t('taxRate')}</div>
                    <div className='flex-1 text-right'>DPH</div>
                    <div className='flex-1 text-right'>sDPH</div>
                  </div>

                  {/* Data rows */}
                  {result.map(({ taxRate, subtotal, taxAmount }) => (
                    <div key={taxRate} className='flex'>
                      <div className='flex-1 text-sm font-medium text-gray-600 mb-2'>
                        {taxRate}%
                      </div>
                      <div className='flex-1 text-sm font-medium text-gray-600 mb-2 text-right'>
                        {formatCurrency(taxAmount, 203)}
                      </div>
                      <div className='flex-1 text-sm font-medium text-gray-600 mb-2 text-right'>
                        {formatCurrency(subtotal, 203)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm font-medium text-gray-600 mb-2'>
                    {t('subtotal')}
                  </span>
                  <span className='text-sm font-medium text-gray-600 mb-2'>
                    {formatCurrency(orderTotal, 203)}{' '}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm font-medium text-gray-600 mb-2'>
                    {t('shippingFee')}
                  </span>
                  <span className='text-sm font-medium text-gray-600 mb-2'>
                    {formatCurrency(shippingCost, 203)}
                  </span>
                </div>
                <div className='flex justify-between font-semibold text-lg'>
                  <span>{t('total')}</span>
                  <span>{formatCurrency(total, 203)}</span>
                </div>
                <div className='flex justify-end mt-10'>
                  <button
                    aria-label='payment'
                    type='submit'
                    className='md:w-1/2 w-full xl:w-full bg-[#C74242] cursor-pointer text-white px-7 py-5 rounded-full font-semibold 
                 hover:bg-white transition border hover:border-[#C74242] hover:text-[#C74242]'
                  >
                    {t('payment')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
