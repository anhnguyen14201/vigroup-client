'use client'

import Calendar from '@/components/common/Calendar'
import React, { FC } from 'react'
import { KeyedMutator } from 'swr'

interface ProjectTimelineCardProps {
  projectData: any
  mutate?: KeyedMutator<any>
}

const ProjectTimelineCard: FC<ProjectTimelineCardProps> = ({
  projectData,
  mutate,
}) => {
  return (
    <div className='bottom-section p-6 border rounded-lg bg-white'>
      <h2 className='text-xl font-bold mb-4'>Tiến độ Dự án</h2>
      <div className=''>
        <Calendar projectData={projectData} mutate={mutate} />
      </div>
    </div>
  )
}

export default ProjectTimelineCard
