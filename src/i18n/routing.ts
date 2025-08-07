import { defineRouting } from 'next-intl/routing'
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['vi', 'cs', 'en'],

  // Used when no locale matches
  defaultLocale: 'vi',
  localeDetection: true,
})
