'use client'

import React from 'react'
import ProjectItem from '@/components/common/Project/ProjectItem'

interface ProjectListProps {
  templates: any[]
  url: string
}

const ProjectList: React.FC<ProjectListProps> = ({ templates, url }) => {
  return (
    <>
      <ProjectItem templates={templates} url={url} />
    </>
  )
}

export default ProjectList
