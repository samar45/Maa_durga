import { createClient } from '@/lib/supabase/server'
import UploadForm from '@/components/UploadForm'
import type { Year } from '@/types'

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createClient()

  const { data: years } = await supabase
    .from('years')
    .select('id, year, theme')
    .order('year', { ascending: false })

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-crimson mb-6">Upload Photos</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
          Photos uploaded successfully!
        </div>
      )}

      {!years?.length ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded text-sm">
          No years added yet.{' '}
          <a href="/admin/years" className="underline font-medium">
            Add a year first
          </a>{' '}
          before uploading photos.
        </div>
      ) : (
        <UploadForm years={years as Year[]} />
      )}
    </div>
  )
}
