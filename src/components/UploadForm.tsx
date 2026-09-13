'use client'

import { useRef, useState } from 'react'
import { uploadPhotos } from '@/app/actions/photos'
import type { Year } from '@/types'

export default function UploadForm({ years }: { years: Year[] }) {
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
  }

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    await uploadPhotos(formData)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
        <select
          name="year_id"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
        >
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.year}{y.theme ? ` — ${y.theme}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photos * <span className="text-gray-400 font-normal">(select multiple)</span>
        </label>
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          required
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-crimson file:text-white hover:file:bg-crimson-dark cursor-pointer"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className="aspect-square object-cover rounded" />
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caption <span className="text-gray-400 font-normal">(optional, applies to all)</span>
        </label>
        <input
          type="text"
          name="caption"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
          placeholder="e.g. Maa Durga idol on Day 1"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-crimson text-white py-2.5 rounded font-semibold hover:bg-crimson-dark transition-colors disabled:opacity-60"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>
    </form>
  )
}
