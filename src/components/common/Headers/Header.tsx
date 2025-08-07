// Header.tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import MobileMenu from '@/components/common/Headers/MobileMenu'

const Logo = dynamic(() => import('../Logo/Logo'), { ssr: false })
const Navigation = dynamic(() => import('./Navigation'), { ssr: false })
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  ssr: false,
})
const CartButton = dynamic(() => import('./CartButton'), { ssr: false })
const UserButton = dynamic(() => import('./UserButton'), { ssr: false })

const headerVariants = {
  top: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    backgroundColor: 'rgba(255,255,255,0)',
    boxShadow: 'none',
    color: '#FFF',
  },
  scrolled: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    backgroundColor: '#FFF',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
    color: '#000',
  },
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    const isTop = window.scrollY === 0
    setScrolled(prev => (prev === !isTop ? prev : !isTop))
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <motion.header
      variants={headerVariants}
      initial='top'
      animate={scrolled ? 'scrolled' : 'top'}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className='fixed top-0 left-0 w-full z-50 border-b border-white/10'
    >
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        <Logo scrolled={scrolled} />

        <nav className='hidden xl:flex flex-grow justify-center'>
          <Navigation />
        </nav>

        <div className='flex items-center xl:space-x-6 space-x-2'>
          <div className='hidden xl:flex'>
            <LanguageSwitcher />
          </div>
          <CartButton />
          <div className='hidden xl:flex'>
            <UserButton />
          </div>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  )
}
