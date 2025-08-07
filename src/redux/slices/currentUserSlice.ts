import { createSlice } from '@reduxjs/toolkit'
import * as actions from '../actions/asyncCurrentUser'
import { apiLogout } from '@/api'

interface UserState {
  isLoginedIn: boolean
  isInitialized: boolean
  current: any | null
  token: string | null
}

const initialState: UserState = {
  isLoginedIn: false,
  current: null,
  token: null,
  isInitialized: false,
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,

  reducers: {
    login: (state, action) => {
      state.isLoginedIn = action.payload.isLoginedIn
      state.token = action.payload.token
      state.current = action.payload.userData
    },
    logout: state => {
      state.isLoginedIn = false
      state.current = null
      state.token = null
    },

    setInitialized: state => {
      state.isInitialized = true
    },

    updateToken: (state, action) => {
      state.token = action.payload.token
    },
  },

  extraReducers: builder => {
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      const payload = action.payload as { data: any }
      state.current = payload.data
      state.isLoginedIn = true
    })
    builder.addCase(actions.getCurrent.rejected, state => {
      state.current = null
      state.token = null
      state.isLoginedIn = false
    })
  },
})

export const { login, logout, updateToken, setInitialized } =
  currentUserSlice.actions

export default currentUserSlice.reducer
