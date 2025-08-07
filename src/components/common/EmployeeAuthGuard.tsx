'use client'

import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/redux'

interface EmployeeAuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const EmployeeAuthGuard: React.FC<EmployeeAuthGuardProps> = ({
  children,
  requireAdmin = false,
}) => {
  const router = useRouter()

  // Lấy thông tin người dùng từ Redux
  const { token, isInitialized, current } = useSelector(
    (state: RootState) => state?.currentUser,
  )

  const role = current?.role
  const id = current?.user?._id

  // Danh sách role được phép truy cập trang admin
  const allowedRoles = useMemo(() => [3515, 1413914, 1311417518], [])

  useEffect(() => {
    if (isInitialized) {
      if (!token) {
        // Không đăng nhập: chuyển hướng về trang đăng nhập
        router.replace('/employee')
        return
      }
      if (requireAdmin && !allowedRoles.includes(role)) {
        // Yêu cầu là admin nhưng role không hợp lệ: chuyển hướng về trang đăng nhập hoặc trang không có quyền
        router.replace(`/account/user/${id}`)
        return
      }
    }
  }, [isInitialized, token, role, requireAdmin, router, allowedRoles, id])

  // Hiển thị loading hoặc trả về null nếu chưa có token, hoặc nếu yêu cầu admin mà role không hợp lệ
  if (!token) {
    return null
  }
  if (requireAdmin && !allowedRoles.includes(role)) {
    return null
  }

  return <div>{children}</div>
}

export default EmployeeAuthGuard
