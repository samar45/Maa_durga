import { createClient } from '@/lib/supabase/server'
import { saveHistoryEntry } from '@/app/actions/history'
import type { HistoryEntry } from '@/types'

export default async function AdminHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; edit?: string }>
}) {
  const { success, edit } = await searchParams
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('history')
    .select('*')
    .order('year', { ascending: false })

  const editing = edit ? (entries as HistoryEntry[] | null)?.find((e) => e.id === edit) : null

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-crimson mb-6">Edit History</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
          History saved!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">
          {editing ? `Editing ${editing.year}` : 'Add History Entry'}
        </h2>
        <form action={saveHistoryEntry} className="space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex gap-3">
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                name="year"
                required
                defaultValue={editing?.year ?? new Date().getFullYear()}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editing?.title}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
                placeholder="e.g. The Beginning"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Story *</label>
            <textarea
              name="story_text"
              required
              rows={6}
              defaultValue={editing?.story_text}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson resize-none"
              placeholder="Write the history for this year..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-white hover:file:bg-gold-light cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="bg-crimson text-white px-6 py-2 rounded font-semibold hover:bg-crimson-dark transition-colors text-sm"
          >
            {editing ? 'Update Entry' : 'Add Entry'}
          </button>
          {editing && (
            <a href="/admin/history" className="ml-3 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </a>
          )}
        </form>
      </div>

      <div className="space-y-3">
        {(entries as HistoryEntry[] | null)?.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-crimson">{entry.year}</span>
              <span className="text-gray-700 ml-2">{entry.title}</span>
              {entry.image_urls?.length > 0 && (
                <span className="text-gray-400 text-xs ml-2">({entry.image_urls.length} images)</span>
              )}
            </div>
            <a
              href={`/admin/history?edit=${entry.id}`}
              className="text-sm text-gold hover:text-gold-light font-medium"
            >
              Edit
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
