import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import T from '@/components/T'
import type { Photo } from '@/types'

export const revalidate = 0

type CoverPhoto = Pick<Photo, 'id' | 'cloudinary_url'> | null
type YearRow = {
  id: string
  year: number
  theme: string | null
  cover_photo_id: string | null
  cover_photo: CoverPhoto
  all_photos: Pick<Photo, 'id' | 'cloudinary_url'>[]
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('years')
    .select(`
      id, year, theme, cover_photo_id,
      cover_photo:photos!cover_photo_id(id, cloudinary_url),
      all_photos:photos!year_id(id, cloudinary_url)
    `)
    .order('year', { ascending: false })

  const yearList = (data as unknown as YearRow[] | null) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-crimson"><T k="gallery_title" /></h1>
        <p className="text-amber-700 mt-2"><T k="gallery_subtitle" /></p>
      </div>

      {yearList.length === 0 ? (
        <p className="text-center text-gray-500 py-20"><T k="no_photos" /></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearList.map((year) => {
            // Use selected cover photo, else fall back to first uploaded photo
            const coverUrl = year.cover_photo?.cloudinary_url ?? year.all_photos?.[0]?.cloudinary_url ?? null
            const count = year.all_photos?.length ?? 0
            return (
              <Link
                key={year.id}
                href={`/gallery/${year.year}`}
                className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] relative bg-crimson/10">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={`Puja ${year.year}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-crimson/30 text-6xl font-bold">
                      {year.year}
                    </div>
                  )}
                  {count > 0 && (
                    <div className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      {count} <T k={count === 1 ? 'photo' : 'photos'} />
                    </div>
                  )}
                </div>
                <div className="bg-white px-5 py-4 border-t-4 border-gold">
                  <h2 className="text-xl font-bold text-crimson">{year.year}</h2>
                  {year.theme && <p className="text-amber-700 text-sm mt-0.5 italic">{year.theme}</p>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
