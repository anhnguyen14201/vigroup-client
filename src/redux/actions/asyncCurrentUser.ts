import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCurrent } from '@/api'
import { setLoading } from '@/redux/slices'
import { RootState } from '@/redux/redux'
import nProgress from 'nprogress'

export const getCurrent = createAsyncThunk(
  'currentUser/getCurrent',
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(setLoading({ key: 'getCurrent', value: true }))
    nProgress.start()

    const token = (getState() as RootState).currentUser.token

    if (!token) {
      return rejectWithValue({ message: 'User not logged in' })
    }

    try {
      const res = await apiGetCurrent()
      if (!res) {
        throw new Error('No data found')
      }

      return res.data
    } catch (error) {
      return rejectWithValue(error)
    } finally {
      dispatch(setLoading({ key: 'getCurrent', value: false }))
      nProgress.done()
    }
  },
)
