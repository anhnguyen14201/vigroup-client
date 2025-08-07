import React from 'react'
import { statusProjectClasses, statusProjectLabels } from '@/constants'

interface ProjectInfoCardProps {
  code: any
  location: any
  status: any
  projectNameVI: any
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  code,
  location,
  status,
  projectNameVI,
}) => {
  // Lấy dữ liệu dự án một lần duy nhất

  return (
    <div className='project-info relative flex-1 p-6 border rounded-lg bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Thông tin Dự án</h2>
        <span className={statusProjectClasses[status ?? 'default']}>
          {statusProjectLabels[status ?? 'default']}
        </span>
      </div>
      <div className='space-y-1'>
        <div className='flex justify-between'>
          <p>
            <strong>Tên dự án:</strong> {projectNameVI}
          </p>
          <p>
            <strong>Mã dự án:</strong> {code}
          </p>
        </div>
        <p>
          <strong>Địa chỉ:</strong> {location}
        </p>
      </div>
    </div>
  )
}

export default ProjectInfoCard
