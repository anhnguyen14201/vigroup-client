'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ProgressBar } from '@/components'
import { getCurrent, setInitialized } from '@/redux'
import { persistor, store } from '@/redux/redux'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<ProgressBar />}
        persistor={persistor}
        onBeforeLift={() => {
          store.dispatch(setInitialized())
          const { token } = store.getState().currentUser
          if (token) {
            store.dispatch(getCurrent())
          }
        }}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}
