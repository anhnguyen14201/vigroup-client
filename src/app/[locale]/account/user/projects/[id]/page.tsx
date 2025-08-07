import { ProjectDetailClient } from '@/components'
import { Locale } from '@/interface'
import { getProjectById } from '@/lib'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function projectDetailPage({
  params,
}: {
  params: { locale: Locale; id: string }
}) {
  const { id } = await params

  let data
  try {
    data = await getProjectById(id)
  } catch (err: any) {
    if (err.response?.status === 404) return notFound()
    throw err
  }
  return <ProjectDetailClient data={data} />
}
