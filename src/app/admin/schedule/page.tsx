import { createClient } from '@/lib/supabase/server'
import { saveScheduleItem, deleteScheduleItem } from '@/app/actions/schedule'
import type { ScheduleItem, ScheduleKind } from '@/types'

const KINDS: ScheduleKind[] = ['puja', 'aarti', 'breakfast', 'lunch', 'dinner', 'other']

const input =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson'

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; edit?: string; error?: string }>
}) {
  const { success, edit, error: actionError } = await searchParams
  const supabase = await createClient()

  const { data, error: loadError } = await supabase
    .from('schedule')
    .select('*')
    .order('day_date', { ascending: true })
    .order('start_time', { ascending: true, nullsFirst: true })

  const items = (data ?? []) as ScheduleItem[]
  const editing = edit ? items.find((i) => i.id === edit) : null

  const days = [...new Set(items.map((i) => i.day_date))]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-crimson mb-6">Schedule</h1>

      {(actionError || loadError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          <p className="font-semibold">Could not {loadError ? 'load' : 'save'} schedule: {actionError ?? loadError?.message}</p>
          {/schema cache|does not exist/i.test(actionError ?? loadError?.message ?? '') && (
            <p className="mt-1">The database table is missing. Run <code>phase2-migration.sql</code> in the Supabase SQL editor.</p>
          )}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
          Schedule saved!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">
          {editing ? `Editing ${editing.title}` : 'Add Schedule Item'}
        </h2>
        <form action={saveScheduleItem} className="space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" name="day_date" required defaultValue={editing?.day_date} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Label</label>
              <input
                type="text"
                name="day_label"
                defaultValue={editing?.day_label ?? ''}
                placeholder="e.g. Saptami"
                className={input}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kind *</label>
              <select name="kind" defaultValue={editing?.kind ?? 'puja'} className={input}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={editing?.title}
              placeholder="e.g. Sandhi Puja"
              className={input}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" name="start_time" defaultValue={editing?.start_time ?? ''} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" name="end_time" defaultValue={editing?.end_time ?? ''} className={input} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              name="details"
              rows={4}
              defaultValue={editing?.details ?? ''}
              placeholder="Menu items, one per line"
              className={`${input} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="bg-crimson text-white px-6 py-2 rounded font-semibold hover:bg-crimson-dark transition-colors text-sm"
          >
            {editing ? 'Update Item' : 'Add Item'}
          </button>
          {editing && (
            <a href="/admin/schedule" className="ml-3 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </a>
          )}
        </form>
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <div key={day}>
            <h3 className="font-bold text-crimson mb-2">
              {day}
              {items.find((i) => i.day_date === day)?.day_label && (
                <span className="text-gold ml-2 font-medium">
                  {items.find((i) => i.day_date === day)?.day_label}
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {items
                .filter((i) => i.day_date === day)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow px-5 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-xs uppercase tracking-wide text-gold font-semibold">{item.kind}</span>
                      <span className="text-gray-800 ml-2">{item.title}</span>
                      {item.start_time && (
                        <span className="text-gray-400 text-xs ml-2">
                          {item.start_time.slice(0, 5)}
                          {item.end_time ? ` - ${item.end_time.slice(0, 5)}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={`/admin/schedule?edit=${item.id}`}
                        className="text-sm text-gold hover:text-gold-light font-medium"
                      >
                        Edit
                      </a>
                      <form
                        action={async () => {
                          'use server'
                          await deleteScheduleItem(item.id)
                        }}
                      >
                        <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
