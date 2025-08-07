'use client'

import React, { useCallback, useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'

import { ILoginForm } from '@/interface'
import { apiLogin } from '@/api'
import { Label } from '@/components'
import { useLogos } from '@/hooks'
import { cn } from '@/lib'

import { AppDispatch, persistor, store } from '@/redux/redux'
import { getCurrent, login, setLoading } from '@/redux'

const EmployeeLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ILoginForm>({
    mode: 'onChange',
  })
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { items: logos } = useLogos()

  const logoDark = logos?.find((logo: any) => logo?.logoType === 'logoBlack')

  const onSubmit = useCallback(
    async (data: ILoginForm) => {
      dispatch(setLoading({ key: 'Login', value: true }))
      nProgress.start()

      try {
        const loginRes = await apiLogin(data)
        toast.success('Đăng nhập thành công')

        dispatch(
          login({
            isLoginedIn: true,
            token: loginRes.data.accessToken,
            userData: loginRes.data.user,
          }),
        )

        if (persistor) {
          await persistor.flush()
        }

        // Không cần unwrap để dùng vừa dispatch vừa redirect
        await dispatch(getCurrent())
        const state = store.getState()
        const { role, _id: userId } = state?.currentUser?.current

        const isAdmin = [3515, 1413914, 1311417518, 5131612152555].includes(
          role,
        )

        if (isAdmin) {
          await router.replace('/employee/account/timekeeping')
        } else {
          await router.replace(`/account/user/${userId}`)
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          toast.error('Tài khoản đã bị khóa')
        } else if (err.response?.status === 404) {
          toast.error(err.response.data?.message || 'Đăng nhập thất bại')
        } else {
          toast.error('Đăng nhập thất bại')
        }
      } finally {
        nProgress.done()
        dispatch(setLoading({ key: 'Login', value: false }))
      }
    },
    [dispatch, router],
  )

  return (
    <div className='p-6 flex flex-col items-center justify-center min-h-screen'>
      <div className='space-y-4 w-full mb-10 flex justify-center'>
        {logoDark?.imageUrls?.[0] ? (
          <div style={{ width: 200, height: 50, position: 'relative' }}>
            <Image
              src={logoDark.imageUrls[0]}
              alt='Vigroup logo'
              width={200}
              height={50}
              priority
              loading='eager'
            />
          </div>
        ) : (
          <Skeleton width={200} height={50} />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6 h-full w-full lg:w-1/2'
      >
        {/* Username Field */}
        <div className='flex flex-col space-y-1'>
          <Label
            htmlFor='username'
            className='text-md font-medium text-gray-700'
          >
            Số điện thoại <span className='text-red-500'>*</span>
          </Label>
          <input
            id='username'
            autoFocus
            placeholder='Nhập số điện thoại'
            {...register('username')}
            className='w-full bg-[#f9f6f3]
                          rounded-full px-7 py-5 focus:ring-[#C74242] 
                          focus:outline-none mb-[15px] text-[17px]'
          />
          {errors.username && (
            <p className='text-sm text-red-500'>
              {errors.username?.message?.toString()}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className='flex flex-col space-y-1'>
          <Label
            htmlFor='password'
            className='text-sm font-medium text-gray-700'
          >
            Mật khẩu<span className='text-red-500'>*</span>
          </Label>
          <div className='flex items-center mb-[15px]'>
            <div className='relative w-full'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Nhập mật khẩu'
                {...register('password', { required: true })}
                className='w-full bg-[#f9f6f3]
                            rounded-full px-7 py-5 focus:ring-[#C74242] 
                            focus:outline-none  text-[17px]'
              />
              <button
                type='button'
                aria-label='show password'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none'
              >
                {showPassword ? (
                  <Eye className='w-5 h-5' />
                ) : (
                  <EyeClosed className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className='text-sm text-red-500'>
              {errors.password?.message?.toString()}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className='flex flex-col sm:flex-row items-center justify-center mt-10 space-y-2 sm:space-y-0 sm:space-x-4'>
          <button
            type='submit'
            aria-label='login'
            disabled={!isDirty || !isValid}
            className={cn(
              'w-full sm:flex-1 border h-15 px-4 border-[#C74242] hover:bg-[#C74242] text-[#C74242] bg-white hover:text-white rounded-full',
              !isDirty || !isValid
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer',
            )}
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeLoginPage
