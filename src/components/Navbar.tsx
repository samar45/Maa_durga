'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const { t, lang, toggle } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/gallery', label: t('nav_gallery') },
    { href: '/history', label: t('nav_history') },
    { href: '/schedule', label: t('nav_schedule') },
    { href: '/donate', label: t('nav_donate') },
    { href: '/feedback', label: t('nav_feedback') },
  ]

  return (
    <header className="bg-crimson text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-gold-light tracking-wide">
          Durga Maa Puja
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-gold-light transition-colors ${
                pathname === href ? 'text-gold-light border-b border-gold-light pb-0.5' : 'text-amber-100'
              }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <Link
              href="/admin"
              className={`hover:text-gold-light transition-colors ${
                pathname.startsWith('/admin') ? 'text-gold-light' : 'text-amber-100'
              }`}
            >
              {t('nav_admin')}
            </Link>
          ) : (
            <Link href="/login" className="bg-gold text-white px-4 py-1.5 rounded hover:bg-gold-light transition-colors">
              {t('nav_login')}
            </Link>
          )}

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="text-xs border border-amber-400/50 text-amber-200 hover:border-amber-300 hover:text-white px-2.5 py-1 rounded transition-colors"
            title="Toggle language"
          >
            {lang === 'en' ? 'ଓଡ଼ିଆ' : 'EN'}
          </button>
        </div>
      </nav>
    </header>
  )
}
