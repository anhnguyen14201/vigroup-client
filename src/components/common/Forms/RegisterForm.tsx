'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import toast from 'react-hot-toast'
import { Eye, EyeClosed } from 'lucide-react'

import { apiRegister } from '@/api'
import { createRegisterSchema } from '@/utils'
import { IRegisterForm } from '@/interface'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui'
import { useTranslations } from 'next-intl'

interface RegisterFormProps {
  onSuccess?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const t = useTranslations('account')
  const schema = createRegisterSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<IRegisterForm>({
    mode: 'onChange',
    resolver: joiResolver(schema),
    defaultValues: {
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = useCallback(
    async (data: IRegisterForm) => {
      // Handle login logic here
      try {
        const res = await apiRegister(data)

        if (res) {
          toast.success(t('notification.registerSuccess'))
          reset()
          onSuccess?.()
        }
      } catch {
        // Handle other errors (e.g., network error)
        toast.error(t('notification.registerFailed'))
      }
    },
    [reset, t, onSuccess],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Username Field */}
      <div className='flex flex-col space-y-1 flex-1'>
        <Label htmlFor='username' className='text-md font-medium text-gray-700'>
          {t('username')} <span className='text-red-500'>*</span>
        </Label>
        <input
          id='username'
          autoFocus
          placeholder={t('placeholderUsername')}
          {...register('username')}
          className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none mb-[15px] text-[17px]'
        />
        {errors.username && (
          <p className='text-sm text-red-500'>
            {errors.username?.message?.toString()}
          </p>
        )}
      </div>
      {/* Username Field */}
      <div className='flex flex-col space-y-1 flex-1'>
        <Label htmlFor='fullName' className='text-md font-medium text-gray-700'>
          {t('fullname')} <span className='text-red-500'>*</span>
        </Label>
        <input
          id='fullName'
          placeholder={t('placeholderFullname')}
          {...register('fullName')}
          className='w-full bg-[#f9f6f3]
                        rounded-full px-7 py-5
                        focus:outline-none mb-[15px] text-[17px]'
        />
        {errors.fullName && (
          <p className='text-sm text-red-500'>
            {errors.fullName?.message?.toString()}
          </p>
        )}
      </div>

      {/* Password Field */}

      <div className='flex flex-col space-y-1 flex-1'>
        <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
          {t('password')} <span className='text-red-500'>*</span>
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
              type='button'
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
          {t('createAccount')}
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
