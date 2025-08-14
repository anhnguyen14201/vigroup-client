import axios from 'axios'
import { apiLogout, apiRefreshToken } from '@/api/authApi'
import { logout, updateToken } from '@/redux'
import { store } from '@/redux/redux'
/* import { store } from '../Redux/redux'
import { logout, updateToken } from '../Redux/UserStore/userStoreSlice'
import { apiRefreshToken } from '../Apis' */

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
})

instance.defaults.withCredentials = true

let isRefreshing = false
let failedQueue = [] as any

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Response interceptor
/* let isRefreshing = false
let queue: ((token: string) => void)[] = [] */

// Interceptor cho request
instance.interceptors.request.use(
  config => {
    const token = store.getState().currentUser.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// Interceptor cho response
instance.interceptors.response.use(
  resp => resp,
  async err => {
    const originalReq = err.config
    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, rejects) => {
          failedQueue.push({ resolve, rejects })
        }).then(token => {
          originalReq.headers['Authorization'] = `Bearer ${token}`
          return instance(originalReq)
        })
      }

      originalReq._retry = true
      isRefreshing = true
      /*       try {
        const { data } = await apiRefreshToken()
        const newToken = data.accessToken

        if (data && newToken) {
          store.dispatch(updateToken({ token: newToken }))
          instance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newToken}`
          processQueue(null, newToken)
          return instance(originalReq)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        window.location.href = '/account'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      } */

      try {
        // IMPORTANT: call refresh using a raw axios (without interceptors)
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/auth/refresh`,
          {},
          { withCredentials: true },
        )

        const newToken = data?.accessToken
        if (newToken) {
          store.dispatch(updateToken({ token: newToken }))
          instance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newToken}`
          processQueue(null, newToken)
          originalReq.headers['Authorization'] = `Bearer ${newToken}`
          return instance(originalReq)
        } else {
          throw new Error('No token in refresh response')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        // clear auth state then redirect
        store.dispatch(logout()) // hoặc dispatch logout action cụ thể
        apiLogout()
        window.location.href = '/account'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  },
)
export default instance
