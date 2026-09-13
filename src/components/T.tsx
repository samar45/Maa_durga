'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/contexts/LanguageContext'

export default function T({ k }: { k: TranslationKey }) {
  const { t } = useLanguage()
  return <>{t(k)}</>
}
