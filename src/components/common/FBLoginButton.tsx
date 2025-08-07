'use client'

import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import FacebookLogin from '@greatsumini/react-facebook-login'

import { apiFBLogin } from '@/api'
import { getCurrent, login, setLoading } from '@/redux'
import { AppDispatch } from '@/redux/redux'
import { IFBLoginButtonProps } from '@/interface'
import nProgress from 'nprogress'

export default function FBLoginButton({ t }: IFBLoginButtonProps) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleSuccess = useCallback(
    async (response: any) => {
      dispatch(setLoading({ key: 'LoginFB', value: true }))
      nProgress.start()
      try {
        const apiResponse = await apiFBLogin({
          access_token: response.accessToken,
        })

        if (apiResponse) {
          toast.success(t('notification.loginSuccess'))
          dispatch(
            login({
              isLoginedIn: true,
              token: apiResponse.data.accessToken,
              userData: apiResponse.data.user,
            }),
          )

          dispatch(getCurrent())
          const role = apiResponse.data.user.role
          const userId = apiResponse.data.user._id

          if ([3515, 1413914, 1311417518].includes(role)) {
            router.push('/admin/dashboard')
          } else if (role === 5131612152555) {
            router.push(`/account/employee/${userId}`)
          } else if (role === 32119201513518) {
            router.push(`/account/user/${userId}`)
          }
        }
      } catch (err: any) {
        if (err.response?.status === 409) {
          toast.error(t('notification.emailRegisteredFB'))
        } else {
          toast.error(t('notification.loginFailed'))
        }
      } finally {
        dispatch(setLoading({ key: 'LoginFB', value: false }))
        nProgress.done()
      }
    },
    [dispatch, router, t],
  )

  const handleFail = useCallback(() => {
    toast.error(t('notification.loginFailed'))
  }, [t])

  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FB_APP_ID || ''}
      onSuccess={handleSuccess}
      onFail={handleFail}
      onProfileSuccess={() => {}}
      render={({ onClick }) => (
        <button
          type='button'
          aria-label='Play video'
          onClick={onClick}
          className='flex-1 w-full flex items-center justify-center h-15 px-4 rounded-full text-lg 
                      cursor-pointer bg-blue-100 border border-blue-500 text-blue-600 font-semibold py-3 
                      hover:bg-blue-300 transition duration-300'
        >
          <svg className='w-6 h-6 mr-2' fill='currentColor' viewBox='0 0 24 24'>
            <path
              d='M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 
              9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 
              2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 
              21.128 22 16.991 22 12z'
            />
          </svg>
          {t('loginWithFacebook')}
        </button>
      )}
    />
  )
}
