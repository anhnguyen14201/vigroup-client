'use client'

import React, { use, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import toast from 'react-hot-toast'
import { Eye, EyeClosed } from 'lucide-react'

import { createResetPasswordSchema } from '@/utils'
import { IRegisterForm } from '@/interface'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui'
import { useTranslations } from 'next-intl'
import { apiResetPassword } from '@/api'
import { useParams } from 'next/navigation'
import nProgress from 'nprogress'
import { fi } from 'date-fns/locale'

interface RegisterFormProps {
  onSuccess?: () => void
}
const ResetPassword = () => {
  const t = useTranslations('account')
  const schema = createResetPasswordSchema(t)

  const { id } = useParams()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<IRegisterForm>({
    mode: 'onChange',
    resolver: joiResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = useCallback(
    async (data: IRegisterForm) => {
      const payload = {
        ...data,
        token: id,
      }

      try {
        nProgress.start()
        const res = await apiResetPassword(payload)

        if (res) {
          toast.success(t('notification.passwordChanged'))
          reset()
        }
      } catch (error: any) {
        // Nếu là lỗi từ Axios
        if (error) {
          const status = error.response?.status
          if (status === 410) {
            // Token hết hạn
            toast.error(
              t('notification.tokenExpired') ||
                'Liên kết đổi mật khẩu đã hết hạn. Vui lòng yêu cầu lại',
            )
            return
          }
        }
        // Các lỗi khác
        toast.error(t('notification.passwordChangedFailed'))
      } finally {
        nProgress.done()
      }
    },
    [reset, t, id],
  )

  return (
    <div className='min-h-screen lg:min-h-[50vh] xl:min-h-screen bg-gray-50 flex flex-col'>
      <header className='h-[135px] bg-black w-full flex items-center justify-center'></header>
      <div className='flex-grow flex items-center justify-center px-4'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6 w-full p-5 lg:w-[50vw] xl:w-[30vw] transition-all duration-300'
        >
          <div className='flex flex-col space-y-1 flex-1'>
            <Label
              htmlFor='password'
              className='text-sm font-medium text-gray-700'
            >
              {t('newPassword')} <span className='text-red-500'>*</span>
            </Label>
            <div className='flex justify-center items-center'>
              <div className='relative mb-[15px] w-full'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('placeholderPassword')}
                  {...register('password')}
                  className='w-full bg-[#f9f6f3]
                              rounded-full px-7 py-5
                              focus:outline-none text-[17px]'
                />
                <button
                  aria-label='show password'
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 
                          hover:text-gray-700 focus:outline-none'
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

          {/* Confirm Password Field */}
          <div className='flex flex-col space-y-1 flex-1'>
            <Label
              htmlFor='confirmPassword'
              className='text-sm font-medium text-gray-700'
            >
              {t('confirmPassword')} <span className='text-red-500'>*</span>
            </Label>
            <div className='flex justify-center items-center'>
              <div className='relative w-full mb-[15px]'>
                <input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('placeholderConfirmPassword')}
                  {...register('confirmPassword')}
                  className='w-full bg-[#f9f6f3]
                              rounded-full px-7 py-5
                              focus:outline-none text-[17px]'
                />
                <button
                  type='submit'
                  aria-label='show password'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 
                          hover:text-gray-700 focus:outline-none'
                >
                  {showConfirmPassword ? (
                    <Eye className='w-5 h-5' />
                  ) : (
                    <EyeClosed className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm text-red-500'>
                {errors.confirmPassword?.message?.toString()}
              </p>
            )}
          </div>

          {/*     <Link /> */}

          {/* Submit Button */}
          <div className='flex items-center justify-center mt-10 space-x-4'>
            <button
              type='submit'
              aria-label='register'
              disabled={!isDirty || !isValid}
              className={cn(
                'w-full sm:flex-1 border h-15 px-4 border-[#C74242] hover:bg-[#C74242] text-[#C74242] bg-white hover:text-white rounded-full',
                !isDirty || !isValid
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
              )}
            >
              {t('changePassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
