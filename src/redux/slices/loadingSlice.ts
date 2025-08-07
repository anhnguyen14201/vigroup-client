import { ILoading } from '@/interface'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ILoading = {}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ key: string; value: boolean }>,
    ) => {
      const { key, value } = action.payload
      state[key] = value
    },
    resetLoading: () => {
      return initialState
    },
  },
})

export const { setLoading } = loadingSlice.actions
export default loadingSlice.reducer
