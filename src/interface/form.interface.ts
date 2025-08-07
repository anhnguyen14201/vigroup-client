import { ISelectCurrencyOption } from '@/interface/quotation.interface'
import { FieldValues } from 'react-hook-form'

export interface ISelectOption {
  value: number | string
  label: string
}

export interface FieldConfig<T> {
  name: keyof T | string
  label?: string
  type:
    | 'text'
    | 'url'
    | 'select'
    | 'switch'
    | 'password'
    | 'textarea'
    | 'number'
    | 'date'
    | 'file'
    | 'editor'
    | 'country'
    | 'phone'
  options?: ISelectOption[] | ISelectCurrencyOption[]
  placeholder?: string
  defaultValue?: any
  multiple?: boolean
  required?: boolean
  requiredMessage?: string
  pattern?: RegExp
  patternMessage?: string
  accept?: string
}

export interface GenericFormProps<T extends FieldValues> {
  colSpan?: number
  initialData?: T
  title?: string
  fields: Array<FieldConfig<T>>
  languages?: { code: string; iconUrl: string; name: string }[]
  currentLang?: string
  onLangChange?: (code: string) => void
  onSubmitApi: (values: T) => Promise<void>
  onSuccess?: () => void
  preview?: any
  onPreviewChange?: (urls: string[]) => void
}
