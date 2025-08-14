import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Head from 'next/head'
const Toaster = dynamic(() =>
  import('react-hot-toast').then(mod => mod.Toaster),
)
import { Oswald, Outfit } from 'next/font/google'

import '@/styles/globals.css'

import { AppInitializer, ProgressProvider, ReduxProvider } from '@/providers'
import {
  Footer,
  Header,
  InitialLoader,
  PageTransitionWrapper,
  ScrollToTopButton,
} from '@/components'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-outfit',
  display: 'swap',
})
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

export const revalidate = 3600

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Lấy locale từ params (đây là dynamic route)
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${outfit.variable} ${oswald.variable}`}
    >
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
      </Head>

      <body suppressHydrationWarning className='font-outfit'>
        <Toaster />
        <ReduxProvider>
          <AppInitializer />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <InitialLoader>
              <ProgressProvider>
                <PageTransitionWrapper>{children}</PageTransitionWrapper>
              </ProgressProvider>
            </InitialLoader>
            <Footer />
            <ScrollToTopButton />
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
