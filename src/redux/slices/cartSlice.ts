import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 1. Chỉ định nghĩa interface với 2 trường cần thiết
export interface CartItem {
  productId: string
  quantity: number
}

interface CartState {
  cartItems: CartItem[]
}

const initialState: CartState = {
  cartItems: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addToCart giờ chỉ lưu productId và quantity
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { productId, quantity } = action.payload
      const existingItem = state.cartItems.find(
        item => item.productId === productId,
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cartItems.push({ productId, quantity })
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        item => item.productId !== action.payload,
      )
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload
      const item = state.cartItems.find(item => item.productId === productId)
      if (item) {
        item.quantity = quantity
      }
    },

    clearCart: state => {
      state.cartItems = []
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setCart,
} = cartSlice.actions

export default cartSlice.reducer
