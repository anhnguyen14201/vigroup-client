'use client'

import dynamic from 'next/dynamic'
import { memo } from 'react'

const Next13ProgressBar = dynamic(
  () => import('next13-progressbar').then(mod => mod.Next13ProgressBar),
  { ssr: false },
)

export const ProgressProvider = memo(
  ({ children }: { children: React.ReactNode }) => (
    <>
      {children}
      <Next13ProgressBar
        height='4px'
        color='#0A2FFF'
        options={{
          showSpinner: false,
          minimum: 0.02,
          trickleSpeed: 80,
        }}
        showOnShallow={false}
        disableSameURL={false}
      />
    </>
  ),
)
