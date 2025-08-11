interface Language {
  code: string
}

interface Translation {
  language: {
    code: string
  }
  projectName: string
  description: string
  buildingType: string
  metaDescription: string
}

interface Project {
  code?: string
  translations: Translation[]
  location?: string
  showProject?: string
  nightShiftPay?: string
  projectType: string | { _id: string }
}

// Form values with dynamic translation keys
export interface ProjectFormValues {
  code: string
  location: string
  nightShiftPay?: string
  projectType: string
  thumbnail?: File
  images: File[]
  [key: string]: string | File | File[] | undefined
}

export const mapProjectToForm = (
  proj: Project,
  languages: Language[],
): ProjectFormValues => {
  const init: ProjectFormValues = {
    code: proj.code ?? '',
    showProject: proj.showProject ?? '',
    location: proj.location ?? '',
    nightShiftPay: proj.nightShiftPay ?? '',
    projectType:
      typeof proj.projectType === 'string'
        ? proj.projectType
        : proj.projectType._id,
    thumbnail: undefined,
    images: [],
  }

  languages.forEach(({ code }) => {
    const tr = proj.translations.find(t => t.language.code === code)
    init[`projectName_${code}`] = tr?.projectName ?? ''
    init[`buildingType_${code}`] = tr?.buildingType ?? ''
    init[`description_${code}`] = tr?.description ?? ''
    init[`metaDescription_${code}`] = tr?.metaDescription ?? ''
  })

  return init
}
