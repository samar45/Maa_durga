import { createClient } from '@/lib/supabase/server'
import { addYear } from '@/app/actions/years'
import type { Year } from '@/types'

export default async function ManageYearsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createClient()

  const { data: years } = await supabase
    .from('years')
    .select('*, photos(id)')
    .order('year', { ascending: false })

  type YearWithCount = Year & { photos: { id: string }[] }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-crimson mb-6">Manage Years</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
          Saved successfully!
        </div>
      )}

      {/* Add year form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Add New Year</h2>
        <form action={addYear} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                name="year"
                required
                min="1900"
                max="2100"
                defaultValue={new Date().getFullYear()}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <input
                type="text"
                name="theme"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
                placeholder="e.g. Shakti Swarupa"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson resize-none"
              placeholder="Brief note about this year's puja"
            />
          </div>
          <button
            type="submit"
            className="bg-crimson text-white px-6 py-2 rounded font-semibold hover:bg-crimson-dark transition-colors text-sm"
          >
            Add Year
          </button>
        </form>
      </div>

      {/* Year list */}
      <div className="space-y-3">
        {(years as YearWithCount[] | null)?.map((y) => (
          <div key={y.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-crimson text-lg">{y.year}</span>
              {y.theme && <span className="text-amber-700 text-sm ml-2 italic">{y.theme}</span>}
              <p className="text-gray-400 text-xs mt-0.5">{y.photos?.length ?? 0} photos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
