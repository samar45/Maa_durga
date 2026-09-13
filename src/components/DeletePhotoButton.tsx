'use client'

import { deletePhoto } from '@/app/actions/photos'
import { useState } from 'react'

export default function DeletePhotoButton({ photoId, publicId }: { photoId: string; publicId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setLoading(true)
    await deletePhoto(photoId, publicId)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs px-2 py-1 rounded font-semibold"
    >
      {loading ? '...' : 'Delete'}
    </button>
  )
}
