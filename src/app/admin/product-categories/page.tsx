import { BrandManager, Installation, ProductCategory } from '@/components'
import React from 'react'

export const metadata = {
  title: 'Danh mục sản phẩm',
}

const ProductCategoryPage = () => {
  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col gap-4 p-5'>
        <div className='columns-2 gap-2'>
          <div className='break-inside-avoid'>
            <ProductCategory />
          </div>
          <div className='break-inside-avoid'>
            <BrandManager />
          </div>
          <div className='break-inside-avoid'>
            <Installation />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductCategoryPage
