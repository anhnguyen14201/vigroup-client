'use client'

import React, { useEffect, useState, FormEvent, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { EyeClosed } from 'lucide-react'
import { FiEye } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Select from 'react-select'
import countryList from 'react-select-country-list'

import { persistor, RootState } from '@/redux/redux'
import { apiLogout, apiUpdateByUser } from '@/api'
import { logout, setLoading } from '@/redux'
import nProgress from 'nprogress'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const UserClient: React.FC = () => {
  const { current } = useSelector((state: RootState) => state?.currentUser)
  const router = useRouter()
  const dispatch = useDispatch()
  const t = useTranslations()
  /*   const countryOptions = useMemo(() => countryList().getData(), [])
   */
  const [form, setForm] = useState<Record<string, any>>({
    fullName: '',
    email: '',
    phone: '',
    /* country: '', */
    street: '',
    province: '',
    postalCode: '',
  })
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    dic: '',
    ico: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [changePwd, setChangePwd] = useState(false)
  const [hasCompany, setHasCompany] = useState(false)
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPwd, setShowPwd] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const fieldLabels: Record<string, string> = {
    fullName: t('account.fullname'),
    email: 'Email',
    phone: t('cart.phoneNumber'),
    companyName: t('cart.companyName'),
    dic: 'DIČ',
    ico: 'IČO',
    /* country: t('cart.country'), */
    street: t('cart.address'),
    province: t('cart.provinceCity'),
    postalCode: t('cart.postalCode'),
  }

  useEffect(() => {
    if (current) {
      setForm({
        fullName: current.fullName || '',
        email: current.email || '',
        phone: current.phone || '',
        /* country: current.country || '', */
        street: current.street || '',
        province: current.province || '',
        postalCode: current.postalCode || '',
      })
      if (current.companyName) {
        setHasCompany(true)
        setCompanyForm({
          companyName: current.companyName,
          dic: current.dic || '',
          ico: current.ico || '',
        })
      }
      nProgress.done()
      dispatch(setLoading({ key: 'Login', value: false }))
    }
  }, [current])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyForm(prev => ({ ...prev, [name]: value }))
  }

  /*   const handleCountryChange = (option: any) => {
    setForm(prev => ({ ...prev, country: option?.value || '' }))
  } */

  const toggleShow = (field: 'old' | 'new' | 'confirm') => {
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    const requiredKeys: (keyof typeof form)[] = [
      'fullName',
      'email',
      'phone',
      /* 'country', */
      'street',
      'province',
      'postalCode',
    ]
    requiredKeys.forEach(key => {
      if (!form[key]?.toString().trim())
        newErrors[key] = `${t('account.placeholder')} ${fieldLabels[key]}`
    })
    if (hasCompany) {
      const compKeys: (keyof typeof companyForm)[] = [
        'companyName',
        'dic',
        'ico',
      ]
      compKeys.forEach(key => {
        if (!companyForm[key]?.toString().trim())
          newErrors[key] = `${t('account.placeholder')} ${fieldLabels[key]}`
      })
    }

    if (changePwd) {
      const { oldPassword, newPassword, confirmPassword } = pwdForm
      if (!oldPassword) newErrors.oldPassword = t('account.validateOldPassword')
      const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!newPassword) newErrors.newPassword = t('account.validateNewPassword')
      else if (!pwdRegex.test(newPassword))
        newErrors.newPassword = t('account.validatePassword')
      if (!confirmPassword)
        newErrors.confirmPassword = t('account.validateConfirmNewPassword')
      else if (confirmPassword !== newPassword)
        newErrors.confirmPassword = t('account.odlPasswordRequest')
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    const payload = {
      ...form,
      ...(hasCompany ? companyForm : {}),
      ...(changePwd ? pwdForm : {}),
    }
    try {
      nProgress.start()
      await apiUpdateByUser(payload, current._id)
      if (changePwd) {
        toast.success(t('account.changePasswordSuccess'))
        const ok = window.confirm(t('account.confirmSuccess'))
        dispatch(setLoading({ key: 'UpdateByUser', value: true }))
        if (ok) {
          dispatch(logout())
          await persistor.flush()
          await apiLogout()
          router.push('/account')
        }
      } else {
        toast.success(t('account.changeInforSuccess'))
      }
    } catch (err: any) {
      if (err.response?.status === 422)
        toast.error(t('account.odlPasswordRequest'))
      if (err.response?.status === 409)
        toast.error(t('account.phoneNumberUnique'))
    } finally {
      dispatch(setLoading({ key: 'UpdateByUser', value: false }))
      nProgress.done()
    }
  }

  const renderInfoForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='p-6 sm:p-8 md:p-10 rounded-lg'
    >
      <h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100'>
        {t('account.profileUser')}
      </h2>
      <form
        onSubmit={handleSave}
        className='grid grid-cols-1 sm:grid-cols-2 gap-6'
      >
        {(
          [
            'fullName',
            'email',
            'street',
            'province',
            'postalCode',
            'phone',
          ] as Array<keyof typeof form>
        ).map(key => (
          <div key={key} className='flex flex-col'>
            <label
              htmlFor={key}
              className='text-sm font-medium text-gray-600 mb-2'
            >
              {fieldLabels[key]}
            </label>
            <input
              id={key}
              name={key}
              type='text'
              value={form[key]}
              onChange={handleChange}
              className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5 focus:ring-[#C74242] 
                        focus:outline-none mb-[15px] text-[17px]'
            />
            {errors[key] && (
              <p className='text-red-600 text-sm mt-1'>{errors[key]}</p>
            )}
          </div>
        ))}

        {/* Country selector spans full width */}
        {/* <div className='grid grid-cols-1 gap-6'>
          <div className='sm:col-span-1 flex flex-col'>
            <label className='text-sm font-medium text-gray-600 mb-2'>
              {fieldLabels.country}
            </label>
            <div className='mb-[15px]'>
              <Select
                options={countryOptions}
                value={
                  countryOptions.find(
                    o => o.value.toLowerCase() === form.country,
                  ) || null
                }
                onChange={handleCountryChange}
                className='w-full mb-[15px] text-[17px]'
                classNamePrefix='custom-select'
                styles={{
                  control: (base: any, state: any) => ({
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
            </div>
            {errors.country && (
              <p className='text-red-600 text-sm mt-1'>{errors.country}</p>
            )}
          </div>
        </div> */}

        {/* Company Info Toggle */}
        <div className='sm:col-span-2 flex items-center'>
          <input
            id='hasCompany'
            type='checkbox'
            checked={hasCompany}
            onChange={() => setHasCompany(prev => !prev)}
            className='mr-2'
          />
          <label
            htmlFor='hasCompany'
            className='text-sm font-medium text-gray-700'
          >
            {t('cart.companyInformation')}
          </label>
        </div>

        {hasCompany &&
          (
            ['companyName', 'dic', 'ico'] as Array<keyof typeof companyForm>
          ).map(key => (
            <div key={key} className='flex flex-col'>
              <label
                htmlFor={key}
                className='text-sm font-medium text-gray-600 mb-2'
              >
                {fieldLabels[key]}
              </label>
              <input
                id={key}
                name={key}
                type='text'
                value={(companyForm as any)[key]}
                onChange={handleCompanyChange}
                className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-7 py-5 focus:ring-gold focus:outline-none mb-[15px] text-[17px]'
              />
              {errors[key] && (
                <p className='text-red-600 text-sm mt-1'>{errors[key]}</p>
              )}
            </div>
          ))}

        {/* Password Change */}
        <div className='sm:col-span-2 flex items-center'>
          <input
            id='changePwd'
            type='checkbox'
            checked={changePwd}
            onChange={() => setChangePwd(prev => !prev)}
            className='mr-2'
          />
          <label
            htmlFor='changePwd'
            className='text-sm font-medium text-gray-700'
          >
            {t('account.changePassword')}
          </label>
        </div>

        {changePwd && (
          <div className='grid grid-cols-1 gap-6'>
            <div className='sm:col-span-2 flex flex-col'>
              <label
                htmlFor='oldPassword'
                className='text-sm font-medium text-gray-600 mb-2'
              >
                {t('account.odlPassword')}
              </label>
              <div className='relative'>
                <input
                  id='oldPassword'
                  name='oldPassword'
                  type={showPwd.old ? 'text' : 'password'}
                  value={pwdForm.oldPassword}
                  onChange={e =>
                    setPwdForm(prev => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-7 py-5 pr-12 focus:ring-gold focus:outline-none text-[17px]'
                />
                <button
                  aria-label='seeMore'
                  type='button'
                  onClick={() => toggleShow('old')}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2'
                >
                  {showPwd.old ? (
                    <FiEye className='w-5 h-5 text-gray-500' />
                  ) : (
                    <EyeClosed className='w-5 h-5 text-gray-500' />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className='text-red-600 text-sm mt-1'>
                  {errors.oldPassword}
                </p>
              )}
            </div>

            <div className='sm:col-span-2 flex flex-col gap-6'>
              {[
                {
                  label: t('account.newPassword'),
                  name: 'newPassword',
                  showKey: 'new',
                },
                {
                  label: t('account.confirmNewPassword'),
                  name: 'confirmPassword',
                  showKey: 'confirm',
                },
              ].map(({ label, name, showKey }) => (
                <div key={name} className='flex flex-col'>
                  <label
                    htmlFor={name}
                    className='text-sm font-medium text-gray-600 mb-2'
                  >
                    {label}
                  </label>
                  <div className='relative'>
                    <input
                      id={name}
                      name={name}
                      type={
                        showPwd[showKey as keyof typeof showPwd]
                          ? 'text'
                          : 'password'
                      }
                      value={(pwdForm as any)[name]}
                      onChange={e =>
                        setPwdForm(prev => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                      className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-7 py-5 pr-12 focus:ring-gold focus:outline-none text-[17px]'
                    />
                    <button
                      aria-label='seeMore'
                      type='button'
                      onClick={() => toggleShow(showKey as 'new' | 'confirm')}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer'
                    >
                      {showPwd[showKey as keyof typeof showPwd] ? (
                        <FiEye className='w-5 h-5 text-gray-500' />
                      ) : (
                        <EyeClosed className='w-5 h-5 text-gray-500' />
                      )}
                    </button>
                  </div>
                  {errors[name] && (
                    <p className='text-red-600 text-sm mt-1'>{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='sm:col-span-2 flex justify-end'>
          <button
            aria-label='seeMore'
            type='submit'
            className='bg-[#C74242] hover:bg-white hover:text-[#C74242] transition border border-[#C74242] 
                    text-white rounded-full py-3 px-8 disabled:opacity-50 cursor-pointer'
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </motion.div>
  )

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <main className='flex-1 bg-white rounded-lg min-h-screen'>
        {renderInfoForm()}
      </main>
    </div>
  )
}

export default UserClient
