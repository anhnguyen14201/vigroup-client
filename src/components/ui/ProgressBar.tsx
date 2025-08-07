'use client'
import NProgress from 'nprogress'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { selectIsAppLoading } from '@/redux'

const ProgressBar = () => {
  const isLoading = useSelector(selectIsAppLoading)
  const prevLoading = useRef(false)

  useEffect(() => {
    // start khi bắt đầu loading
    if (!prevLoading.current && isLoading) {
      NProgress.start()
    }
    // done khi kết thúc loading
    if (prevLoading.current && !isLoading) {
      NProgress.done()
    }
    prevLoading.current = isLoading
  }, [isLoading])

  return <>{/* {isLoading && <IsLoading />} */}</>
}

export default ProgressBar
