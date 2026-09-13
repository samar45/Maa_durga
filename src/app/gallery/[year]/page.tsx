import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft } from 'lucide-react'
import PhotoLightbox from '@/components/PhotoLightbox'
import WhatsAppShare from '@/components/WhatsAppShare'
import T from '@/components/T'
import type { Photo } from '@/types'

export const revalidate = 0

export default async function YearGalleryPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params
  const yearNum = parseInt(year)
  if (isNaN(yearNum)) notFound()

  const supabase = await createClient()

  const [{ data: yearData }, { data: { user } }] = await Promise.all([
    supabase
      .from('years')
      .select('id, year, theme, description, cover_photo_id, year_photos:photos!year_id(*)')
      .eq('year', yearNum)
      .maybeSingle(),
    supabase.auth.getUser(),
  ])

  if (!yearData) notFound()

  const photos: Photo[] = (yearData as unknown as { year_photos: Photo[] }).year_photos ?? []

  let isAdmin = false
  if (user) {
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    isAdmin = !!role
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Link href="/gallery" className="inline-flex items-center gap-1 text-crimson hover:text-crimson-dark text-sm font-medium">
          <ChevronLeft size={16} />
          <T k="back_gallery" />
        </Link>
        <WhatsAppShare year={yearNum} />
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-crimson">Puja {yearData.year}</h1>
        {yearData.theme && <p className="text-amber-700 mt-1 italic text-lg">{yearData.theme}</p>}
        {yearData.description && <p className="text-gray-600 mt-3 max-w-2xl">{yearData.description}</p>}
        <div className="flex items-center gap-3 mt-2">
          <p className="text-gray-400 text-sm">
            {photos.length} <T k={photos.length === 1 ? 'photo' : 'photos'} />
          </p>
          {isAdmin && (
            <span className="text-xs bg-crimson/10 text-crimson px-2 py-0.5 rounded">
              Admin — click any photo to delete or set cover
            </span>
          )}
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="text-gray-500 py-10 text-center"><T k="no_photos_year" /></p>
      ) : (
        <PhotoLightbox
          photos={photos}
          year={yearNum}
          isAdmin={isAdmin}
          yearId={yearData.id}
          coverPhotoId={yearData.cover_photo_id ?? null}
        />
      )}
    </div>
  )
}
