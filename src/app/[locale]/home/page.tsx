import { redirect } from 'next/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // Bước quan trọng: phải await trước
  const { locale } = await params

  // Sau đó mới sử dụng
  redirect(`/${locale}/`)
}
