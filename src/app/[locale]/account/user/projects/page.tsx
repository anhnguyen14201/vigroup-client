import React from 'react'
import { getTranslations } from 'next-intl/server'
import { ProjectFrontEnd } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('service.projects')}`,
  }
}

const ProjectsPage = () => {
  return <ProjectFrontEnd />
}

export default ProjectsPage
