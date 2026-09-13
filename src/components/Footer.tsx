'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-crimson-dark text-amber-200 text-center py-6 text-sm">
      <p className="text-gold-light font-medium mb-1">{t('hero_mantra')}</p>
      <p>&copy; {new Date().getFullYear()} Jay Maa Durga. {t('footer_rights')}</p>
    </footer>
  )
}
