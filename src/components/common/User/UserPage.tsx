'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@/redux/redux'
import { AuthGuard, UserClient } from '@/components'
import nProgress from 'nprogress'

const UserPage = () => {
  const router = useRouter()
  const params = useParams() as { locale: string; id: string }
  const token = useSelector((state: RootState) => state.currentUser.token)
  const userId = useSelector(
    (state: RootState) => state.currentUser.current._id,
  )

  useEffect(() => {
    if (!token && userId !== params.id) {
      // Chưa login → redirect client‑side
      router.replace(`/${params.locale}/account`)
    }
  }, [token, userId, params.id, params.locale, router])

  useEffect(() => {
    if (token) {
      nProgress.done()
    }
  }, [token])

  if (!token && userId !== params.id) {
    return null // hoặc hiển thị loading indicator
  }
  return <UserClient />
}

export default function ProtectedUserPageWrapper() {
  return (
    <AuthGuard requireAdmin={false}>
      <UserPage />
    </AuthGuard>
  )
}
