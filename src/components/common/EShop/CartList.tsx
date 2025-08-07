'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'

// Dynamic import of heavy CartItem to reduce initial bundle
const CartItem = dynamic(() => import('./CartItem'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

// Stable motion variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

interface CartListProps {
  products: any[]
}

const CartList: React.FC<CartListProps> = React.memo(({ products }) => {
  // Memoize grid items to prevent unnecessary re-renders
  const productItems = useMemo(
    () =>
      products.map(p => (
        <motion.div
          key={p._id}
          variants={itemVariants}
          initial='hidden'
          animate='enter'
          exit='exit'
          transition={{ duration: 0.5 }}
          layout
        >
          <CartItem product={p} />
        </motion.div>
      )),
    [products],
  )

  return (
    <div className='relative'>
      <AnimatePresence>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5'
          layout
        >
          {productItems}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

CartList.displayName = 'CartList'
export default CartList
