// src/constants/languageMap.ts

export const languageMap: Record<string, string> = {
  '68406287d02c80cef15fdaf7': 'vi',
  '68406314d02c80cef15fdafb': 'en',
  '684062fed02c80cef15fdaf9': 'cs',
}

export const localeToIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(languageMap).map(([id, code]) => [code, id]),
)
