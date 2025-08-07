import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'

import currentUserSlice from '@/redux/slices/currentUserSlice'
import loadingSlice from '@/redux/slices/loadingSlice'
import createWebStorage from 'redux-persist/es/storage/createWebStorage'
import cartSlice from '@/redux/slices/cartSlice'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

// Chọn storage tuỳ môi trường
const storage =
  typeof window === 'undefined'
    ? createNoopStorage()
    : createWebStorage('local')

const currentUserConfig = {
  key: 'currentUser',
  storage,
  whitelist: ['isLoginedIn', 'token', 'current'],
  throttle: 1000,
}

const cartConfig = {
  key: 'cart',
  storage,
  whitelist: ['cartItems'],
  throttle: 1000,
}

const persistedCurrentUserReducer = persistReducer(
  currentUserConfig,
  currentUserSlice,
)
const persistedCartReducer = persistReducer(cartConfig, cartSlice)

export const store = configureStore({
  reducer: {
    currentUser: persistedCurrentUserReducer,
    loading: loadingSlice,
    cart: persistedCartReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
