'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'or'

const translations = {
  en: {
    nav_home: 'Home',
    nav_gallery: 'Gallery',
    nav_history: 'History',
    nav_admin: 'Admin',
    nav_login: 'Login',
    nav_donate: 'Donate',
    nav_schedule: 'Schedule',
    nav_feedback: 'Feedback',
    hero_mantra: 'Jay Jagadambe',
    hero_tagline: 'A celebration of devotion — preserving our memories year after year.',
    hero_gallery_btn: 'View Gallery',
    hero_history_btn: 'Our History',
    latest: 'Latest',
    gallery_title: 'Gallery',
    gallery_subtitle: 'Browse our memories year by year',
    no_photos: 'No photos uploaded yet.',
    history_title: 'Our History',
    history_subtitle: 'How it all began, and where we are today',
    history_empty: 'History coming soon.',
    back_gallery: 'Back to Gallery',
    photos: 'photos',
    photo: 'photo',
    no_photos_year: 'No photos for this year yet.',
    share_whatsapp: 'Share on WhatsApp',
    footer_rights: 'All rights reserved.',
    set_cover: 'Set as Cover',
    cover: 'Cover',
  },
  or: {
    nav_home: 'ଘର',
    nav_gallery: 'ଗ୍ୟାଲେରୀ',
    nav_history: 'ଇତିହାସ',
    nav_admin: 'ଆଡ୍ମିନ',
    nav_login: 'ଲଗ ଇନ',
    nav_donate: 'ଦାନ',
    nav_schedule: 'ସମୟସୂଚୀ',
    nav_feedback: 'ମତାମତ',
    hero_mantra: 'ଜୟ ଜଗଦମ୍ବେ',
    hero_tagline: 'ଭକ୍ତିର ଏକ ଉତ୍ସବ — ବର୍ଷ ବର୍ଷ ଧରି ଆମ ସ୍ମୃତି ସଂରକ୍ଷଣ।',
    hero_gallery_btn: 'ଗ୍ୟାଲେରୀ ଦେଖନ୍ତୁ',
    hero_history_btn: 'ଆମ ଇତିହାସ',
    latest: 'ସର୍ବଶେଷ',
    gallery_title: 'ଗ୍ୟାଲେରୀ',
    gallery_subtitle: 'ବର୍ଷ ଅନୁଯାୟୀ ଆମ ସ୍ମୃତି ଦେଖନ୍ତୁ',
    no_photos: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଫଟୋ ଅପଲୋଡ ହୋଇନାହିଁ।',
    history_title: 'ଆମ ଇତିହାସ',
    history_subtitle: 'ଏହା କିପରି ଆରମ୍ଭ ହୋଇଥିଲା ଓ ଆଜି ଆମେ କୋଉଠି',
    history_empty: 'ଇତିହାସ ଶୀଘ୍ର ଆସୁଛି।',
    back_gallery: 'ଗ୍ୟାଲେରୀକୁ ଫେରନ୍ତୁ',
    photos: 'ଫଟୋ',
    photo: 'ଫଟୋ',
    no_photos_year: 'ଏ ବର୍ଷ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଫଟୋ ନାହିଁ।',
    share_whatsapp: 'WhatsApp ରେ ଶେୟାର କରନ୍ତୁ',
    footer_rights: 'ସର୍ବ ସ୍ୱତ୍ୱ ସଂରକ୍ଷିତ।',
    set_cover: 'କଭର ଭାବରେ ସେଟ କରନ୍ତୁ',
    cover: 'କଭର',
  },
} as const

export type TranslationKey = keyof typeof translations.en

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggle: () => {},
  t: (key) => translations.en[key],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage after hydration to avoid SSR mismatch
    if (stored === 'en' || stored === 'or') setLang(stored)
  }, [])

  function toggle() {
    setLang((prev) => {
      const next = prev === 'en' ? 'or' : 'en'
      localStorage.setItem('lang', next)
      return next
    })
  }

  const t = (key: TranslationKey) => translations[lang][key]

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
