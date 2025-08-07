// Map selected any → initialData cho form

export const mapProjectTypeToForm = (pt: any, languages: any) => {
  const initValues: Record<string, any> = {}
  if (Array.isArray(languages)) {
    languages.forEach(lang => {
      const code = lang.code
      const tr = pt.translations.find(
        (t: any) => (t.language as any).code === code,
      )

      initValues[`name_${code}`] = tr?.name || ''
      initValues[`metaTitle_${code}`] = tr?.metaTitle || ''
      initValues[`metaDescription_${code}`] = tr?.metaDescription || ''
    })
  }
  return initValues as Record<string, any>
}
