'use client'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { AppDispatch, RootState } from '@/redux/redux'

import { getCurrent } from '@/redux'

export const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.currentUser.token)

  useEffect(() => {
    // ...thêm API khác nếu cần

    if (token) {
      // Chỉ dispatch khi đã có token
      dispatch(getCurrent())
    }
  }, [dispatch, token])

  return null
}
