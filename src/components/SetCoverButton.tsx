'use client'

import { setCoverPhoto } from '@/app/actions/cover'
import { useState } from 'react'

export default function SetCoverButton({
  yearId,
  photoId,
  isCurrent,
}: {
  yearId: string
  photoId: string
  isCurrent: boolean
}) {
  const [loading, setLoading] = useState(false)

  if (isCurrent) {
    return (
      <span className="bg-gold text-white text-xs px-2 py-1 rounded font-semibold">
        Cover
      </span>
    )
  }

  async function handle() {
    setLoading(true)
    await setCoverPhoto(yearId, photoId)
    setLoading(false)
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="bg-gold/80 hover:bg-gold disabled:opacity-60 text-white text-xs px-2 py-1 rounded font-semibold transition-colors"
    >
      {loading ? '...' : 'Set Cover'}
    </button>
  )
}
