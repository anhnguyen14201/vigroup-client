export interface ILanguage {
  _id: string
  iconUrl: string[]
  code: string
  name: string
  languages: []
}

export interface LanguageSwitcherProps {
  languages: ILanguage[]
  onLangChange: (langCode: string) => void
  currentLang: string
}

export interface UseLanguageResult {
  items: ILanguage[]
  isLoading: boolean
  error: any
}
