// app/[locale]/not-found.tsx
'use client' // để dùng useParams()
import { useParams, useRouter } from 'next/navigation'

import image from '@/assets/images/original-743c2e1ea63d2ae97d9286d0cab9be6b.gif'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function LocaleNotFound() {
  const { locale } = useParams()
  const { push } = useRouter()
  const t = useTranslations('notfound')
  return (
    <>
      <div className='bg-black h-[135px] w-full'></div>

      <main className='flex justify-center items-center flex-col mb-20'>
        <Image
          src={image.src}
          alt='header-bg-copyright'
          width={800}
          height={800}
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 50vw'
          priority // nếu đây là background quan trọng cần load sớm
        />

        <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center'>
          404 – {t('Pagenotfound')}
        </h1>
        <button
          type='button'
          aria-label='Play video'
          onClick={() => push(`/${locale}`)}
          className='px-6 py-3 cursor-pointer bg-red-100 text-red-500 font-semibold rounded-lg hover:bg-red-200'
        >
          {t('Returntohomepage')}
        </button>
      </main>
    </>
  )
}
