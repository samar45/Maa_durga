'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Trash2, Star } from 'lucide-react'
import { deletePhoto } from '@/app/actions/photos'
import { setCoverPhoto } from '@/app/actions/cover'
import type { Photo } from '@/types'

interface Props {
  photos: Photo[]
  year: number
  isAdmin?: boolean
  yearId?: string
  coverPhotoId?: string | null
}

export default function PhotoLightbox({ photos: initialPhotos, year, isAdmin, yearId, coverPhotoId }: Props) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initialPhotos)
  const [active, setActive] = useState<number | null>(null)
  const [coverId, setCoverId] = useState(coverPhotoId ?? null)
  const [busy, setBusy] = useState(false)

  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(() => setActive((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length])
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close, prev, next])

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  async function handleDelete(photo: Photo, index: number) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setBusy(true)
    await deletePhoto(photo.id, photo.public_id)
    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated)
    if (updated.length === 0) {
      setActive(null)
    } else {
      setActive(Math.min(index, updated.length - 1))
    }
    setBusy(false)
    router.refresh()
  }

  async function handleSetCover(photoId: string) {
    if (!yearId) return
    setBusy(true)
    await setCoverPhoto(yearId, photoId)
    setCoverId(photoId)
    setBusy(false)
    router.refresh()
  }

  if (photos.length === 0) return null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActive(i)}
            className="group aspect-square relative overflow-hidden rounded-lg shadow cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-crimson"
          >
            <Image
              src={photo.cloudinary_url}
              alt={photo.caption ?? `Puja ${year}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Cover badge */}
            {coverId === photo.id && (
              <div className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Star size={10} fill="white" /> Cover
              </div>
            )}
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                {photo.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
            {active + 1} / {photos.length}
          </span>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 md:left-5 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl w-full mx-16 md:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ height: '78vh' }}>
              <Image
                src={photos[active].cloudinary_url}
                alt={photos[active].caption ?? `Puja ${year}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            {photos[active].caption && (
              <p className="text-center text-white/70 text-sm mt-2 px-4">
                {photos[active].caption}
              </p>
            )}

            {/* Admin controls inside lightbox */}
            {isAdmin && (
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={() => handleSetCover(photos[active].id)}
                  disabled={busy || coverId === photos[active].id}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-semibold transition-colors disabled:opacity-50
                    bg-gold hover:bg-gold-light text-white disabled:bg-gold/60"
                >
                  <Star size={12} fill={coverId === photos[active].id ? 'white' : 'none'} />
                  {coverId === photos[active].id ? 'Cover Photo' : 'Set as Cover'}
                </button>
                <button
                  onClick={() => handleDelete(photos[active], active)}
                  disabled={busy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Delete Photo
                </button>
              </div>
            )}
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 md:right-5 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </>
  )
}
