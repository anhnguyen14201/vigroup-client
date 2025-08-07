import { RootState } from '@/redux/redux'

export const selectIsAppLoading = (state: RootState) =>
  Object.values(state.loading).some(Boolean)

export const selectAllLoadingStates = (state: RootState) =>
  Object.values(state.loading)
