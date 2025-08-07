export interface ITranslation {
  language: string
  title: string
  desc: string
  buttonText: string
}

export interface ISlide {
  _id: string
  imageUrls: string[]
  buttonUrl: string
  activity: true | false
  translations: ITranslation[]
  createdAt: string
  updatedAt: string
  order: number
}

export interface ISlideListItem {
  slide: ISlide
  index: number
  onEdit: (s: ISlide) => void
  onDelete: (s: ISlide) => void
}

export type ILangCode = 'vi' | 'en' | 'cs'
export type ISlideData = Record<ILangCode, ISlideField>

export interface ISlideField {
  title: string
  desc: string
  buttonText: string
}

export interface FormValues extends ISlideField {
  buttonUrl: string
  activity: boolean
}

export interface SlideFormProps {
  slide?: ISlide | null
  setOpenAddSlide?: (open: boolean) => void
  onSuccess?: () => void
}

export interface SlideFormValues {
  activity: boolean
  buttonUrl: string
  image: File | null
  // dynamic per-language fields
  [key: string]: any
}
