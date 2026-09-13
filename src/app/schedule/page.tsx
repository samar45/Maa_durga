import { createClient } from '@/lib/supabase/server'
import T from '@/components/T'
import type { ScheduleItem } from '@/types'
import { fmtRange, fmtDate } from '@/lib/format'

export const revalidate = 0

const MEALS = ['breakfast', 'lunch', 'dinner'] as const


export default async function SchedulePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('schedule')
    .select('*')
    .order('day_date', { ascending: true })
    .order('start_time', { ascending: true, nullsFirst: true })

  const items = (data ?? []) as ScheduleItem[]
  const days = [...new Set(items.map((i) => i.day_date))]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-crimson"><T k="nav_schedule" /></h1>
        <p className="text-amber-700 mt-2">Puja, aarti and prasad timings</p>
      </div>

      {!days.length ? (
        <p className="text-center text-gray-500 py-20">Schedule will be announced soon.</p>
      ) : (
        <div className="space-y-8">
          {days.map((day) => {
            const dayItems = items.filter((i) => i.day_date === day)
            const label = dayItems.find((i) => i.day_label)?.day_label
            const rituals = dayItems.filter((i) => i.kind === 'puja' || i.kind === 'aarti' || i.kind === 'other')
            const meals = MEALS.map((m) => ({ kind: m, item: dayItems.find((i) => i.kind === m) }))

            return (
              <div key={day} className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
                <div className="bg-crimson text-white px-6 py-3 flex flex-wrap items-baseline gap-x-3">
                  <h2 className="font-bold">{fmtDate(day)}</h2>
                  {label && <span className="text-gold font-semibold text-sm">{label}</span>}
                </div>

                <div className="p-6 space-y-6">
                  {rituals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gold mb-3">Puja &amp; Aarti</h3>
                      <ul className="space-y-3 border-l-2 border-gold/40 pl-4">
                        {rituals.map((item) => (
                          <li key={item.id}>
                            <div className="flex flex-wrap items-baseline gap-x-3">
                              <span className="font-semibold text-crimson">{item.title}</span>
                              {item.start_time && (
                                <span className="text-sm text-amber-700">{fmtRange(item.start_time, item.end_time)}</span>
                              )}
                            </div>
                            {item.details && (
                              <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line">{item.details}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {meals.some((m) => m.item) && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gold mb-3">Prasad / Meals</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {meals.map(({ kind, item }) => (
                          <div key={kind} className="bg-warm-white rounded-lg p-4 border border-amber-100">
                            <p className="font-semibold text-crimson capitalize">{kind}</p>
                            {item?.start_time && (
                              <p className="text-xs text-amber-700 mt-0.5">{fmtRange(item.start_time, item.end_time)}</p>
                            )}
                            {item?.details ? (
                              <ul className="mt-2 space-y-0.5 text-sm text-gray-700 list-disc list-inside">
                                {item.details
                                  .split('\n')
                                  .map((l) => l.trim())
                                  .filter(Boolean)
                                  .map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-sm text-gray-400">{item ? item.title : 'To be announced'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
