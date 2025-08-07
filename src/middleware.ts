import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n'

const handleI18n = createMiddleware(routing)

async function handleAuth(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl

  /*   const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value
  let payload: any = null */

  /* const requestHeaders = new Headers(req.headers)
  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const originalRequest = new Request(req.url, {
    method: req.method,
    headers: requestHeaders,
    body: req.body,
    redirect: 'manual',
  })

  let response = await fetch(originalRequest)

  // Handle 401 Unauthorized by refreshing the token
  if (response.status === 401) {
    const refreshResponse = await fetch(`api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    })

    if (refreshResponse.ok) {
      const { accessToken: newAccessToken } = await refreshResponse.json()

      // Update the original request with the new access token
      requestHeaders.set('Authorization', `Bearer ${newAccessToken}`)
      const retryRequest = new Request(req.url, {
        method: req.method,
        headers: requestHeaders,
        body: req.body,
        redirect: 'manual',
      })

      // Retry the original request with the new token
      response = await fetch(retryRequest)

      // Set the new access token in the cookies
      const cookieResponse = NextResponse.next()
      cookieResponse.headers.set(
        'Set-Cookie',
        `accessToken=${newAccessToken}; Path=/; HttpOnly`,
      )
      return cookieResponse
    } else {
      // Redirect to login if token refresh fails
      const redirectResponse = NextResponse.redirect('/login')
      redirectResponse.cookies.delete('accessToken')
      return redirectResponse
    }
  }
 */
  if (pathname.startsWith('/admin')) {
    // Nếu có token thì decode một lần duy nhất
    /*   if (token) {
    try {
      payload = await decodeJwtPayload(token)
    } catch {
      // Token hỏng/hết hạn → chuyển về login
      const url = req.nextUrl.clone()
      url.pathname = '/account'
      return NextResponse.redirect(url)
    }
  } */

    // Trang /[locale]/account → không cho user đã login
    /*   if (/^\/[^\/]+\/account\/?$/.test(pathname)) {
    if (payload) {
      const locale = pathname.split('/')[1]
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
    return null
  } */

    // Trang user info
    /*   const userMatch = pathname.match(/^\/([^\/]+)\/account\/user\/([^\/]+)/)
  if (userMatch) {
    const locale = userMatch[1]
    const userId = userMatch[2]
    if (!payload?._id) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/account`
      return NextResponse.redirect(url)
    }
    if (payload._id !== userId) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
    return null
  }
 */
    // Protect /admin routes
    /*     if (!token) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/account'
      return NextResponse.redirect(redirectUrl)
    }
    const payload = await decodeJwtPayload(token) */
    /*     const role = payload?.role
    if (!role || !adminRoles.includes(role)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/account'
      return NextResponse.redirect(redirectUrl)
    } */
    return NextResponse.next()
  }

  // Employee routes
  if (pathname.startsWith('/employee')) {
    /* if (!payload?.role || !employeeRoles.includes(payload.role)) {
      const url = req.nextUrl.clone()
      url.pathname = '/account'
    } */
    return NextResponse.next()
  }

  return null
}

export async function middleware(req: NextRequest) {
  const authResp = await handleAuth(req)
  if (authResp) return authResp

  return handleI18n(req)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
