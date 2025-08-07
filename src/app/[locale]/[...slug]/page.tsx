// app/[locale]/[...slug]/page.tsx
import { notFound } from 'next/navigation'

export default function CatchAll() {
  // Gọi notFound() để Next.js render app/[locale]/not-found.tsx
  notFound()
}
