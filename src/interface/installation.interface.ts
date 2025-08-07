export interface IInstallation {
  id: string
  imageUrls?: string
  desc_en?: string
  desc_vi?: string
  tax?: number
  cost?: number
  translations?: Array<{
    lang?: string
    desc?: string
  }>
  // …các field khác nếu có…
}

export interface GetInstallationColumnProps {
  currentLang: string
  onEdit: (inst: IInstallation) => void
  onDelete: (inst: IInstallation) => void
}
