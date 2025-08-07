'use client'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useTranslations } from 'next-intl'
import nProgress from 'nprogress'

import { ILoginForm } from '@/interface'
import { apiForgotPassword } from '@/api'
import { Label } from '@/components/ui'
import { cn } from '@/lib/utils'
import { createForgotPasswordSchema } from '@/utils'

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false)
  const t = useTranslations('account') // hook gọi ở đây
  const schema = createForgotPasswordSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ILoginForm>({
    mode: 'onChange',
    resolver: joiResolver(schema),
  })

  const onSubmit = useCallback(
    async (data: ILoginForm) => {
      nProgress.start()

      try {
        await apiForgotPassword(data)
        setSubmitted(true)
      } catch (err: any) {
      } finally {
        nProgress.done()
      }
    },
    [t],
  )

  return (
    <div className='min-h-screen lg:min-h-[50vh] xl:min-h-screen bg-gray-50 flex flex-col'>
      <header className='h-[135px] bg-black w-full flex items-center justify-center'></header>

      <div className='flex-grow flex items-center justify-center px-4'>
        {submitted ? (
          <p className='text-center text-[#C74242] text-xl'>
            {t('resetPasswordInfo')}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6 w-full p-5 lg:w-[50vw] xl:w-[30vw] transition-all duration-300'
          >
            {/* email Field */}
            <div className='flex flex-col space-y-1'>
              <Label
                htmlFor='email'
                className='text-md font-medium text-gray-700'
              >
                Email <span className='text-red-500'>*</span>
              </Label>
              <input
                id='email'
                autoFocus
                placeholder={t('placeholderEmail')}
                {...register('email')}
                className='w-full bg-[#f9f6f3] rounded-full px-7 py-5 focus:ring-[#C74242] focus:outline-none mb-[15px] text-[17px]'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>
                  {errors.email?.message?.toString()}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center mt-10 space-y-2 sm:space-y-0 sm:space-x-4'>
              <button
                type='submit'
                aria-label='send'
                disabled={!isDirty || !isValid}
                className={cn(
                  'w-full sm:flex-1 border h-15 px-4 border-[#C74242] hover:bg-[#C74242] text-[#C74242] bg-white hover:text-white rounded-full',
                  !isDirty || !isValid
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer',
                )}
              >
                {t('send')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
