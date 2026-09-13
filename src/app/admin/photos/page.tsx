import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import DeletePhotoButton from '@/components/DeletePhotoButton'
import SetCoverButton from '@/components/SetCoverButton'
import type { Year, Photo } from '@/types'

export default async function ManagePhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ year_id?: string }>
}) {
  const { year_id } = await searchParams
  const supabase = await createClient()

  const { data: years } = await supabase
    .from('years')
    .select('id, year, theme, cover_photo_id')
    .order('year', { ascending: false })

  const { data: photos } = year_id
    ? await supabase
        .from('photos')
        .select('*')
        .eq('year_id', year_id)
        .order('created_at', { ascending: false })
    : { data: null }

  const selectedYear = (years as (Year & { cover_photo_id: string | null })[] | null)?.find((y) => y.id === year_id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-crimson mb-6">Manage Photos</h1>

      {/* Year selector */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-8">
        <form method="GET" className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
            <select
              name="year_id"
              defaultValue={year_id ?? ''}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
            >
              <option value="">Choose a year...</option>
              {(years as Year[] | null)?.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year}{y.theme ? ` — ${y.theme}` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-crimson text-white px-5 py-2 rounded font-semibold hover:bg-crimson-dark transition-colors text-sm"
          >
            Load Photos
          </button>
        </form>
      </div>

      {year_id && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">
              {selectedYear?.year} — {photos?.length ?? 0} photos
            </h2>
            <p className="text-xs text-gray-400">Hover a photo to set cover or delete</p>
          </div>

          {!photos?.length ? (
            <p className="text-gray-400 text-sm">No photos for this year.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(photos as Photo[]).map((photo) => (
                <div key={photo.id} className="group relative rounded-lg overflow-hidden shadow bg-gray-100 aspect-square">
                  <Image
                    src={photo.cloudinary_url}
                    alt={photo.caption ?? ''}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                      {photo.caption}
                    </div>
                  )}
                  {/* Action buttons on hover */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <SetCoverButton
                      yearId={year_id}
                      photoId={photo.id}
                      isCurrent={selectedYear?.cover_photo_id === photo.id}
                    />
                    <DeletePhotoButton photoId={photo.id} publicId={photo.public_id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
