'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { joiResolver } from '@hookform/resolvers/joi'
import toast from 'react-hot-toast'
import { Eye, EyeClosed } from 'lucide-react'
import { useTranslations } from 'next-intl'
import nProgress from 'nprogress'

import { ILoginForm } from '@/interface'
import { createSignInSchema } from '@/utils'
import { AppDispatch, persistor, store } from '@/redux/redux'
import { getCurrent, login, setLoading } from '@/redux'
import { apiLogin } from '@/api'
import { Label } from '@/components/ui'
import FBLoginButton from '@/components/common/FBLoginButton'
import { cn } from '@/lib/utils'

const LoginForm = () => {
  const t = useTranslations('account') // hook gọi ở đây
  const schema = createSignInSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ILoginForm>({
    mode: 'onChange',
    resolver: joiResolver(schema),
  })
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const onSubmit = useCallback(
    async (data: ILoginForm) => {
      dispatch(setLoading({ key: 'Login', value: true }))
      nProgress.start()
      let didRedirect = false

      try {
        const loginRes = await apiLogin(data)
        toast.success(t('notification.loginSuccess'))

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

        const isAdmin = [3515, 1413914, 1311417518].includes(role)
        const isUser = [32119201513518].includes(role)

        if (isAdmin) {
          didRedirect = true
          router.replace('/admin/dashboard')
        }

        if (isUser) {
          didRedirect = true
          router.replace(`/account/user/${userId}`)
        }
      } catch (err: any) {
        nProgress.done()
        dispatch(setLoading({ key: 'Login', value: false }))
        if (err.response?.status === 403) {
          toast.error(t('notification.accountLocked'))
        } else if (err.response?.status === 404) {
          toast.error(
            err.response.data?.message || t('notification.loginFailed'),
          )
        } else {
          toast.error(t('notification.loginFailed'))
        }
      } finally {
        if (!didRedirect) {
          nProgress.done()
          console.log(didRedirect)
          dispatch(setLoading({ key: 'Login', value: false }))
        }
      }
    },
    [dispatch, router, t],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 h-full'>
      {/* Username Field */}
      <div className='flex flex-col space-y-1'>
        <Label htmlFor='username' className='text-md font-medium text-gray-700'>
          {t('username')} <span className='text-red-500'>*</span>
        </Label>
        <input
          id='username'
          autoFocus
          placeholder={t('placeholderUsername')}
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
        <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
          {t('password')} <span className='text-red-500'>*</span>
        </Label>
        <div className='flex items-center mb-[15px]'>
          <div className='relative w-full'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder={t('placeholderPassword')}
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

      {/* Forgot password */}
      <div className='flex justify-end'>
        <Link
          href='/account/forgot-password'
          className='text-md text-blue-600 hover:underline'
        >
          {t('forgotPassword')}
        </Link>
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
          {t('login')}
        </button>

        <span className='text-gray-500 text-xl'>or</span>

        <div className='w-full sm:flex-2'>
          <FBLoginButton t={t} />
        </div>
      </div>
    </form>
  )
}

export default LoginForm
