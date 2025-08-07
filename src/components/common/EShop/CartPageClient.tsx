'use client'

import { Cart } from '@/components'
import nProgress from 'nprogress'

export default function CartPageClient() {
  return (
    <Cart
      onLoading={() => nProgress.start()}
      onLoaded={() => nProgress.done()}
    />
  )
}
