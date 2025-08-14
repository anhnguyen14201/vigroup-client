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
type Subscriber = (token: string | null, error?: any) => void
let subscribers: Subscriber[] = []

const subscribeTokenRefresh = (cb: Subscriber) => {
  subscribers.push(cb)
}

const onRefreshed = (token: string | null, error?: any) => {
  subscribers.forEach(cb => cb(token, error))
  subscribers = []
}

const raw = axios.create({ withCredentials: true })

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
      try {
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
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  },
)
export default instance
