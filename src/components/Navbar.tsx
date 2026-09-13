'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const { t, lang, toggle } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // close the drawer on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync drawer with route change
    setOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/gallery', label: t('nav_gallery') },
    { href: '/schedule', label: t('nav_schedule') },
    { href: '/history', label: t('nav_history') },
    { href: '/donate', label: t('nav_donate') },
    { href: '/feedback', label: t('nav_feedback') },
  ]

  const linkClass = (href: string, mobile = false) =>
    `${mobile ? 'block px-4 py-3 rounded-lg text-base' : 'text-sm'} hover:text-gold-light transition-colors ${
      pathname === href
        ? mobile ? 'bg-crimson-dark text-gold-light' : 'text-gold-light border-b border-gold-light pb-0.5'
        : 'text-amber-100'
    }`

  const authLink = (mobile = false) =>
    user ? (
      <Link href="/admin" className={linkClass('/admin', mobile)}>{t('nav_admin')}</Link>
    ) : (
      <Link href="/login" className={`bg-gold text-white rounded hover:bg-gold-light transition-colors ${mobile ? 'block text-center px-4 py-3 text-base' : 'px-4 py-1.5 text-sm'}`}>
        {t('nav_login')}
      </Link>
    )

  const langButton = (
    <button
      onClick={toggle}
      className="text-xs border border-amber-400/50 text-amber-200 hover:border-amber-300 hover:text-white px-2.5 py-1 rounded transition-colors"
      title="Toggle language"
    >
      {lang === 'en' ? 'ଓଡ଼ିଆ' : 'EN'}
    </button>
  )

  return (
    <header className="bg-crimson text-white shadow-lg sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-gold-light tracking-wide">
          Jay Maa Durga
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>{label}</Link>
          ))}
          {authLink()}
          {langButton}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          {langButton}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="p-2 -mr-2 rounded hover:bg-crimson-dark transition-colors"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-amber-400/30 px-4 pb-4 pt-2 space-y-1 font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href, true)}>{label}</Link>
          ))}
          <div className="pt-2">{authLink(true)}</div>
        </div>
      )}
    </header>
  )
}
